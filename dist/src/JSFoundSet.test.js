"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DatabaseManager_1 = require("./DatabaseManager");
describe.skip('JSFoundSet', () => {
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
    test('databaseManager can create foundset', () => {
        const databaseManagerInstance = databaseManager.getInstance();
        const foundset = databaseManagerInstance.getFoundSet('postgres', 'postgres');
        expect(foundset).toBeDefined();
    });
});
//# sourceMappingURL=JSFoundSet.test.js.map