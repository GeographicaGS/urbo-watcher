'use strict';

var AWS = require('aws-sdk');
var config = require('../config.js');
var utils = require('../utils');
var log = utils.log();


class AWSSNS {

  constructor() {
    var cfg = config.getData().aws;

    AWS.config.update({
      accessKeyId: cfg.aws_key,
      secretAccessKey: cfg.aws_secret,
      region: cfg.sns_region
    });

    this._topic_arn = cfg.sns_arn;

    this._notifs = config.getData().notifications;

    this._sns = new AWS.SNS();
  }

  pushSNS(msg) {
    var topicArn = this._topic_arn;
    var notifPrefix = this._notifs.subj_prefix || 'Urbo-Watcher';

    var payload = {
        default: `Urbo-Watcher report, ${msg.report}`,
        email: `Urbo-Watcher report, ${msg.report}`
    };

    var params = {
        Message: JSON.stringify(payload),
        TopicArn: topicArn,
        Subject: `[${notifPrefix}] ${msg.subject}`,
        MessageStructure: 'json'
    };

    this._sns.publish(params, function (err, r) {
      if(err){
        log.error('Error sending notification with AWS SNS');
        return Promise.reject(err);
      }

      log.debug('Notification succesfully sent with AWS SNS');
      return Promise.resolve(r);

    });
  }

}

module.exports = AWSSNS;
