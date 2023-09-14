"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DatabaseManager_1 = require("./DatabaseManager");
describe.skip('JSTable', () => {
    let databaseManager;
    beforeEach(() => {
        databaseManager = new DatabaseManager_1.DatabaseManager();
        databaseManager.registerServer({
            name: 'postgres',
            poolSize: 10,
            connectionString: 'postgresql://postgres:postgres@localhost/postgres',
        });
    });
    afterEach(() => {
        databaseManager.getServer('postgres').closeAllConnections();
        databaseManager.unregisterServer('postgres');
    });
    afterAll(() => {
        databaseManager.getServer('postgres').closeAllConnections();
    });
    test('databaseManager can query JSTable', async () => {
        const jstable = await databaseManager.getTable('postgres', 'pg_tablespace');
        expect(jstable.getSQLName()).toEqual('pg_tablespace');
        const columnNamesArray = jstable.getColumnNames();
        expect(columnNamesArray.length).toEqual(4);
        const firstColumnName = columnNamesArray[1];
        const jscolumn = jstable.getColumn(firstColumnName);
    });
});
//# sourceMappingURL=JSTable.test.js.map