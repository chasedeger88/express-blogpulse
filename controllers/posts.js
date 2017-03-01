var express = require('express');
var db = require('../models');
var async = require("async");
var router = express.Router();

// POST /posts - create a new post
router.post('/', function(req, res) {
  //Make the comma-separated list of tags into an array of tags
  var tags = [];
  if(req.body.tags){
    tags = req.body.tags.split(",");
  }

  db.post.create({
    title: req.body.title,
    content: req.body.content,
    authorId: req.body.authorId
  })
  .then(function(post) {
    if(tags.length > 0){
      //add the tags
      //ADD TAGS WITH ASYNC
      async.forEachSeries(tags, function(t, callback){
        db.tag.findOrCreate({
          where: {name: t.trim()}
        }).spread(function(newTag, wasCreated){
          if(newTag){
            //Add the tagId/postId combo to the posts_tags table
            post.addTag(newTag);
          }
          callback(null); //Give it permission to go to the next iteration
        });
      }, function(){
        //Runs when everything is finished
        res.redirect('/posts/' + post.id);
      }); //End of forEachSeries

      //THIS PART HAS TIMING ISSUES
      // tags.forEach(function(t){
      //   db.tag.create({
      //     name: t.trim()
      //   }).then(function(newTag){
      //     if(newTag){
      //       //Add the tagId/postId combo to the posts_tags table
      //       post.addTag(newTag);
      //     }
      //   });
      // }); //end of forEach
      // res.redirect('/posts/' + post.id);
    }
    else {
      res.redirect('/posts/' + post.id);
    }
  })
  .catch(function(error) {
    res.status(400).render('main/404');
  });
});

// GET /posts/new - display form for creating new posts
router.get('/new', function(req, res) {
  db.author.findAll()
  .then(function(authors) {
    res.render('posts/new', { authors: authors });
  })
  .catch(function(error) {
    res.status(400).render('main/404');
  });
});

// GET /posts/:id - display a specific post and its author
router.get('/:id', function(req, res) {
  db.post.find({
    where: { id: req.params.id },
    include: [db.author, db.comment, db.tag]
  })
  .then(function(post) {
    if (!post) throw Error();
    res.render('posts/show', { post: post });
  })
  .catch(function(error) {
    res.status(400).render('main/404');
  });
});

//DELETE /posts/:id - remove post and all tag associations using it
router.delete("/:id", function(req, res){
  db.post.findOne({
    where: {id: req.params.id},
    include: [db.tag]
  }).then(function(post){
    async.forEachSeries(post.tags, function(t, cb){
      post.removeTag(t);
      cb(null);
    }, function(){
      db.post.destroy({
        where: {id: req.params.id}
      }).then(function(del){
        res.send("All good");
      });
    });
  });
});

module.exports = router;
