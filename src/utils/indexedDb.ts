import { openDB, DBSchema } from 'idb';

interface BhavishyajiDB extends DBSchema {
  queuedRequests: {
    key: number;
    value: {
      id: number;
      url: string;
      method: string;
      body?: any;
      timestamp: number;
    };
    indexes: { 'by-timestamp': number };
  };
}

const DB_NAME = 'bhavishyaji-db';
const DB_VERSION = 1;

export async function getDb() {
  return openDB<BhavishyajiDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('queuedRequests')) {
        const store = db.createObjectStore('queuedRequests', { keyPath: 'id', autoIncrement: true });
        store.createIndex('by-timestamp', 'timestamp');
      }
    },
  });
}

export async function queueRequest(request: Omit<BhavishyajiDB['queuedRequests']['value'], 'id'>) {
  const db = await getDb();
  await db.add('queuedRequests', { ...request, id: Date.now() });
}

export async function getQueuedRequests() {
  const db = await getDb();
  return db.getAll('queuedRequests');
}

export async function clearQueuedRequests() {
  const db = await getDb();
  await db.clear('queuedRequests');
} 