import localForage from 'localforage'
import storage from 'redux-persist/lib/storage'

let db

/**
 * Persist you redux state using IndexedDB
 * @param {string} dbName - IndexedDB database name
 */
function IndexedDBStorage(dbName) {
  if (typeof window !== 'undefined') {
    if (!db) {
      db = localForage.createInstance({
        name: dbName,
      })
    }
    return {
      db,
      getItem: db.getItem,
      setItem: db.setItem,
      removeItem: db.removeItem,
    }
  }
  return storage
}
export default IndexedDBStorage
