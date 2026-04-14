import { randomUUID } from 'node:crypto';
import { db } from '../db/database.js';

const insertStatement = db.prepare(`
  INSERT INTO user_history (id, user_id, action, target_type, target_id, metadata, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const selectByUserStatement = db.prepare(`
  SELECT
    id,
    user_id AS userId,
    action,
    target_type AS targetType,
    target_id AS targetId,
    metadata,
    created_at AS createdAt
  FROM user_history
  WHERE user_id = ?
  ORDER BY created_at DESC
  LIMIT ?
`);

const safeParseJson = (value) => {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export const createUserHistoryStore = () => {
  const add = async ({ userId, action, targetType = null, targetId = null, metadata = null }) => {
    const entry = {
      id: randomUUID(),
      userId,
      action: action.trim(),
      targetType: targetType?.trim() || null,
      targetId: targetId?.trim() || null,
      metadata: metadata ? JSON.stringify(metadata) : null,
      createdAt: new Date().toISOString()
    };

    insertStatement.run(
      entry.id,
      entry.userId,
      entry.action,
      entry.targetType,
      entry.targetId,
      entry.metadata,
      entry.createdAt
    );

    return {
      ...entry,
      metadata
    };
  };

  const listByUserId = async (userId, limit = 50) => {
    const safeLimit = Math.max(1, Math.min(Number(limit) || 50, 200));
    const rows = selectByUserStatement.all(userId, safeLimit);

    return rows.map((row) => ({
      ...row,
      metadata: safeParseJson(row.metadata)
    }));
  };

  return {
    add,
    listByUserId
  };
};
