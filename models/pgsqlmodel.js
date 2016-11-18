'use strict';

var pg = require('pg');
var utils = require('../utils');
var log = utils.log();
var config = require('../config.js');


class PGSQLModel {

  constructor() {
    this._cfg = config.getData().pgsql;
  }

  _connect(cb){
    pg.connect(this._cfg, cb);
  }

  promise_query(sql, bindings){
    return new Promise((function(resolve, reject){
      this._connect(function(err, client, done){
        if(err) return reject(err);
        client.query(sql, bindings, function(err, r){
          done();
          if(err){
            log.error('Error executing query');
            log.error(sql);
            return reject(err);
          }
          return resolve(r);
        })
      })
    }).bind(this));
  }

}

module.exports = PGSQLModel;
