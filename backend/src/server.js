import { randomInt } from 'node:crypto';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import { databasePath } from './db/database.js';
import { createEmailStore } from './store/emailStore.js';
import { createPasswordResetStore } from './store/passwordResetStore.js';
import { createUserHistoryStore } from './store/userHistoryStore.js';
import { createUserStore } from './store/userStore.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3001;
const configuredOrigins = (process.env.FRONTEND_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const minimumPasswordLength = 6;
const minimumNameLength = 2;
const resetCodeTtlMinutes = Number(process.env.RESET_CODE_TTL_MINUTES) || 15;

const getDisplayNameFromEmail = (email) => {
  const [localPart] = email.split('@');
  const candidate = localPart.trim();
  return candidate || email.trim();
};

const corsOptions = configuredOrigins.length
  ? {
      origin(origin, callback) {
        if (!origin || configuredOrigins.includes(origin)) {
          callback(null, true);
          return;
        }
        callback(new Error('Origin not allowed by CORS'));
      }
    }
  : { origin: true };

const emailStore = createEmailStore();
const userStore = createUserStore();
const userHistoryStore = createUserHistoryStore();
const passwordResetStore = createPasswordResetStore();

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_req, res) => {
  res.status(200).json({ ok: true, databasePath });
});

app.post('/api/auth/signup', async (req, res) => {
  const rawName = typeof req.body?.name === 'string' ? req.body.name : '';
  const rawEmail = typeof req.body?.email === 'string' ? req.body.email : '';
  const rawPassword = typeof req.body?.password === 'string' ? req.body.password : '';
  const name = rawName.trim().replace(/\s+/g, ' ');
  const email = rawEmail.trim();
  const password = rawPassword.trim();

  if (name.length < minimumNameLength) {
    res.status(400).json({ message: 'Name must have at least 2 characters.' });
    return;
  }

  if (!email || !emailPattern.test(email)) {
    res.status(400).json({ message: 'Invalid email.' });
    return;
  }

  if (password.length < minimumPasswordLength) {
    res.status(400).json({ message: 'Password must have at least 6 characters.' });
    return;
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await userStore.create({ name, email, passwordHash });

    if (!result.created) {
      res.status(409).json({ message: 'Email already registered.' });
      return;
    }

    try {
      await userHistoryStore.add({
        userId: result.user.id,
        action: 'signup',
        metadata: { email: result.user.email }
      });
    } catch (historyError) {
      console.error('Failed to save signup history', historyError);
    }

    res.status(201).json({
      message: 'Account created successfully.',
      user: { id: result.user.id, name: result.user.name, email: result.user.email }
    });
  } catch (error) {
    console.error('Failed to signup user', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const rawEmail = typeof req.body?.email === 'string' ? req.body.email : '';
  const rawPassword = typeof req.body?.password === 'string' ? req.body.password : '';
  const email = rawEmail.trim();
  const password = rawPassword.trim();

  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required.' });
    return;
  }

  try {
    const user = await userStore.findByEmail(email);

    if (!user) {
      res.status(401).json({ message: 'Invalid email or password.' });
      return;
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
      res.status(401).json({ message: 'Invalid email or password.' });
      return;
    }

    const displayName = user.name || getDisplayNameFromEmail(user.email);

    try {
      await userHistoryStore.add({
        userId: user.id,
        action: 'login',
        metadata: { email: user.email }
      });
    } catch (historyError) {
      console.error('Failed to save login history', historyError);
    }

    res.status(200).json({
      message: 'Login successful.',
      user: { id: user.id, name: displayName, email: user.email }
    });
  } catch (error) {
    console.error('Failed to login user', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

app.post('/api/auth/forgot-password', async (req, res) => {
  const rawEmail = typeof req.body?.email === 'string' ? req.body.email : '';
  const email = rawEmail.trim().toLowerCase();

  if (!email || !emailPattern.test(email)) {
    res.status(400).json({ message: 'Invalid email.' });
    return;
  }

  try {
    const user = await userStore.findByEmail(email);

    if (!user) {
      res.status(200).json({
        message: 'If this email exists, a recovery code has been generated.'
      });
      return;
    }

    const resetCode = String(randomInt(0, 1_000_000)).padStart(6, '0');
    const codeHash = await bcrypt.hash(resetCode, 8);
    const expiresAt = new Date(Date.now() + resetCodeTtlMinutes * 60 * 1000).toISOString();

    await passwordResetStore.create({
      userId: user.id,
      email: user.email,
      codeHash,
      expiresAt
    });

    try {
      await userHistoryStore.add({
        userId: user.id,
        action: 'password_reset_requested',
        metadata: { email: user.email }
      });
    } catch (historyError) {
      console.error('Failed to save password reset request history', historyError);
    }

    res.status(200).json({
      message: `Recovery code created. Use it within ${resetCodeTtlMinutes} minutes.`,
      resetCode,
      expiresAt
    });
  } catch (error) {
    console.error('Failed to generate password reset code', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

app.post('/api/auth/reset-password', async (req, res) => {
  const rawEmail = typeof req.body?.email === 'string' ? req.body.email : '';
  const rawCode = typeof req.body?.code === 'string' ? req.body.code : '';
  const rawNewPassword = typeof req.body?.newPassword === 'string' ? req.body.newPassword : '';
  const email = rawEmail.trim().toLowerCase();
  const code = rawCode.trim();
  const newPassword = rawNewPassword.trim();

  if (!email || !emailPattern.test(email)) {
    res.status(400).json({ message: 'Invalid email.' });
    return;
  }

  if (!code) {
    res.status(400).json({ message: 'Recovery code is required.' });
    return;
  }

  if (newPassword.length < minimumPasswordLength) {
    res.status(400).json({ message: 'Password must have at least 6 characters.' });
    return;
  }

  try {
    const user = await userStore.findByEmail(email);

    if (!user) {
      res.status(400).json({ message: 'Invalid email or recovery code.' });
      return;
    }

    const token = await passwordResetStore.findActiveByEmail(email);

    if (!token) {
      res.status(400).json({ message: 'Recovery code expired or not found.' });
      return;
    }

    const validCode = await bcrypt.compare(code, token.codeHash);

    if (!validCode) {
      res.status(400).json({ message: 'Invalid email or recovery code.' });
      return;
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    const updated = await userStore.updatePasswordHash(user.id, passwordHash);

    if (!updated) {
      res.status(500).json({ message: 'Could not update password.' });
      return;
    }

    await passwordResetStore.consume(token.id);

    try {
      await userHistoryStore.add({
        userId: user.id,
        action: 'password_reset_completed',
        metadata: { email: user.email }
      });
    } catch (historyError) {
      console.error('Failed to save password reset completion history', historyError);
    }

    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Failed to reset password', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

app.post('/api/users/:userId/history', async (req, res) => {
  const userId = typeof req.params?.userId === 'string' ? req.params.userId.trim() : '';
  const action = typeof req.body?.action === 'string' ? req.body.action.trim() : '';
  const targetType = typeof req.body?.targetType === 'string' ? req.body.targetType : null;
  const targetId = typeof req.body?.targetId === 'string' ? req.body.targetId : null;
  const metadata = req.body?.metadata && typeof req.body.metadata === 'object' ? req.body.metadata : null;

  if (!userId) {
    res.status(400).json({ message: 'User id is required.' });
    return;
  }

  if (!action) {
    res.status(400).json({ message: 'Action is required.' });
    return;
  }

  try {
    const user = await userStore.findById(userId);

    if (!user) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    const item = await userHistoryStore.add({
      userId,
      action,
      targetType,
      targetId,
      metadata
    });

    res.status(201).json({ message: 'History entry saved.', item });
  } catch (error) {
    console.error('Failed to save user history', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

app.get('/api/users/:userId/history', async (req, res) => {
  const userId = typeof req.params?.userId === 'string' ? req.params.userId.trim() : '';
  const requestedLimit = Number(req.query?.limit);
  const limit = Number.isFinite(requestedLimit) ? requestedLimit : 50;

  if (!userId) {
    res.status(400).json({ message: 'User id is required.' });
    return;
  }

  try {
    const user = await userStore.findById(userId);

    if (!user) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    const items = await userHistoryStore.listByUserId(userId, limit);
    res.status(200).json({ items });
  } catch (error) {
    console.error('Failed to list user history', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

app.post('/api/emails', async (req, res) => {
  const rawEmail = typeof req.body?.email === 'string' ? req.body.email : '';
  const email = rawEmail.trim();

  if (!email || !emailPattern.test(email)) {
    res.status(400).json({ message: 'Invalid email.' });
    return;
  }

  try {
    const result = await emailStore.save(email);

    if (result.created) {
      res.status(201).json({ message: 'Email saved successfully.', email: result.record.email });
      return;
    }

    res.status(200).json({ message: 'Email already saved.', email: result.record.email });
  } catch (error) {
    console.error('Failed to save email', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

app.listen(port, () => {
  console.log(`HMDb backend running on http://localhost:${port}`);
});
