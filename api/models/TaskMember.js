/**
 * TaskMember.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'task_members',
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
    member: {
      columnName: 'project_members_id',
      model: 'ProjectMember',
    },
    task: {
      columnName: 'tasks_id',
      model: 'Task'
    },
    user: {
      columnName: 'users_id',
      model: 'User'
    },
    createdAt: { 
      type: 'ref', 
      columnName: 'created_at', 
      columnType: 'timestamp' 
    },
    updatedAt: { 
      type: 'ref', 
      columnName: 'updated_at', 
      columnType: 'timestamp' 
    }
  },
};

