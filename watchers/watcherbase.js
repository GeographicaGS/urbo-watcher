
var schedule = require('node-schedule');
var parser = require('cron-parser');
var utils = require('../utils');
var log = utils.log();


class WatcherBase {

  constructor() {
  }

  _parseSchedulerDefinition(schedulerdef) {

    try {
      parser.parseExpression(schedulerdef);
      log.debug('Scheduler definition is correct!');
      return Promise.resolve(schedulerdef);

    } catch (err) {
      log.error(`Scheduler definition - ${err}`)
      return Promise.reject(err);
    }
  }

  startWatcher(schedulerdef, scheduletask){

    return this._parseSchedulerDefinition(schedulerdef)
    .then(
      schedule.scheduleJob(schedulerdef, scheduletask)
    )
    .catch(function(err){
      log.error(err);
    });

  }
}

module.exports = WatcherBase;
