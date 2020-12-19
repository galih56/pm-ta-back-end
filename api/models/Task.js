/**
 * Task.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'tasks',
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
    },
    description: {
        type: 'string',
        columnName: 'description',
    },
    label:{
        type:'string',
        columnName:'label',
        allowNull: true
    },
    complete:{
        type:'boolean',
        columnName:'complete',
        columnType:'boolean'
    },
    end:{
        columnName:'end',
        type:'ref',
        columnType:'timestamp'
    },
    start:{
        columnName:'start',
        type:'ref',
        columnType:'timestamp'
    },
    progress:{
        columnName:'progress',
        type:'number'
    },
    list: {
        columnName:'lists_id',
        model:'List'
    },
    logs: {
        collection:'ActivityLog',
        via:'task'
    },
    comments:{
        collection:'Comment',
        via:'task'
    },
    tags:{
        collection:'TasksHasTags',
        via:'task'
    },
    attachments:{
        collection:'TaskAttachment',
        via:'task'
    },
    taskMembers: {
        collection:'TaskMember',
        via:'task'
    },
    checklists: {
        collection:'Checklist',
        via:'task'
    },
    createdAt: { columnName: 'created_at', type: 'ref', columnType: 'timestamp'},
    updatedAt: { columnName: 'updated_at', type: 'ref', columnType: 'timestamp'}
  },
};

