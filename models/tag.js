'use strict';
module.exports = (sequelize, DataTypes) => {
  var tag = sequelize.define('tag', {
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        models.tag.belongsToMany(models.post, {through: "postTags"});
        // associations can be defined here
      }
    }
  });
  return tag;
};