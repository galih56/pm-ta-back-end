/**
 * Meeting.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'meetings',
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
    googleCalendarInfo: {
      type: 'json',
      columnName: 'google_calendar_info',
    },
    start: {
      type: 'ref', 
      columnType: 'timestamp',
      columnName: 'start',
    },
    end: {
      type: 'ref', 
      columnType: 'timestamp',
      columnName: 'end',
    },
    creator: {
      columnName: 'users_id',
      model: 'User'
    },
    meetingMembers: {
      collection: 'MeetingMember',
      via: 'meeting'
    },
    project:{
      columnName: 'projects_id',
      model: 'Project'
    },
    createdAt: { columnName: 'created_at', type: 'ref', columnType: 'timestamp' },
    updatedAt: { columnName: 'updated_at', type: 'ref', columnType: 'timestamp' }
  },

};

