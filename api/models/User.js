/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
const bcrypt = require("bcrypt");
module.exports = {
  tableName: 'users',
  attributes: {
    id: {
      columnName: 'id',
      type: 'number',
      autoIncrement: true,
      unique: true
    },
    name: {
      type: 'string',
      columnName: 'name'
    },
    password: {
      type: 'string',
      columnName: 'password',
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
    },
    profilePicturePath: {
      type: 'string',
      columnName: 'profile_picture_path',
    },
    phoneNumber: {
      type:'string',
      columnName: 'phone_number',
    },
    last_login: {
      type: 'string',
      columnName: 'last_login',
      allowNull:true,
    },
    employeeRole: {
      // many to 1 with employeeRole
      columnName: 'employee_roles_id',
      model: 'EmployeeRole',
    },
    asMember: {
      // 1 to many with projectMembers
      collection: 'ProjectMember',
      via: 'user'
    },
    logs:{
      collection: 'ActivityLog',
      via: 'user'
    },
    createdAt: false,
    updatedAt: false,
  },
  customToJSON: function() {
    //delete password from json
    return _.omit(this, ['password'])
  },
  beforeCreate: function(values, callback) {
        // Hash password
        bcrypt.hash(values.password, 10, function(err, hash) {
            if (err) return callback(err);
            values.password = hash;

            //Delete the passwords so that they are not stored in the DB
            // delete values.password;
            // delete values.confirmation;

            //calling callback() with an argument returns an error. Useful for canceling the entire operation if some criteria fails.
            callback();
        });
    },
};

