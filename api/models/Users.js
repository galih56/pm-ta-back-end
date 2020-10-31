/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'users',
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
    password: {
      type: 'string',
      columnName: 'password',
      encrypt: true
    },
    email: {
      type: 'string',
      unique: true,
      columnName: 'email'
    },
    verified: {
      type: 'boolean',
      columnName: 'verified'
    },
    token: {
      type: 'string',
      columnName: 'token',
      allowNull: true
    },
    profilePicturePath: {
      type: 'string',
      columnName: 'profile_picture_path',
      allowNull: true
    },
    phoneNumber: {
      type: 'string',
      columnName: 'phone_number',
      allowNull: true
    },
    employeeRole: {
      // many to 1 with employeeRole
      columnName: 'employee_roles_id',
      model: 'EmployeeRoles',
    },
    asMember: {
      // 1 to many with projectMembers
      collection: 'ProjectMembers',
      via: 'users'
    },
    createdAt: false,
    updatedAt: false,
  },

};

