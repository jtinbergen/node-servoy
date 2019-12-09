const DatabaseManager = require('../DatabaseManager');
const rawSQL = require('./rawSQL.js');

describe('plugins.rawSQL', () => {
  beforeEach(() => {
    DatabaseManager.registerServer({
      name: 'postgres',
      poolSize: 10,
      connectionString: 'postgresql://postgres:postgres@localhost/postgres',
    });
  });

  afterEach(() => {
    DatabaseManager.getServer('postgres').closeAllConnections();
    DatabaseManager.unregisterServer('postgres');
  });

  test('databaseManager Instance shares connection info from DatabaseManager', async () => {
    let result = false;
    result = await rawSQL.executeSQL('postgres', null, 'SELECT 1');
    expect(result).toBeDefined();
  });
});
