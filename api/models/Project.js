/**
 * Projects.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'projects',
  // By default sails will generate primary key id if you don't specify any.
  // If you want custom data as your primary key, you can override the id attribute in the model and give a columnName
  primaryKey: 'id',
  attributes: {
    id: {
      columnName: 'id',
      type: 'number',
      autoIncrement: true,
      unique: true
    },
    title: {
      type: 'string',
      columnName: 'title',
    },
    description: {
      type: 'string',
      columnName: 'description',
    },
    estimationDeadline:{
      type: 'ref', 
      columnType: 'timestamp' ,
      columnName: 'estimation_deadline',
    },
    members: {
      collection: 'ProjectMember',
      via: 'project'
    },
    lists: {
      collection: 'List',
      via: 'project'
    },
    meetings: {
      collection: 'Meeting',
      via: 'project'
    },
    createdAt: { 
      columnName: 'created_at', 
      type: 'ref', 
      columnType: 'timestamp' 
    },
    updatedAt: { 
      columnName: 'updated_at', 
      type: 'ref', 
      columnType: 'timestamp' 
    }
  },
};

