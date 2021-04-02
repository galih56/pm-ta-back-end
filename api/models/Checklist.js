/**
 * Checklist.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'checklists',
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
    title: {
      type: 'string',
      columnName: 'title',
      required: true,
    },
    deadline: {
      type: 'string',
      columnName: 'deadline',
    },
    isChecked: {
      type: 'boolean',
      columnName: 'isChecked',
    },
    task: {
      model: 'Task',
      columnName: 'tasks_id',
    },
    createdAt: false,
    updatedAt: false,
  },
};


