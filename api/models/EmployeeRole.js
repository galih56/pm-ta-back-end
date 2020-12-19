/**
 * EmployeeRole.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'employee_roles',
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
    color: {
      type: 'string',
      columnName: 'color',
    },
    bgColor: {
      type: 'string',
      columnName: 'bg-color',
    },
    users: {
      // 1 to many with users
      collection: 'user',
      via: 'employeeRole'
    },
    createdAt: false,
    updatedAt: false,
  },

};

