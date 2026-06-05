import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { config } from '../config';
import { logger } from '../utils/logger';

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    throw new Error('数据库未初始化，请先调用 initDatabase()');
  }
  return db;
}

export function initDatabase(): Database.Database {
  const dbDir = path.dirname(config.dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  db = new Database(config.dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  // 执行迁移
  const migrationPath = path.join(__dirname, 'migrations', '001_init.sql');
  const sql = fs.readFileSync(migrationPath, 'utf-8');
  db.exec(sql);

  logger.info(`数据库初始化完成: ${config.dbPath}`);
  return db;
}

export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
    logger.info('数据库连接已关闭');
  }
}
