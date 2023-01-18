import { ArrayBuffer } from 'spark-md5';
import { SIZE_128K, SIZE_64K } from './consts';

export const generateId = async (file: File) => {
    if (file.size < SIZE_128K) {
        return ArrayBuffer.hash(await file.arrayBuffer());
    }

    const start = await file.slice(0, SIZE_64K).arrayBuffer();
    const end = await file.slice(-SIZE_64K).arrayBuffer();

    const buf = new ArrayBuffer();
    buf.append(start);
    buf.append(end);

    return buf.end();
};

// let db: IDBPDatabase<CacheItem> | Promise<IDBPDatabase<CacheItem>> | undefined = undefined;

// export const getDB = async () => {
//     if (!db) {
//         try {
//             const createDB = openDB<CacheItem>(DB_NAME, DB_VERSION, {
//                 terminated: () => {
//                     db = undefined;
//                 },
//                 upgrade(db: IDBPDatabase<CacheItem>) {
//                     db.createObjectStore(DB_CACHE_STORE, {
//                         keyPath: 'id',
//                         autoIncrement: false,
//                     });
//                 },
//             });
//
//             db = createDB;
//
//             db = await createDB;
//
//             return db;
//         } catch (e) {
//             return undefined;
//         }
//     }
//
//     return db;
// };
