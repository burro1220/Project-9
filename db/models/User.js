'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    emailAddress: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
  });

  User.associate = (models) => {
    // TODO Add associations.
    User.hasMany(models.Course, {
        foreignKey: {
          fieldName: 'id',
          allowNull: false,
      }, 
     });
    
  };

  return User;
};
