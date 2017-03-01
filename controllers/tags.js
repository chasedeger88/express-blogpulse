var express = require('express');
var async = require("async");
var db = require('../models');
var router = express.Router();

router.get("/", function(req, res){
  db.tag.findAll().then(function(tags){
    res.render("tags/tags", {tags: tags});
  });
});

router.get("/:id", function(req, res){
  db.tag.findOne({
    where: {id: req.params.id},
    include: [db.post]
  }).then(function(tag){
    res.render("tags/show", {tag: tag});
  });
});

router.get("/edit/:id", function(req, res){
  db.tag.findById(req.params.id).then(function(tag){
    res.render("tags/edit", {tag: tag});
  });
});

router.put("/:id", function(req, res){
  console.log(req.body);
  db.tag.update({
    name: req.body.name
  },
  {
    fields: ["name"],
    where: {id: req.params.id}
  }).then(function(tag){
    res.send("success");
  });
});

//DELETE /tags/:id - remove tag and all associations using it
router.delete("/:id", function(req, res){
  db.tag.findOne({
    where: {id: req.params.id},
    include: [db.post]
  }).then(function(tag){
    async.forEachSeries(tag.posts, function(p, cb){
      tag.removePost(p);
      cb(null);
    }, function(){
      db.tag.destroy({
        where: {id: req.params.id}
      }).then(function(del){
        res.send("All good");
      });
    });
  });
});

module.exports = router;
