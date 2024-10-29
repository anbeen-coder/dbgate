const autoIndexForeignKeysTransform = () => database => {
  return {
    ...database,
    tables: database.tables.map(table => {
      return {
        ...table,
        indexes: [
          ...(table.indexes || []),
          ...table.foreignKeys.map(fk => ({
            constraintName: `IX_${fk.constraintName}`,
            columns: fk.columns,
          })),
        ],
      };
    }),
  };
};

module.exports = autoIndexForeignKeysTransform;
