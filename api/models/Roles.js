/**
 * Roles.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'roles',
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
    name: {
      type: 'string',
      columnName: 'name'
    },
    color: {
      type: 'string',
      columnName: 'color'
    },
    bgColor: {
      type: 'string',
      columnName: 'bg-color'
    },
    members: {
      // 1 to many with projectMembers
      collection: 'ProjectMembers',
      via: 'roles'
    },
    createdAt: false,
    updatedAt: false,
  },

};
