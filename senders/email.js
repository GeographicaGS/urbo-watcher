'use strict';

var nodemailer = require('nodemailer');
var config = require('../config.js');
var utils = require('../utils');
var log = utils.log();


class EmailSender {

  constructor() {
    this._ecfg = config.getData().email;   
    this._mailConfig = {
      host: this._ecfg.server_address,
      port: this._ecfg.port,
      secure: this._ecfg.secure, 
      auth: {
        user: this._ecfg.user,
        pass: this._ecfg.password
      }
    };       
    this._notifs = config.getData().notifications;
    this._transporter = nodemailer.createTransport(this._mailConfig);

  }

  pushMail(msg) {
    var notifPrefix = this._notifs.subj_prefix || 'Urbo-Watcher';
    var payload = `Urbo-Watcher report, ${msg.report}`;

    var mailOptions = {
      subject: `[${notifPrefix}] ${msg.subject}`,
      html: JSON.parse(JSON.stringify(payload)),
      from: notifPrefix,
      to: this._ecfg.receivers
    };

    // verify connection configuration
    this._transporter.verify(function(error, success) {
      if (error) {
          console.log(error);
      } else {
          console.log('Server ready and delivering messages');
      }
    });
    
    // send mail with defined transport object
    this._transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });

  }
}

module.exports = EmailSender;
  