import { randomUUID } from 'node:crypto';
import { db } from '../db/database.js';

const normalizeEmail = (value) => value.trim().toLowerCase();
const normalizeName = (value) => value.trim().replace(/\s+/g, ' ');

const selectByEmailStatement = db.prepare(`
  SELECT id, name, email, password_hash AS passwordHash, created_at AS createdAt
  FROM users
  WHERE email = ?
  LIMIT 1
`);

const selectByIdStatement = db.prepare(`
  SELECT id, name, email, password_hash AS passwordHash, created_at AS createdAt
  FROM users
  WHERE id = ?
  LIMIT 1
`);

const insertStatement = db.prepare(`
  INSERT INTO users (id, name, email, password_hash, created_at)
  VALUES (?, ?, ?, ?, ?)
`);

const updatePasswordHashStatement = db.prepare(`
  UPDATE users
  SET password_hash = ?
  WHERE id = ?
`);

export const createUserStore = () => {
  const findByEmail = async (rawEmail) => {
    const email = normalizeEmail(rawEmail);
    return selectByEmailStatement.get(email) || null;
  };

  const findById = async (userId) => selectByIdStatement.get(userId) || null;

  const create = async ({ name: rawName, email: rawEmail, passwordHash }) => {
    const email = normalizeEmail(rawEmail);
    const name = normalizeName(rawName);
    const existing = selectByEmailStatement.get(email);

    if (existing) {
      return { created: false, user: existing };
    }

    const user = {
      id: randomUUID(),
      name,
      email,
      passwordHash,
      createdAt: new Date().toISOString()
    };

    insertStatement.run(user.id, user.name, user.email, user.passwordHash, user.createdAt);
    return { created: true, user };
  };

  const updatePasswordHash = async (userId, passwordHash) => {
    const result = updatePasswordHashStatement.run(passwordHash, userId);
    return result.changes > 0;
  };

  return {
    create,
    findByEmail,
    findById,
    updatePasswordHash
  };
};
