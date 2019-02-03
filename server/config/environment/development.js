'use strict';
/*eslint no-process-env:0*/

// Development specific configuration
// ==================================
module.exports = {

  // MongoDB connection options
  mongo: {
    uri: 'mongodb://socgen:C0mplexPwd@ds161764.mlab.com:61764/socgen'
  },

  // Seed database on startup
  seedDB: false

};
