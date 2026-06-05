import { getDb } from '../database';
import { AccountInfo } from '../../types';

export class AccountRepository {
  add(qqNumber: string, nickname: string = '', cookieValid: boolean = false): AccountInfo {
    const db = getDb();
    const stmt = db.prepare(`
      INSERT INTO accounts (qq_number, nickname, cookie_valid)
      VALUES (?, ?, ?)
    `);
    const result = stmt.run(qqNumber, nickname, cookieValid ? 1 : 0);
    return this.getById(result.lastInsertRowid as number)!;
  }

  getById(id: number): AccountInfo | undefined {
    const db = getDb();
    const row = db.prepare('SELECT * FROM accounts WHERE id = ?').get(id) as any;
    return row ? this.mapRow(row) : undefined;
  }

  getByQqNumber(qqNumber: string): AccountInfo | undefined {
    const db = getDb();
    const row = db.prepare('SELECT * FROM accounts WHERE qq_number = ?').get(qqNumber) as any;
    return row ? this.mapRow(row) : undefined;
  }

  getActiveAccounts(): AccountInfo[] {
    const db = getDb();
    const rows = db.prepare("SELECT * FROM accounts WHERE status = 'active'").all() as any[];
    return rows.map(row => this.mapRow(row));
  }

  getAll(): AccountInfo[] {
    const db = getDb();
    const rows = db.prepare('SELECT * FROM accounts ORDER BY created_at DESC').all() as any[];
    return rows.map(row => this.mapRow(row));
  }

  updateCookieValid(id: number, valid: boolean): void {
    const db = getDb();
    db.prepare(`
      UPDATE accounts SET cookie_valid = ?, updated_at = datetime('now', 'localtime')
      WHERE id = ?
    `).run(valid ? 1 : 0, id);
  }

  updateNickname(id: number, nickname: string): void {
    const db = getDb();
    db.prepare(`
      UPDATE accounts SET nickname = ?, updated_at = datetime('now', 'localtime')
      WHERE id = ?
    `).run(nickname, id);
  }

  updateStatus(id: number, status: 'active' | 'disabled'): void {
    const db = getDb();
    db.prepare(`
      UPDATE accounts SET status = ?, updated_at = datetime('now', 'localtime')
      WHERE id = ?
    `).run(status, id);
  }

  delete(id: number): boolean {
    const db = getDb();
    const result = db.prepare('DELETE FROM accounts WHERE id = ?').run(id);
    return result.changes > 0;
  }

  private mapRow(row: any): AccountInfo {
    return {
      id: row.id,
      qqNumber: row.qq_number,
      nickname: row.nickname,
      cookieValid: row.cookie_valid === 1,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

export const accountRepo = new AccountRepository();
