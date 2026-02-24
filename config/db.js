const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

let dbInstance;

(async () => {
    dbInstance = await open({
        filename: process.env.DB_FILE || './database.sqlite',
        driver: sqlite3.Database
    });
})();

const db = {
    query: async (text, params = []) => {

        while (!dbInstance) {
            await new Promise(r => setTimeout(r, 50));
        }

        const sqliteQuery = text.replace(/\$[0-9]+/g, '?');

        const rows = await dbInstance.all(sqliteQuery, params);

        return { rows };
    }
};

module.exports = db;
