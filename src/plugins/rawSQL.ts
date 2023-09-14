import { DatabaseManager } from '../DatabaseManager';

const executeSQL = async (serverName: string, table: string, sql: string) => {
    try {
        const databaseManager = new DatabaseManager().getInstance();
        const result = await databaseManager.getDataSetByQuery(serverName, sql, [], -1);
        return result !== null;
    } catch (e) {
        return false;
    }
};

export { executeSQL };
