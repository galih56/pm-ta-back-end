/**
 * ProjectMembers.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'project_members',
  attributes: {
    id: {
      columnName: 'id',
      type: 'number',
      autoIncrement: true,
      unique: true
    },
    user: {
      columnName: 'users_id',
      model: 'User', // many to 1 with user
    },
    taskMember: {
      collection: 'TaskMember',
      via:'members'
    },
    project: {
      columnName: 'projects_id',
      model: 'Project',
      required: true,
    },
    role: {
      columnName: 'roles_id', //member has 1 role
      model: 'MemberRole',
    },
    comments:{
      collection:'Comment',
      via:'creator'
    },
    createdAt: { columnName: 'created_at', type: 'ref', columnType: 'timestamp'},
    updatedAt: { columnName: 'updated_at', type: 'ref', columnType: 'timestamp'}
  },
};

