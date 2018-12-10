'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: 'must be a valid email' }
      }
    },
    profileImage: {
      defaultValue: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678099-profile-filled-512.png',
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaulValue: 0
    }
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Wiki, {
      foreignKey: 'userId',
      as: 'wikis'
    });

    User.hasMany(models.Collaborator, {
      foreignKey: 'userId',
      as: 'collaborations'
    });
  };

  User.prototype.isAdmin = function(){
    return this.role === 2;
  }

  User.prototype.isPremium = function(){
    return this.role === 1;
  }

  return User;
};