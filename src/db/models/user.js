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
      defaultValue: 'https://images.unsplash.com/photo-1500239524810-5a6e76344a17?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=ced2e922551021deea15cc23a7a5b494&auto=format&fit=crop&w=2279&q=80',
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