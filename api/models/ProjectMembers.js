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
      type: 'number',
      columnName: 'id',
      columnType: 'bigint',
      autoIncrement: true,
    },
    users: {
      columnName: 'users_id',
      columnType: 'bigint',
      model: 'Users', // many to 1 with user
      required: true,
    },
    projects: {
      columnName: 'projects_id',
      columnType: 'bigint',
      model: 'Projects',
      required: true,
    },
    roles: {
      columnName: 'roles_id', //member has 1 role
      columnType: 'bigint',
      model: 'Roles',
      required: true,
    },
    createdAt: { type: 'string', columnName: 'created_at' },
    updatedAt: { type: 'string', columnName: 'updated_at' }
  },
  /*
  id: function () {
    // not supported in Sails V1. Move these codes outside attributes property scope
    return this.user.id + '-' + this.projects.id + '-' + this.roles.id
  },
  */
};

