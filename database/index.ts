import mysql from 'mysql'

const database: mysql.Connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: typeof process.env.DB_PORT == 'string' ? parseInt(process.env.DB_PORT) : process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_SCHEMA
})

database.connect()

type QueryResult = {
    [key: string]: any;
}

export function query(query: string) {
    return new Promise<Array<QueryResult>>((resolve, reject) => {
        database.query(query, (error, results) => {
            if (error) {
                reject(error)
            } else {
                resolve(results)
            }
        })
    })
}