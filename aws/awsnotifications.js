'use strict';

var AWS = require('aws-sdk');
var config = require('../config.js');
var utils = require('../utils');
var log = utils.log();


class AWSNotifications {

  constructor() {
    var cfg = config.getData().aws;

    AWS.config.update({
      accessKeyId: cfg.aws_key,
      secretAccessKey: cfg.aws_secret,
      region: cfg.sns_region
    });

    this.topic_arn = cfg.sns_arn

    this._sns = new AWS.SNS();
  }

  pushSNS() {
    var topicArn = this.topic_arn;

    var payload = {
        default: "Urbo-Watcher - default test message",
        email: "Urbo-Watcher - email test message"
    };

    var params = {
        Message: JSON.stringify(payload),
        TopicArn: topicArn,
        Subject: "Urbo-Watcher - SNS report service",
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

module.exports = AWSNotifications;
