const DatabaseManager = require('../DatabaseManager');

const executeSQL = async (serverName, table, sql) => {
    try {
        const databaseManager = DatabaseManager.getInstance();
        const result = await databaseManager.getDataSetByQuery(serverName, sql, [], -1);
        return result !== null;
    } catch (e) {
        return false;
    }
};

module.exports = {
    executeSQL,
};
