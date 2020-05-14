const knexLib = require('knex')
const dbConfig = require('../knexfile')

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

function getList (uuid) {

    return new Promise (function (resolve, reject) {
        conn.raw(getListQuery, [uuid])
            .then((results) => {
                if (results && results.rows && results.rows.length === 1) {
                    resolve(results.rows[0]) 
                } else {
                    reject('list not found')
                    
                }            
            })
            .catch(() => {
                reject('getList query failed')
            })
    })

}
// public API

module.exports = {
    connect: connect,
    getLists: getLists,
    getList: getList
}