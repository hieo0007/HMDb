import { randomUUID } from 'node:crypto';
import { db } from '../db/database.js';

const normalizeEmail = (value) => value.trim().toLowerCase();

const cleanupExpiredStatement = db.prepare(`
  DELETE FROM password_reset_tokens
  WHERE consumed_at IS NULL
    AND expires_at <= ?
`);

const deleteActiveByEmailStatement = db.prepare(`
  DELETE FROM password_reset_tokens
  WHERE email = ?
    AND consumed_at IS NULL
`);

const insertStatement = db.prepare(`
  INSERT INTO password_reset_tokens (
    id,
    user_id,
    email,
    code_hash,
    expires_at,
    consumed_at,
    created_at
  )
  VALUES (?, ?, ?, ?, ?, NULL, ?)
`);

const selectActiveByEmailStatement = db.prepare(`
  SELECT
    id,
    user_id AS userId,
    email,
    code_hash AS codeHash,
    expires_at AS expiresAt,
    consumed_at AS consumedAt,
    created_at AS createdAt
  FROM password_reset_tokens
  WHERE email = ?
    AND consumed_at IS NULL
  ORDER BY created_at DESC
  LIMIT 1
`);

const consumeByIdStatement = db.prepare(`
  UPDATE password_reset_tokens
  SET consumed_at = ?
  WHERE id = ?
    AND consumed_at IS NULL
`);

export const createPasswordResetStore = () => {
  const cleanupExpired = async () => {
    const now = new Date().toISOString();
    cleanupExpiredStatement.run(now);
  };

  const create = async ({ userId, email: rawEmail, codeHash, expiresAt }) => {
    const email = normalizeEmail(rawEmail);
    const createdAt = new Date().toISOString();

    await cleanupExpired();
    deleteActiveByEmailStatement.run(email);

    const token = {
      id: randomUUID(),
      userId,
      email,
      codeHash,
      expiresAt,
      consumedAt: null,
      createdAt
    };

    insertStatement.run(
      token.id,
      token.userId,
      token.email,
      token.codeHash,
      token.expiresAt,
      token.createdAt
    );

    return token;
  };

  const findActiveByEmail = async (rawEmail) => {
    const email = normalizeEmail(rawEmail);
    await cleanupExpired();
    return selectActiveByEmailStatement.get(email) || null;
  };

  const consume = async (tokenId) => {
    const consumedAt = new Date().toISOString();
    const result = consumeByIdStatement.run(consumedAt, tokenId);
    return result.changes > 0;
  };

  return {
    create,
    findActiveByEmail,
    consume
  };
};
