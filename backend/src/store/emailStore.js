import { db } from '../db/database.js';

const normalizeEmail = (value) => value.trim().toLowerCase();

const selectByEmailStatement = db.prepare(`
  SELECT email, created_at AS createdAt
  FROM emails
  WHERE email = ?
  LIMIT 1
`);

const insertStatement = db.prepare(`
  INSERT INTO emails (email, created_at)
  VALUES (?, ?)
`);

export const createEmailStore = () => {
  const save = async (rawEmail) => {
    const email = normalizeEmail(rawEmail);
    const existing = selectByEmailStatement.get(email);

    if (existing) {
      return { created: false, record: existing };
    }

    const record = {
      email,
      createdAt: new Date().toISOString()
    };

    insertStatement.run(record.email, record.createdAt);
    return { created: true, record };
  };

  return { save };
};
