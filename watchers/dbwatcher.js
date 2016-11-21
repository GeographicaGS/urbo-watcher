
var WatcherBase = require('./watcherbase');
var PGSQLWatcherModel = require('../models/pgsqlwatchermodel');
var CartoWatcherModel = require('../models/cartowatchermodel');
var awsSNS = require('../aws/awsnotifications');
var utils = require('../utils');
var log = utils.log();


class DBWatcher extends WatcherBase {

  constructor() {
    super();
  }

  run(schedulerconfig, cartoactive) {
    this.startWatcher(schedulerconfig.update_freq, function(){

      log.debug(`Run DBWatcher: ${schedulerconfig.id_watcher}`);

      var promises = [];
      var sch_env = schedulerconfig.environment;

      if (sch_env == 'pgsql' || sch_env == 'both'){
        var pgsqlmodel = new PGSQLWatcherModel();
        promises.push(pgsqlmodel.checkLastData(schedulerconfig));
      }

      if (cartoactive && (sch_env == 'carto' || sch_env == 'both')){
        var cartomodel = new CartoWatcherModel();
        promises.push(cartomodel.checkLastData(schedulerconfig))
      }

      return Promise.all(promises)
      .then(function(data){

        log.debug(JSON.stringify(data));

        var sns = new awsSNS();

        data.forEach(function(dt){
          if (dt.update_state != 'ok'){

            var subj_imp = dt.update_state == 'warning' ? 'WARNING' : 'ERROR';

            var rep_details = dt.update_state == 'warning' ?
              schedulerconfig.threshold.warning :
              schedulerconfig.threshold.error;

            var msg = {
              subject: `${subj_imp}: ${schedulerconfig.id_watcher}`,
              report: `\n\nAlarm details:
              - ${subj_imp} on watcher id "${schedulerconfig.id_watcher}."
              - More than ${rep_details} minutes without receiving updates.
              - DB Environment: ${dt.env}.
              `
            };

            sns.pushSNS(msg);
          }
        })

        return data;
      })
      .catch(function(err){
        log.error(err);
      });
    });
  }

}

module.exports = DBWatcher;
