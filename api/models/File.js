/**
 * File.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'files',
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
    name: {
      type: 'string',
      columnName: 'name',
    },
    type: {
      type: 'string',
      columnName: 'type',
    },
    size: {
      type: 'string',
      columnName: 'size',
    },
    source: {
      type: 'string',
      columnName: 'source',
    },
    icon: {
      type: 'string',
      columnName: 'icon',
      allowNull:true
    },
    path: {
      type: 'string',
      columnName: 'path',
    },
    taskAttachments:{
      collection: 'TaskAttachment',
      via: 'file'
    },
    user: {
        columnName: 'users_id',
        model: 'User',
    },
    createdAt: { columnName: 'created_at', type: 'ref', columnType: 'timestamp'},
    updatedAt: { columnName: 'updated_at', type: 'ref', columnType: 'timestamp'}
  },
};

