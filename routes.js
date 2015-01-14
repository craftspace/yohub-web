var yohub = require('./routes/yohub');
var admin = require('./routes/admin');
module.exports = function(app) {
  app.get('/', yohub.index);
  app.get('/home', yohub.home);
  app.get('/feature', yohub.feature);
  app.get('/services', yohub.services);
  app.get('/contact', yohub.contact);
  app.get('/share', yohub.share);
  app.get('/post', yohub.post);
  app.get('/post/:id', yohub.post);
  app.get('/about_us', yohub.about_us);
  app.get('/contact_form', yohub.contact_form);
  app.get('/home_en', yohub.home_en);
  app.get('/feature_en', yohub.feature_en);
  app.get('/services_en', yohub.services_en);
  app.get('/contact_en', yohub.contact_en);
  app.get('/share', yohub.share);
  app.get('/post', yohub.post);
  app.get('/post/:id', yohub.post);
  app.get('/about_us_en', yohub.about_us_en);
  app.get('/contact_form_en', yohub.contact_form_en);
  app.get('/files/:string', yohub.files);
  //app.get('/tag/:tag', yohub.tag);
  app.get('/admin', admin.authUser, admin.index);
  app.get('/admin/install', admin.install);
  app.post('/admin/install', admin.install);
  app.get('/admin/login', admin.login);
  app.post('/admin/login', admin.login);
  app.get('/admin/logout', admin.authUser, admin.logout);
  app.get('/admin/post', admin.authUser, admin.postIndex);
  app.get('/admin/post/write', admin.authUser, admin.postWrite);
  app.post('/admin/post/write', admin.authUser, admin.postWrite);
  app.get('/admin/post/edit/:id', admin.authUser, admin.postEdit);
  app.post('/admin/post/edit/:id', admin.authUser, admin.postEdit);
  app.get('/admin/post/delete/:id', admin.authUser, admin.postDelete);
  app.get('/admin/page', admin.authUser, admin.pageIndex);
  app.get('/admin/page/write', admin.authUser, admin.pageWrite);
  app.post('/admin/page/write', admin.authUser, admin.pageWrite);
  app.get('/admin/page/edit/:id', admin.authUser, admin.pageEdit);
  app.post('/admin/page/edit/:id', admin.authUser, admin.pageEdit);
  app.get('/admin/page/delete/:id', admin.authUser, admin.pageDelete);
  app.get('/admin/comment', admin.authUser, admin.commentIndex);
  app.get('/admin/comment/delete/:id', admin.authUser, admin.commentDelete);
  app.get('/admin/verifyAkismet', admin.authUser, admin.verifyAkismet);
  app.get('/admin/submitSpam/:id', admin.authUser, admin.submitSpam);
  app.get('/admin/photo', admin.authUser, admin.photoIndex);
  app.get('/admin/photo/edit/:photo_id', admin.authUser, admin.photoEdit);
  app.post('/admin/photo/edit/:photo_id', admin.authUser, admin.photoEdit);
  app.get('/admin/photo/write', admin.authUser, admin.photoWrite);
  app.post('/admin/photo/write', admin.authUser, admin.photoWrite);
  app.get('/admin/photo/delete/:id', admin.authUser, admin.photoDelete);
  app.get('*', yohub.pageNotFound);
};