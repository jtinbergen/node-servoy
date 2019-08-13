class JSColumn {
  JSColumn({ server }) {}

  getAllowNull() {}

  getDataProviderID() {}

  getDefaultFormat() {}

  getDescription() {}

  getForeignType() {}

  getLength() {}

  getQualifiedName() {}

  getQuotedSQLName() {}

  getRowIdentifierType() {}

  getSQLName() {}

  getSQLType() {}

  getScale() {}

  getSequenceType() {}

  getTitle() {}

  getType() {}

  getTypeAsString() {}

  hasFlag(flag) {}
}

JSColumn.DATABASE_IDENTITY = 0;
JSColumn.DATABASE_SEQUENCE = 1;
JSColumn.DATETIME = 2;
JSColumn.EXCLUDED_COLUMN = 3;
JSColumn.INTEGER = 4;
JSColumn.MEDIA = 5;
JSColumn.NONE = 6;
JSColumn.NUMBER = 7;
JSColumn.PK_COLUMN = 8;
JSColumn.ROWID_COLUMN = 9;
JSColumn.SERVOY_SEQUENCE = 10;
JSColumn.TEXT = 11;
JSColumn.UUID_COLUMN = 12;
JSColumn.UUID_GENERATOR = 13;

module.exports = JSColumn;
