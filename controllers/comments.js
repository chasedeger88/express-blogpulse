var express = require('express');
var db = require('../models');
var router = express.Router();

router.post("/", function(req, res){
  console.log(req.body);
  db.post.findById(req.body.postid).then(function(post){
    //WAY TO DO MANUALLY
    // db.comment.create({
    //   name: req.body.name,
    //   content: req.body.content,
    //   postId: post.id
    // }).then(function(comment){
    //   res.redirect("/posts/" + post.id);
    // });

    //WAY TO DO WITH THE HELPER
    post.createComment({
      name: req.body.name,
      content: req.body.content
    }).then(function(comment){
      res.redirect("/posts/" + post.id);
    });
  });
});

module.exports = router;
