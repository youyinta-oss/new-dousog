import { initDatabase, closeDatabase } from '../src/db/database';

console.log('初始化数据库...');
initDatabase();
console.log('数据库初始化完成');
closeDatabase();