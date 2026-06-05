import { getDb } from '../database';
import { ActivityInfo } from '../../types';

export class ActivityRepository {
  add(activity: Omit<ActivityInfo, 'id'> & { id?: string }): ActivityInfo {
    const db = getDb();
    const id = activity.id || this.generateId(activity.url);
    const stmt = db.prepare(`
      INSERT OR IGNORE INTO activities (id, name, url, type, source, status, start_date, end_date, rewards)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      id,
      activity.name,
      activity.url,
      activity.type,
      activity.source,
      activity.status,
      activity.startDate || null,
      activity.endDate || null,
      JSON.stringify(activity.rewards || [])
    );
    return this.getById(id)!;
  }

  getById(id: string): ActivityInfo | undefined {
    const db = getDb();
    const row = db.prepare('SELECT * FROM activities WHERE id = ?').get(id) as any;
    return row ? this.mapRow(row) : undefined;
  }

  getByUrl(url: string): ActivityInfo | undefined {
    const db = getDb();
    const row = db.prepare('SELECT * FROM activities WHERE url = ?').get(url) as any;
    return row ? this.mapRow(row) : undefined;
  }

  getActive(): ActivityInfo[] {
    const db = getDb();
    const rows = db.prepare("SELECT * FROM activities WHERE status = 'active' ORDER BY created_at DESC").all() as any[];
    return rows.map(row => this.mapRow(row));
  }

  getAll(): ActivityInfo[] {
    const db = getDb();
    const rows = db.prepare('SELECT * FROM activities ORDER BY created_at DESC').all() as any[];
    return rows.map(row => this.mapRow(row));
  }

  upsert(activity: ActivityInfo): ActivityInfo {
    const db = getDb();
    db.prepare(`
      INSERT INTO activities (id, name, url, type, source, status, start_date, end_date, rewards, last_checked, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now', 'localtime'))
      ON CONFLICT(url) DO UPDATE SET
        name = excluded.name,
        type = excluded.type,
        source = excluded.source,
        status = excluded.status,
        start_date = excluded.start_date,
        end_date = excluded.end_date,
        rewards = excluded.rewards,
        last_checked = excluded.last_checked,
        updated_at = datetime('now', 'localtime')
    `).run(
      activity.id,
      activity.name,
      activity.url,
      activity.type,
      activity.source,
      activity.status,
      activity.startDate || null,
      activity.endDate || null,
      JSON.stringify(activity.rewards || []),
      new Date().toISOString()
    );
    return this.getById(activity.id)!;
  }

  updateLastChecked(id: string): void {
    const db = getDb();
    db.prepare(`
      UPDATE activities SET last_checked = ?, updated_at = datetime('now', 'localtime')
      WHERE id = ?
    `).run(new Date().toISOString(), id);
  }

  updateStatus(id: string, status: 'active' | 'expired' | 'unknown'): void {
    const db = getDb();
    db.prepare(`
      UPDATE activities SET status = ?, updated_at = datetime('now', 'localtime')
      WHERE id = ?
    `).run(status, id);
  }

  delete(id: string): boolean {
    const db = getDb();
    const result = db.prepare('DELETE FROM activities WHERE id = ?').run(id);
    return result.changes > 0;
  }

  private generateId(url: string): string {
    // 简单的 URL hash 作为 ID
    let hash = 0;
    for (let i = 0; i < url.length; i++) {
      const char = url.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
  }

  private mapRow(row: any): ActivityInfo {
    return {
      id: row.id,
      name: row.name,
      url: row.url,
      type: row.type,
      source: row.source,
      status: row.status,
      startDate: row.start_date,
      endDate: row.end_date,
      rewards: JSON.parse(row.rewards || '[]'),
      lastChecked: row.last_checked,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

export const activityRepo = new ActivityRepository();
