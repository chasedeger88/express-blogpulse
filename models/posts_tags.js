'use strict';
module.exports = function(sequelize, DataTypes) {
  var posts_tags = sequelize.define('posts_tags', {
    tagId: DataTypes.INTEGER,
    postId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return posts_tags;
};