var db = require('../config.js').db;
db.bind('contact');
exports.all = function(callback) {
  db.contact.find().sort({created: -1}).toArray(function(err, result) {
    callback(err, result)
  });
};
exports.get = function(condition, callback) {
  db.contact.findOne(condition, function(err, result) {
    callback(err, result);
  });
};
exports.insert = function(obj, callback) {
  db.contact.insert(obj, function(err, result) {
    callback(err, result);
  });
};
exports.update = function(id, page, callback) {
  db.contact.update({id: id}, {$set: page }, function(err, result) {
    callback(err, result);
  })
};
exports.deleteById = function(id, callback) {
  db.contact.remove({id: id}, function(err, result) {
    callback(err, result);
  });
};