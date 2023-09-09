import { DatabaseManager } from '../DatabaseManager';
import * as rawSQL from './rawSQL';

describe('plugins.rawSQL', () => {
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

    test('databaseManager Instance shares connection info from DatabaseManager', async () => {
        let result = false;
        result = await rawSQL.executeSQL('postgres', null, 'SELECT 1');
        expect(result).toBeDefined();
    });
});
