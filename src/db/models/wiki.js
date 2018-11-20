'use strict';
module.exports = (sequelize, DataTypes) => {
  var Wiki = sequelize.define('Wiki', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false
    },
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    headerImage: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'https://images.unsplash.com/photo-1499332347742-4946bddc7d94?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=ed4955d8825e76fd97a7f1132dfdc664&auto=format&fit=crop&w=933&q=80'
    },
    profileImage: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'https://images.unsplash.com/photo-1494797262163-102fae527c62?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=0f06672063bb4021d19469dd62e5a1d9&auto=format&fit=crop&w=1300&q=80'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {});
  Wiki.associate = function(models) {
    // associations can be defined here
    Wiki.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });

    Wiki.hasMany(models.Collaborator, {
      foreignKey: 'wikiId',
      as: 'collaborators'
    });

    Wiki.addScope('lastFiveFor', (userId) => {
      return {
        where: { userId: userId },
        limit: 5,
        order: [['createdAt', 'DESC']]
      }
    });
  };
  return Wiki;
};