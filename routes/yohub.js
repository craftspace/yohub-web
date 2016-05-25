var config = require('../config').config;
var fs = require('fs');
var data2xml = require('data2xml');
var marked = require('marked');
var dateFormat = require('dateformat');
var gravatar = require('gravatar');
var sendMail = require('./send-mail');
var akismet = require('akismet').client({
  blog: config.akismet_options.blog, apiKey: config.akismet_options.apikey
});
var photoDao = require('../dao/photo');
var postDao = require('../dao/post');
var pageDao = require('../dao/page');
var contactDao = require('../dao/contact');
var commentDao = require('../dao/comment');
var filePrefix = 'theme/' + config.theme + '/';
function _index(req, res, next) {
  res.render(filePrefix + 'index', {name: 'index'});
  //postDao.count({}, function (err, count) {
  //  if (count == 0) {
  //    res.redirect("/admin/install");
  //  }
  //  var maxPage = parseInt(count / config.postNum) + (count % config.postNum ? 1 : 0);
  //  var currentPage = isNaN(parseInt(req.params[0])) ? 1 : parseInt(req.params[0]);
  //  if (currentPage <= 0) currentPage = 1;
  //  var nextPage = currentPage;
  //  var title = config.name;
  //  if (currentPage > 1)
  //    title += " › 第" + currentPage + "页";
  //  //skin，即起始位置
  //  var start = ( currentPage - 1) * config.postNum;
  //  if (maxPage < currentPage)
  //    return;
  //  else if (maxPage > currentPage)
  //    nextPage = parseInt(currentPage) + 1;
  //  postDao.findAll(start, parseInt(config.postNum), function (err, result) {
  //    for (var i = 0; i < result.length; i++) {
  //      result[i].content = marked(result[i].content);
  //      if (result[i].content.indexOf('<!--more-->') > 0) {
  //        result[i].content = result[i].content.substring(0, result[i].content.indexOf('<!--more-->')) + '<div class="ReadMore"><a href="/post/' + result[i].slug + '">[阅读更多]</a></div>';
  //      }
  //    }
  //    var index_obj = {
  //      name: config.name,
  //      title: config.name,
  //      posts: result,
  //      crtP: currentPage,
  //      maxP: maxPage,
  //      nextP: nextPage
  //    };
  //    res.render(filePrefix + 'index', index_obj);
  //  });
  //});
}
function _home(req, res, next) {
  res.render(filePrefix + 'index', {name: 'index', direct: true});
}
function _home_en(req, res, next) {
  res.render(filePrefix + 'index_en', {
    name: 'index',
    direct: true,
    use_en: true
  });
}
function _tag(req, res, next) {
  postDao.findByTag(req.params.tag, function(err, result) {
    if (err) return;
    for (var i = 0; i < result.length; i++) {
      result[i].content = marked(result[i].content);
    }
    var tag_obj = {name: config.name, title: config.name, posts: result, tag_name: req.params.tag};
    res.render(filePrefix + 'tag', tag_obj);
  });
}
function _services(req, res, next) {
  res.render(filePrefix + 'services', {name: 'services'});
}
function _services_en(req, res, next) {
  res.render(filePrefix + 'services_en', {name: 'services', use_en: true});
}
function _feature(req, res, next) {
  res.render(filePrefix + 'feature', {name: 'feature'});
}
function _feature_en(req, res, next) {
  res.render(filePrefix + 'feature_en', {name: 'feature', use_en: true});
}
function _about_us(req, res, next) {
  res.render(filePrefix + 'about_us', {name: 'about_us'});
}
function _about_us_en(req, res, next) {
  res.render(filePrefix + 'about_us_en', {name: 'about_us', use_en: true});
}
function _contact(req, res, next) {
  res.render(filePrefix + 'contact', {name: 'contact'});
}
function _contact_en(req, res, next) {
  res.render(filePrefix + 'contact_en', {name: 'contact', use_en: true});
}
function _case(req, res, next) {
  var limit = 999;
  postDao.all({}, limit, function(err, posts) {
    res.render(filePrefix + 'case', {
      posts: posts, name: 'case'
    });
  });
}
function _case_en(req, res, next) {
  var limit = 999;
  postDao.all({}, limit, function(err, posts) {
    res.render(filePrefix + 'case_en', {
      posts: posts, name: 'case', use_en: true
    });
  });
  res.render(filePrefix + 'case_en', {name: 'case', use_en: true});
}
function _contact_form(req, res, next) {
  res.render(filePrefix + 'contact_form', {name: 'contact_form', simple: true});
}
function _contact_form_en(req, res, next) {
  res.render(filePrefix + 'contact_form_en', {name: 'contact_form', simple: true, use_en: true});
}

function _submit_form(req, res, next) {
  var contact = {
    'Contacts': req.body.name,
    'Company': req.body.corp,
    'E-mail': req.body.email,
    'Mobile': req.body.mobile,
    'Direct Line': req.body.tel,
    'Service Location': req.body.place,
    'From': req.body.start,
    'To': req.body.end,
    'Occupancy': req.body.industry,
    'Other': req.body.desc,
    'level': req.body.level
  };
  contactDao.insert(contact, function(err, result) {
    if (!err) {
      sendMail.sendMail(JSON.stringify(result, null, 2));
      res.send(200);
      res.end();
    }
  });
}
function _files(req, res, next) {
  var path = req.path;
  fs.exists(path, function(exists) {
    if (exists) {
      res.download(path);
    } else {
      _pageNotFound(req, res);
    }
  });
}
function _page(req, res, next) {
  pageDao.get({'slug': req.params.slug}, function(err, page) {
    if (!err && page != null) {
      page.content = marked(page.content);
      //如果不存在 content_html，更新
      if (!page.content_html) {
        page.content_html = marked(page.content);
        pageDao.update(page.id, {content_html: page.content_html}, function() {
        })
      }
      page.page_title = config.name + " › " + page.title;
      res.render(filePrefix + 'page', {page: page, name: config.name, title: page.page_title});
    }
    else {
      _pageNotFound(req, res);
//      next();
    }
  });
}
function _comment(req, res, next) {
  var id = req.body.id;
  var slug = req.body.slug;
  //这是一个隐藏的input，如果有值，说明是垃圾评论机器人
  var no_author = req.body.author;
  if (id == "" || slug == "" || !req.headers['referer'] || req.headers['referer'].indexOf(id) <= 0) {
    return res.redirect("/fuck-spam-comment");
  } else if (no_author !== "") {
    console.log("no_author not is empty");
    return res.redirect("/fuck-spam-comment");
  } else {
    postDao.get({id: id}, function(err, post) {
      if (!err && post != null) {
        var comment = {
          post_id: req.body.id,
          post_slug: req.body.slug,
          author: req.body.a_uthor,
          email: req.body.e_mail,
          url: req.body.u_rl,
          content: req.body.c_ontent,
          ip: req.ip,
          created: dateFormat(new Date(), "isoDateTime"),
          status: "1"//状态： 1：正常，0：SPAM
        };
        // 非空检查
        if (comment.author == "" || comment.email == "" || comment.content == "") {
          return res.redirect("/post/" + post.id);
        }
        // URL 格式检查
        var regexp = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w\- ./?%&=]*)?/;
        if (!comment.url.match(regexp)) {
          comment.url = "http://" + comment.url;
          if (!comment.url.match(regexp)) {
            delete comment.url;
          }
        }
        comment.avatar = gravatar.url(comment.email, {s: '36', r: 'pg', d: 'mm'});
        commentDao.insert(comment, function(err, comment) {
          if (!err && comment && comment.length == 1) {
            //配置了 akismet key 而且不为空时，进行 akismet spam检查
            if (config.akismet_options && config.akismet_options.apikey != "") {
              akismet.checkSpam({
                user_ip: comment[0].ip,
                permalink: config.url + "/post/" + comment[0].post_slug,
                comment_author: comment[0].author,
                comment_content: comment[0].content,
                comment_author_email: comment[0].email,
                comment_author_url: comment[0].url,
                comment_type: "comment"
              }, function(err, spam) {
                //发现SPAM
                if (spam) {
                  console.log('Spam caught.');
                  comment[0].status = "0";//状态： 1：正常，0：SPAM
                  commentDao.save(comment[0], function(err, result) {
                    if (!err)
                      console.log("save comment status success");
                    else
                      console.log("save comment status failed");
                  });
                }
              });
            }
            return res.redirect("/post/" + post.id);
          }
        });
      } else {
        return next();
      }
    });
  }
}
function _feed(req, res) {
  if (!config.rss) {
    res.statusCode = 404;
    res.send('Please set `rss` in config.js');
  }
  postDao.findAll(0, parseInt(config.rss.max_rss_items), function(err, result) {
    if (err) {
      return next(err);
    }
    var rss_obj = {
      _attr: {version: '2.0'},
      channel: {
        title: config.rss.title,
        description: config.rss.description,
        link: config.rss.link,
        language: config.rss.language,
        managingEditor: config.rss.language,
        webMaster: config.rss.language,
        generator: config.rss.generator,
        item: []
      }
    };
    for (var i = 0; i < result.length; i++) {
      var post = result[i];
      post.content = marked(post.content);
      rss_obj.channel.item.push({
        title: post.title,
        author: {
          name: config.rss.author.name
        },
        link: config.rss.link + '/post/' + post.slug,
        guid: config.rss.link + '/post/' + post.slug,
        pubDate: dateFormat(new Date(post.created)),
        lastBuildDate: dateFormat(new Date(post.created)),
        description: marked(post.content)
      });
    }
    var rss_content = data2xml({})('rss', rss_obj);
    res.contentType('application/xml');
    res.send(rss_content);
  });
}
function _share(req, res) {
  var limit = 999;
  photoDao.all({}, limit, function(err, photos) {
    res.render(filePrefix + 'share', {
      photos: photos, name: 'share'
    });
  });
}
function _share_en(req, res) {
  var limit = 999;
  photoDao.all({}, limit, function(err, photos) {
    res.render(filePrefix + 'share', {
      photos: photos, name: 'share',
      use_en: true
    });
  });
}
function _post(req, res, next) {
  postDao.get({id: req.params.id}, function(err, post) {
    if (err) {
      res.statusCode = 500;
      res.send('500');
    } else if (post == null) {
      next();
    } else {
      post.content = marked(post.content);
      //如果不存在 content_html，更新
      if (!post.content_html) {
        post.content_html = marked(post.content);
        postDao.update(post.id, {content_html: post.content_html}, function() {
        })
      }
      var page_title = config.name + " › " + post.title;
      commentDao.findByPostId(post.id, function(err, comments) {
        for (var i = 0; i < comments.length; i++) {
          if (!comments[i].avatar) {
            comments[i].avatar = gravatar.url(comments[i].email, {s: '36', r: 'pg', d: 'mm'});
            commentDao.updateAvater(comments[i]._id.toString(), comments[i].avatar, function() {
            })
          }
        }
        if (!err) {
          res.render(filePrefix + 'post', {
            title: page_title,
            post: post,
            comments: comments,
            name: config.name
          });
        } else {
          res.statusCode = 500;
          res.send('500');
        }
      });
    }
  });
}
function _archives(req, res) {
  var sortNumber = function(a, b) {
    return a.year < b.year
  };
  var archiveList = [];
  postDao.all(function(err, archives) {
    //for (var i = 0; i < archives.length; i++) {
    //  var year = new Date(archives[i].created).getFullYear();
    //  if (archiveList[year] === undefined)
    //    archiveList[year] = {year: year, archives: []};
    //  archiveList[year].archives.push(archives[i]);
    //}
    //archiveList = archiveList.sort(sortNumber);
    res.render(filePrefix + 'post', {
      title: config.name + " › 文章存档",
      archives: archives,
      name: "post"
    });
  });
}
function _archives_en(req, res) {
  //var sortNumber = function(a, b) {
  //  return a.year < b.year
  //};
  var archiveList = [];
  postDao.all(function(err, archives) {
    //for (var i = 0; i < archives.length; i++) {
    //  var year = new Date(archives[i].created).getFullYear();
    //  if (archiveList[year] === undefined)
    //    archiveList[year] = {year: year, archives: []};
    //  archiveList[year].archives.push(archives[i]);
    //}
    //archiveList = archiveList.sort(sortNumber);
    res.render(filePrefix + 'post', {
      title: config.name + " › 文章存档",
      archives: archives,
      name: "post",
      layout: "layout_en"
    });
  });
}
function _pageNotFound(req, res) {
  console.log('404 handler, URL' + req.originalUrl);
  res.render(filePrefix + '404', {
    layout: true, status: 404, title: '页面未找到 - 404', name: '404'
  });
}
// URL /
exports.index = _index;
exports.home = _home;
exports.services = _services;
exports.post = _archives;
exports.share = _share;
exports.feature = _feature;
exports.about_us = _about_us;
exports.contact_form = _contact_form;
exports.contact = _contact;
exports.files = _files;
exports.submit_form = _submit_form;
exports.home_en = _home_en;
exports.services_en = _services_en;
exports.post_en = _archives_en;
exports.share_en = _share_en;
exports.feature_en = _feature_en;
exports.about_us_en = _about_us_en;
exports.contact_form_en = _contact_form_en;
exports.contact_en = _contact_en;
exports.case = _case;
exports.case_en = _case_en;
exports.pageNotFound = _pageNotFound;