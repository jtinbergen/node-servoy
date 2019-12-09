const DatabaseManager = require('./DatabaseManager');

describe.skip('JSFoundSet', () => {
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

  test('databaseManager can create foundset', () => {
    const databaseManager = DatabaseManager.getInstance();
    const foundset = databaseManager.getFoundSet('postgres', 'postgres');
    expect(foundset).toBeDefined();
  });
});
