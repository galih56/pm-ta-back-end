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
      type: 'number',
      columnName: 'id',
      columnType: 'bigint',
      autoIncrement: true,
    },
    title: {
      type: 'string',
      columnName: 'title',
      columnType: 'varchar'
    },
    description: {
      type: 'string',
      columnName: 'description',
      columnType: 'longtext'
    },
    members: {
      collection: 'ProjectMembers',
      via: 'projects'
    },
    createdAt: { type: 'string', columnName: 'created_at' },
    updatedAt: { type: 'string', columnName: 'updated_at' }
  },

};

