/**
 * Datastores
 * (sails.config.datastores)
 *
 * A set of datastore configurations which tell Sails where to fetch or save
 * data when you execute built-in model methods like `.find()` and `.create()`.
 *
 *  > This file is mainly useful for configuring your development database,
 *  > as well as any additional one-off databases used by individual models.
 *  > Ready to go live?  Head towards `config/env/production.js`.
 *
 * For more information on configuring datastores, check out:
 * https://sailsjs.com/config/datastores
 */

module.exports.datastores = {

  default: {
    adapter: require('sails-postgresql'),
    // url: 'mysql://root@localhost/pm_ta',
    url:'postgresql://postgres:coksjan123@localhost:5432/ta-pm',
    max:1,
    /* Khusus db heroku
    url:'postgres://livycgyvolwpxq:0b174f854507fc14d8e02c431368a9252772135744f7ff3f8cbb5b6d2c191e20@ec2-18-204-101-137.compute-1.amazonaws.com:5432/ddcop88hoeum2t',
    ssl: {
      rejectUnauthorized: false
    }
    */
  },


};
