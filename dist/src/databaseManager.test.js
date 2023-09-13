"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DatabaseManager_1 = require("./DatabaseManager");
describe.skip('databaseManager', () => {
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
    test('databaseManager can register server', () => {
        expect(databaseManager.getServer('postgres')).toBeDefined();
    });
    test('databaseManager Instance shares connection info from DatabaseManager', async () => {
        const databaseManagerInstance = databaseManager.getInstance();
        const result = await databaseManagerInstance.getDataSetByQuery('postgres', 'SELECT 22', [], -1);
        expect(result).toBeDefined();
        expect(result.getValue(1, 1)).toEqual(22);
    });
    test('pooledConnections are reused', async () => {
        const databaseManagerInstance = databaseManager.getInstance();
        expect(databaseManager.getServer('postgres').getAvailableConnectionCount()).toEqual(0);
        expect(databaseManager.getServer('postgres').getOpenConnectionCount()).toEqual(0);
        const results = await Promise.all([
            databaseManagerInstance.getDataSetByQuery('postgres', 'SELECT 1', [], -1),
            databaseManagerInstance.getDataSetByQuery('postgres', 'SELECT 2', [], -1),
            databaseManagerInstance.getDataSetByQuery('postgres', 'SELECT 3', [], -1),
            databaseManagerInstance.getDataSetByQuery('postgres', 'SELECT 4', [], -1),
            databaseManagerInstance.getDataSetByQuery('postgres', 'SELECT 5', [], -1),
            databaseManagerInstance.getDataSetByQuery('postgres', 'SELECT 6', [], -1),
            databaseManagerInstance.getDataSetByQuery('postgres', 'SELECT 7', [], -1),
            databaseManagerInstance.getDataSetByQuery('postgres', 'SELECT 8', [], -1),
            databaseManagerInstance.getDataSetByQuery('postgres', 'SELECT 9', [], -1),
            databaseManagerInstance.getDataSetByQuery('postgres', 'SELECT 10', [], -1),
            databaseManagerInstance.getDataSetByQuery('postgres', 'SELECT 11', [], -1),
            databaseManagerInstance.getDataSetByQuery('postgres', 'SELECT 12', [], -1),
            databaseManagerInstance.getDataSetByQuery('postgres', 'SELECT 13', [], -1),
        ]);
        expect(databaseManager.getServer('postgres').getAvailableConnectionCount()).toEqual(10);
        expect(databaseManager.getServer('postgres').getOpenConnectionCount()).toEqual(10);
        databaseManager.getServer('postgres').closeAllConnections();
        expect(databaseManager.getServer('postgres').getAvailableConnectionCount()).toEqual(0);
        expect(databaseManager.getServer('postgres').getOpenConnectionCount()).toEqual(0);
        expect(results).toBeDefined();
        expect(results.length).toEqual(13);
    });
});
//# sourceMappingURL=databaseManager.test.js.map