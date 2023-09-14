"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DatabaseManager_1 = require("../DatabaseManager");
const rawSQL = require("./rawSQL");
describe('plugins.rawSQL', () => {
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
    test('databaseManager Instance shares connection info from DatabaseManager', async () => {
        let result = false;
        result = await rawSQL.executeSQL('postgres', null, 'SELECT 1');
        expect(result).toBeDefined();
    });
});
//# sourceMappingURL=rawSQL.test.js.map