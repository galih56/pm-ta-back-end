/**
 * MeetingMember.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'meeting_members',
  primaryKey: 'id',
  attributes: {
    id: {
      columnName: 'id',
      type: 'number',
      autoIncrement: true,
      unique: true
    },
    user: {
      columnName: 'users_id',
      model: 'User'
    },
    meeting: {
      columnName: 'meetings_id',
      model: 'Meeting'
    },
    createdAt: { columnName: 'created_at', type: 'ref', columnType: 'timestamp' },
    updatedAt: { columnName: 'updated_at', type: 'ref', columnType: 'timestamp' }
  },

};


