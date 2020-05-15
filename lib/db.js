const knexLib = require('knex')
const dbConfig = require('../knexfile')

// put this in a utils module
function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }




// this will hold our database connection
let conn = null

// this should return a promise
function connect () {
    return new Promise(function (resolve, reject) {
    conn = knexLib(dbConfig.development)
    conn.raw(`SELECT 1 + 1 AS test`)
        .then((result) => {
            if (result.rows.length === 1 && result.rows[0].test === 2) {
                console.log('Database was able to provide 2')
                resolve(result.rows[0])
            }
            else {
                reject('Database was unable to do 1 + 1')
            }
        })
        .catch((err) => {
            reject(err)
        })
    resolve()
})
}

const getListsQuery = `SELECT * FROM list`

function getLists () {
    return conn.raw(getListsQuery)
        .then ((results) => {
            return results.rows
        })
}

const getListQuery = `SELECT * FROM list WHERE uuid = ?`

const getListItemsQuery = `
SELECT * 
FROM list_items 
WHERE list_id = ?
ORDER BY display_order
`

function getList (uuid) {
    return new Promise (function (resolve, reject) {
        conn.raw(getListQuery, [uuid])
            .then((result) => {
                if (result && result.rows && result.rows.length === 1) {
                    return result.rows[0] 
                } else {
                    reject('list not found')                  
                }            
            })
            .then((theList) => {
                conn.raw(getListItemsQuery, [theList.id])
                    .then((result) => {
                        theList.items = result.rows
                        resolve(theList)
                    })
                    .catch(() => {
                        reject('unable to get listitems')
                    })
            })
            .catch(() => {
                reject('getList query failed')
            })
    })

}


const createItemQuery = `
INSERT INTO list_items (uuid, description, display_order, list_id, ctime, mtime)
VALUES (?, ?, ?, ?, current_timestamp, current_timestamp)
RETURNING *
`

function createItem (listId, description) {
    return conn.raw(createItemQuery, [uuid(), description, 999, listId])
        .then ((results) => {
            return results.rows[0]
        })
}

// public API

module.exports = {
    connect: connect,
    getLists: getLists,
    getList: getList,
    createItem: createItem
}
