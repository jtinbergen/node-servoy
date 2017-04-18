const DatabaseManager = require('../DatabaseManager');

const executeSQL = async (serverName, table, sql) => {
    const databaseManager = DatabaseManager.getInstance();
    return databaseManager.getDataSetByQuery(serverName, sql, [], -1);
};

module.exports = {
    executeSQL,
};
