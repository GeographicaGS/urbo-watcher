'use strict';

var PGSQLModel = require('./pgsqlmodel');
var utils = require('../utils');
var log = utils.log();
var config = require('../config.js');


class PGSQLWatcher extends PGSQLModel {

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
        CASE
          WHEN (now() - MAX(ld."${dbcolumn}"))::interval > '${warning} minute'::interval
            THEN 'warning'
          WHEN (now() - MAX(ld."${dbcolumn}"))::interval > '${error} minute'::interval
            THEN 'error'
          ELSE 'ok'
        END
      FROM "${dbschema}"."${dbtable}" ld`;

    return this.promise_query(sql)
    .then(function(results){

      return Promise.resolve(results);
    });
  }

}

module.exports = PGSQLWatcher;