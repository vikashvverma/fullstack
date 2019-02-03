/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import Stock from '../api/stock/stock.model';
import config from './environment/';
import csv from 'fast-csv';

export default function seedDatabaseIfNeeded() {
  if(config.seedDB) {
    let header = false;
    Stock.find({})
      .remove()
      .then(() => {
        csv
          .fromPath(config.file)
          .on('data', function(data) {
            // console.log('abc', data[0]);
            if(!header) {
              header = true;
              return;
            }
            Stock.create({
              date: new Date(data[0]),
              symbol: data[1],
              open: data[2],
              close: data[3],
              low: data[4],
              high: data[5],
              volume: data[6],
            });
          })
          .on('end', function() {
            console.log('finished populating things');
          });
      });
      // .then(() => console.log('finished populating things'))
      // .catch(err => console.log('error populating things', err));
  }
}
