/**
 * Production environment settings
 * (sails.config.*)
 * NODE_ENV=production node app
 */

module.exports = {
  datastores: {
    default: {
      adapter: require('sails-postgresql'),
      url:process.env.DATABASE_URL,
    },
  },

  models: {
    migrate: 'safe',
    attributes: {
      createdAt: { type: 'number', columnName: 'created_at', autoCreatedAt: true, },
      updatedAt: { type: 'number', columnName: 'updated_at', autoUpdatedAt: true, },
    },
  },

  blueprints: { shortcuts: false, },

  security: {
    cors: {
      allRoutes: true,
      allowOrigins: ['http://localhost:8080','http://localhost:3000'],
      allowRequestMethods: 'GET,PUT,POST,OPTIONS,HEAD,PATCH,DELETE',
      allowRequestHeaders: 'Content-Type,Authorization'
    },
  },

  session: {
    cookie: {
      // secure: true,
      maxAge: 24 * 60 * 60 * 1000,  // 24 hours
    },
  },

  sockets: {
    onlyAllowOrigins: ['http://localhost:8080','http://localhost:3000'],
  },
  
  log: {
    level: 'debug'
  },

  http: {
    cache: 365.25 * 24 * 60 * 60 * 1000, // One year
    trustProxy: true,
  },

   custom: {
     baseUrl: 'https://ta-pm-sailsjs.herokuapp.com',
     internalEmailAddress: 'support@example.com',
  },
 
  // port: 80,
  ssl: false,
};
