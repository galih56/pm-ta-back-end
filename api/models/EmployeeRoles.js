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
      // type: 'integer',
      columnType:'bigInt'
      autoIncrement: true,
    },
    name: {
      type: 'string',
      columnName: 'name',
      columnType: 'varchar'
    },
    color: {
      type: 'string',
      columnName: 'color',
      columnType: 'varchar'
    },
    bgColor: {
      type: 'string',
      columnName: 'bg-color',
      columnType: 'varchar'
    },
    users: {
      // 1 to many with users
      collection: 'Users',
      via: 'employeeRole'
    },
    createdAt: false,
    updatedAt: false,
  },

};

