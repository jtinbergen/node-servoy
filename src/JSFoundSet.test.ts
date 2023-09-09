import { DatabaseManager } from './DatabaseManager';

describe.skip('JSFoundSet', () => {
    let databaseManager: DatabaseManager;

    beforeEach(() => {
        databaseManager = new DatabaseManager();
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
