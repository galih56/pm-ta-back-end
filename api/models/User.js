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
      allowNull: true,
    },
    profilePicturePath: {
      type: 'string',
      columnName: 'profile_picture_path',
      allowNull: true,
    },
    phoneNumber: {
      type: 'string',
      columnName: 'phone_number',
      allowNull: true,
    },
    last_login: { 
      columnName: 'last_login', 
      type: 'ref', 
      columnType: 'timestamp' 
    },
    occupation: {
      columnName: 'occupations_id',
      model: 'Occupation',
    },
    asMember: {
      collection: 'ProjectMember',
      via: 'user'
    },
    comments: {
      collection: 'Comment',
      via: 'creator'
    },
    logs: {
      collection: 'ActivityLog',
      via: 'user'
    },
    tasks: {
      collection: 'Task',
      via: 'creator'
    },
    taskMembers: {
      collection: 'TaskMember',
      via: 'user'
    },
    meetingMembers: {
      collection: 'MeetingMember',
      via: 'user'
    },
    createdAt: { columnName: 'created_at', type: 'ref', columnType: 'timestamp' },
    updatedAt: { columnName: 'updated_at', type: 'ref', columnType: 'timestamp' }
},
  customToJSON: function () {
    return _.omit(this, ['password'])
  },
  beforeCreate: function (values, callback) {
    bcrypt.hash(values.password, 10, function (err, hash) {
      if (err) return callback(err);
      values.password = hash;
      callback();
    });
  },
};

