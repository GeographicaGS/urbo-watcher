'use strict';

var yaml = require('js-yaml');
var fs = require('fs');
var _ = require('underscore');

/*
 * Logs params
 */
var LOG_LEVELS = ['INFO','ERROR', 'DEBUG'];
var LOG_OUTPUTS = ['console',' file'];
var LOG_FOLDER = './logs';

function Config() {
  this._data = yaml.safeLoad(fs.readFileSync('config.yml', 'utf8'));

  // Set default params
  var pgsql = this._data.pgsql;
  if (pgsql) {
    // Set default params for Carto
    if (!pgsql.hasOwnProperty('port') || !pgsql.port) {
      pgsql.port = 5432;
    }
  }

  this.getData = function() {
    return this._data;
  };

  this.createLogFolderSync = function(folder){
    // Synchronous creation of logs folder
    try {
      fs.statSync(folder)
    } catch(e) {
      fs.mkdirSync(folder);
    }
  }

  this.getLogOpt = function() {
    var logAppenderConsole = [{ type: 'console' }]
    var logAppenderFile = [
      {
        type: 'console'
      },
      {
        type: 'clustered',
        appenders: [
          {
            type: 'dateFile',
            filename: 'logs/watcher-time',
            pattern: '-dd.log',
            alwaysIncludePattern: true
          },
          {
            type: 'file',
            filename: 'logs/watcher-all.log',
            maxLogSize: 20971520,
            numBackups: 3
          },
          {
            type: 'logLevelFilter',
            level: 'ERROR',
            appender: {
              type: 'file',
              filename: 'logs/watcher-errors.log',
              layout: {
                        type: 'pattern',
                        pattern: '[%d{ISO8601}] [%p] (PID-%x{tk1}) - %c - %m',
                        tokens: {
                          tk1: process.pid
                        }
                      }
            }
          }
        ]
      }
    ]
    var logParams = {
                      level: LOG_LEVELS[0],
                      output: LOG_OUTPUTS[0],
                      logappenders: logAppenderConsole
                    }

    if ('logging' in this._data) {
      var _logging = this._data.logging;
      if ('level' in _logging && _.contains(LOG_LEVELS,_logging.level)) {
        logParams.level = _logging.level;
      }

      if ('output' in _logging && _logging.output == 'file') {
        this.createLogFolderSync(LOG_FOLDER);
        logParams.output = _logging.output;
        logParams.logappenders = logAppenderFile;
      }
    }

    return logParams;
  };
}

module.exports = new Config()
