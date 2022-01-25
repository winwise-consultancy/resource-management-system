const sqlite3 = require('sqlite3').verbose()
const fs = require('fs');

async function execute(dbName, queries, results) {

    const db = new sqlite3.Database(dbName, (err) => {
        if (err) {
            console.error(err.message);
            return;
        }
    });

    db.serialize(() => {
        queries.forEach(query => {
            db[query.func](query.sql, query.params, function (err, result) {
                if (err) {
                    console.error(err.message);
                }
                if (result) {
                    fs.writeFileSync(query.result, JSON.stringify(result))
                }
            })
        });
    });

    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
    });
}

module.exports = {
    execute
}
