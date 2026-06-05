import { getDb } from '../database';
import { ClaimRecord } from '../../types';

export interface RecordQueryOptions {
  accountId?: number;
  activityId?: string;
  success?: boolean;
  page?: number;
  limit?: number;
}

export interface RecordStats {
  totalAccounts: number;
  totalRecords: number;
  successCount: number;
  failCount: number;
  successRate: string;
  todayRecords: number;
  todaySuccess: number;
  totalRewards: { name: string; count: number }[];
}

export class RecordRepository {
  save(record: Omit<ClaimRecord, 'id' | 'createdAt'>): ClaimRecord {
    const db = getDb();
    const stmt = db.prepare(`
      INSERT INTO records (account_id, activity_id, success, message, rewards)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      record.accountId,
      record.activityId,
      record.success ? 1 : 0,
      record.message,
      JSON.stringify(record.rewards)
    );
    return this.getById(result.lastInsertRowid as number)!;
  }

  getById(id: number): ClaimRecord | undefined {
    const db = getDb();
    const row = db.prepare('SELECT * FROM records WHERE id = ?').get(id) as any;
    return row ? this.mapRow(row) : undefined;
  }

  query(options: RecordQueryOptions): { items: ClaimRecord[]; total: number; page: number; limit: number } {
    const db = getDb();
    const { accountId, activityId, success, page = 1, limit = 20 } = options;
    const conditions: string[] = [];
    const params: (string | number | boolean)[] = [];

    if (accountId !== undefined) {
      conditions.push('r.account_id = ?');
      params.push(accountId);
    }
    if (activityId !== undefined) {
      conditions.push('r.activity_id = ?');
      params.push(activityId);
    }
    if (success !== undefined) {
      conditions.push('r.success = ?');
      params.push(success ? 1 : 0);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // 查询总数
    const countResult = db.prepare(`SELECT COUNT(*) as count FROM records r ${whereClause}`).get(...params) as { count: number };
    const total = countResult.count;

    // 分页查询
    const offset = (page - 1) * limit;
    const rows = db.prepare(`
      SELECT r.*, a.qq_number, ac.name as activity_name
      FROM records r
      LEFT JOIN accounts a ON r.account_id = a.id
      LEFT JOIN activities ac ON r.activity_id = ac.id
      ${whereClause}
      ORDER BY r.created_at DESC
      LIMIT ? OFFSET ?
    `).all(...params, limit, offset) as any[];

    return {
      items: rows.map(row => this.mapRow(row)),
      total,
      page,
      limit,
    };
  }

  getStats(): RecordStats {
    const db = getDb();

    const accountCount = db.prepare("SELECT COUNT(*) as count FROM accounts WHERE status = 'active'").get() as { count: number };
    const totalCount = db.prepare('SELECT COUNT(*) as count FROM records').get() as { count: number };
    const successCount = db.prepare("SELECT COUNT(*) as count FROM records WHERE success = 1").get() as { count: number };

    const todayStart = new Date().toISOString().slice(0, 10) + ' 00:00:00';
    const todayRecords = db.prepare("SELECT COUNT(*) as count FROM records WHERE created_at >= ?").get(todayStart) as { count: number };
    const todaySuccess = db.prepare("SELECT COUNT(*) as count FROM records WHERE created_at >= ? AND success = 1").get(todayStart) as { count: number };

    // 统计奖励（取最近 1000 条记录）
    const rewardRows = db.prepare(
      "SELECT rewards FROM records ORDER BY created_at DESC LIMIT 1000"
    ).all() as { rewards: string }[];

    const rewardCounts: Map<string, number> = new Map();
    for (const row of rewardRows) {
      try {
        const rewards: string[] = JSON.parse(row.rewards || '[]');
        for (const reward of rewards) {
          rewardCounts.set(reward, (rewardCounts.get(reward) || 0) + 1);
        }
      } catch { /* ignore */ }
    }

    const totalRewards = Array.from(rewardCounts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    const failCount = totalCount.count - successCount.count;

    return {
      totalAccounts: accountCount.count,
      totalRecords: totalCount.count,
      successCount: successCount.count,
      failCount,
      successRate: totalCount.count > 0
        ? ((successCount.count / totalCount.count) * 100).toFixed(2) + '%'
        : '0%',
      todayRecords: todayRecords.count,
      todaySuccess: todaySuccess.count,
      totalRewards,
    };
  }

  private mapRow(row: any): ClaimRecord {
    return {
      id: row.id,
      accountId: row.account_id,
      activityId: row.activity_id,
      success: row.success === 1,
      message: row.message,
      rewards: JSON.parse(row.rewards || '[]'),
      createdAt: row.created_at,
    };
  }
}

export const recordRepo = new RecordRepository();
