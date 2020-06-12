const { DataTypes } = require('sequelize');

module.exports = sequelize => {
  return sequelize.define(
    'User',
    {
      // Model attributes are defined here
      firstName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      lastName: {
        type: DataTypes.STRING
        // allowNull defaults to true
      }
    },
    { freezeTableName: true }
  );
};
