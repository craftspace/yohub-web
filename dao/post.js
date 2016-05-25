var db = require('../config.js').db;
db.bind('post');
exports.all = function(condition, limit, callback) {
  db.post.find(condition).limit(limit).sort({created: -1, _id: -1}).toArray(function(err, result) {
    callback(err, result);
  });
};
exports.insert = function(obj, callback) {
  db.post.insert(obj, function(err, result) {
    callback(err, result);
  });
};
exports.findByPostId = function(post_id, callback) {
  db.post.findOne({post_id: post_id}, function(err, result) {
    callback(err, result);
  });
};
exports.findOne = function(id, callback) {
  db.post.findOne({_id: db.ObjectID.createFromHexString(id)}, function(err, result) {
    callback(err, result);
  });
};
exports.save = function(obj, callback) {
  db.post.save(obj, function(err, result) {
    callback(err, result);
  });
};
exports.deleteById = function(post_id, callback) {
  db.post.remove({post_id: post_id}, function(err, result) {
    callback(err, result);
  });
};
exports.updateByPostId = function(post_id, post, callback) {
  db.post.update({post_id: post_id}, {$set: post}, function(err, result) {
    callback(err, result);
  });
};