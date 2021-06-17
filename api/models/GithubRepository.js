/**
 * Projects.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'github_repositories',
  // By default sails will generate primary key id if you don't specify any.
  // If you want custom data as your primary key, you can override the id attribute in the model and give a columnName
  primaryKey: 'id',
  attributes: {
    id: {
      columnName: 'id',
      type: 'number',
      autoIncrement: true,
      unique: true
    },
    owner_name: {
      type: 'string',
      columnName: 'owner_name',
    },
    repository_name: {
      type: 'string',
      columnName: 'repository_name',
    },
    project: {
      columnName: 'projects_id',
      model: 'Project',
    },
    createdAt: false,
    updatedAt: false,
  },
};

