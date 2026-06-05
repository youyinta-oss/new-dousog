-- migrations/001_init.sql

-- 账号表
CREATE TABLE IF NOT EXISTS accounts (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  qq_number   TEXT    NOT NULL UNIQUE,
  nickname    TEXT    DEFAULT '',
  cookie_valid INTEGER DEFAULT 0,
  status      TEXT    DEFAULT 'active',
  created_at  TEXT    DEFAULT (datetime('now', 'localtime')),
  updated_at  TEXT    DEFAULT (datetime('now', 'localtime'))
);

-- 活动表
CREATE TABLE IF NOT EXISTS activities (
  id          TEXT    PRIMARY KEY,
  name        TEXT    NOT NULL,
  url         TEXT    NOT NULL UNIQUE,
  type        TEXT    NOT NULL,
  source      TEXT    NOT NULL,
  status      TEXT    DEFAULT 'active',
  start_date  TEXT,
  end_date    TEXT,
  rewards     TEXT    DEFAULT '[]',
  selectors   TEXT    DEFAULT '{}',
  actions     TEXT    DEFAULT '[]',
  last_checked TEXT,
  created_at  TEXT    DEFAULT (datetime('now', 'localtime')),
  updated_at  TEXT    DEFAULT (datetime('now', 'localtime'))
);

-- 领取记录表
CREATE TABLE IF NOT EXISTS records (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id  INTEGER NOT NULL REFERENCES accounts(id),
  activity_id  TEXT    NOT NULL REFERENCES activities(id),
  success     INTEGER NOT NULL DEFAULT 0,
  message     TEXT    DEFAULT '',
  rewards     TEXT    DEFAULT '[]',
  created_at  TEXT    DEFAULT (datetime('now', 'localtime'))
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_records_account ON records(account_id);
CREATE INDEX IF NOT EXISTS idx_records_activity ON records(activity_id);
CREATE INDEX IF NOT EXISTS idx_records_created ON records(created_at);
CREATE INDEX IF NOT EXISTS idx_activities_status ON activities(status);
