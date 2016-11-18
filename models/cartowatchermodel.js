'use strict';

var CartoModel = require('./cartomodel');
var utils = require('../utils');
var log = utils.log();
var config = require('../config.js');


class CartoWatcher extends CartoModel {

  constructor() {
    super();
  }

  checkLastData(sch_cfg) {
    var dbschema = sch_cfg.schema;
    var dbtable = sch_cfg.table;
    var dbcolumn = sch_cfg.column;
    var warning = sch_cfg.threshold.warning;
    var error = sch_cfg.threshold.error;

    var sql = `
      SELECT
        (CASE
          WHEN (now() - MAX(ld."${dbcolumn}"))::interval > '${warning} minute'::interval
            THEN 'warning'
          WHEN (now() - MAX(ld."${dbcolumn}"))::interval > '${error} minute'::interval
            THEN 'error'
          ELSE 'ok'
        END) as update_state
      FROM "${dbschema}_${dbtable}" ld`;

    return this.promise_query({
      query: sql
    })
    .then(function(results){

      results.rows[0].env = 'carto';

      return Promise.resolve(results.rows[0]);
    });
  }

}

module.exports = CartoWatcher;
