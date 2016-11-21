'use strict';

var config = require('./config');
var log4js = require('log4js');
var DBWatcher = require('./watchers/dbwatcher')


// Loading logging configuration
var logParams = config.getLogOpt();
log4js.configure({
  appenders: logParams.logappenders,
  replaceConsole: true
});

var log = log4js.getLogger(logParams.output);
log.setLevel(logParams.level);
log.info('Logger successfully started');


var Scheduler = function() {

  var watcherscfg = config.getData().watcherSchedule;
  var cartoactive = config.getData().carto.active;

  if (cartoactive) {
    log.info('Carto is active');
  } else {
    log.info('Carto is NOT active');
  }

  log.info('Starting DBWatchers');

  var dbwatcher = new DBWatcher();
  watcherscfg.forEach(function(wcfg){

    log.info(`Starting DBWatcher: ${wcfg.id_watcher}`);

    dbwatcher.run(wcfg,cartoactive);

  });

  //TODO add more watchers
  // Example: Orion Context Broker Watcher
  // var orionwatcher = new OrionWatcher();
  // orionwatcher.run();

};

module.exports = Scheduler;
