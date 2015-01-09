var nodemailer = require('nodemailer');

var init = function () {
  var transport = nodemailer.createTransport("SMTP", {
    // service: "Gmail",
    host: "smtp.163.com",
    // hostname
    port: 25,
    // port for secure SMTP
    auth: {
      user: "nomospace@163.com",
      pass: "q1w2e3"
    }
  });

  console.log('SMTP Configured');
  return transport;
};

// Message object
var message = {

  // sender info
  from: 'yohub <nomospace@163.com>',

  // Comma separated list of recipients
  //to: '"iven.zhang" <jinlu_hz@163.com>',
  to: '"iven.zhang" <iven.zhang@yohub.com.cn>',

  // Subject of the message
  subject: '客户业务咨询问卷表单',

  headers: {
    'X-Laziness-level': 1000
  }

  // plaintext body
  //text: 'Hello nodemail！',

  // HTML body
  //html: '<p><b>Hello nodemail！</b></p><img width="100" src="cid:inspectocat@node"/>'

  // An array of attachments
  //attachments: [
  //
  //  // String attachment
  //  {
  //    fileName: 'string.txt',
  //    contents: 'Some notes about this e-mail',
  //    contentType: 'text/plain' // optional, would be detected from the filename
  //  },
  //
  //  // File attachment
  //  {
  //    fileName: 'notes.txt',
  //    filePath: __dirname + '/attachments/notes.txt',
  //  },
  //
  //  // Binary Buffer attachment
  //  {
  //    fileName: 'image.png',
  //    contents: new Buffer('iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAAD/' + '//+l2Z/dAAAAM0lEQVR4nGP4/5/h/1+G/58ZDrAz3D/McH8yw83NDDeNGe4U' + 'g9C9zwz3gVLMDA/A6P9/AFGGFyjOXZtQAAAAAElFTkSuQmCC', 'base64'),
  //    cid: 'note@node' // should be as unique as possible
  //  },
  //
  //  // File Stream attachment
  //  {
  //    fileName: 'inspectocat.jpg',
  //    filePath: __dirname + '/attachments/inspectocat.jpg',
  //    cid: 'inspectocat@node' // should be as unique as possible
  //  }]
};

exports.sendMail = function (content) {
  var transport = init();
  message.text = '客户业务咨询问卷表单';
  message.html = content;
  transport.sendMail(message, function (error) {
    if (error) {
      console.log('Error occured');
      console.log(error.message);
      return;
    }
    console.log('Sending Mail');
    console.log('Message sent successfully!');

    // if you don't want to use this transport object anymore, uncomment following line
    transport.close(); // close the connection pool
  });
};
