'use strict';

var nodemailer = require('nodemailer');
var config = require('../config.js');
var utils = require('../utils');
var log = utils.log();

class EmailSender {

  constructor() {
    var ecfg = config.getData().email;   

    this._transporter = new nodemailer.createTransport({
      host: ecfg.server_address,
      port: ecfg.secure ? ecfg.ssl_port : ecfg.ttl_port,
      secure: ecfg.secure, // using SSL at port 465, false for other ports or TTL
      auth: {
        user: ecfg.user,
        pass: ecfg.password
      }
    });
 
    this._receivers = ecfg.receivers;

    this._notifs = config.getData().notifications;

  }
  

  sendMail(msg) {
      var receivers = this._receivers;
      var notifPrefix = this._notifs.subj_prefix || 'Urbo-Watcher';
  
      var payload = {
          default: `Urbo-Watcher report, ${msg.report}`,
          email: `Urbo-Watcher report, ${msg.report}`
      };
  
      var mailOptions = {
        subject: `[${notifPrefix}] ${msg.subject}`,
        html: JSON.stringify(payload),
        text: JSON.stringify(payload),
        from: notifPrefix,
        to: receivers
      };
      
    // send mail with defined transport object
    this._transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }

      console.log('Message sent: %s', info.messageId);

      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      // Example log: 
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      // Example: Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

  });
  }

  verifySending() {
    // verify connection configuration
    this._transporter.verify(function(error, success) {
      if (error) {
          console.log(error);
      } else {
          console.log('Server is ready to take our messages');
      }
    });
  } 

}
  
module.exports = EmailSender;
  