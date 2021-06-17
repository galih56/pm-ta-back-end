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
        creator: {
            columnName: 'users_id',
            model: 'User'
        },
        title: {
            type: 'string',
            columnName: 'title',
        },
        description: {
            type: 'string',
            columnName: 'description',
        },
        complete: {
            type: 'boolean',
            columnName: 'complete',
            columnType: 'boolean'
        },
        end:{
          type: 'ref', 
          columnType: 'timestamp' ,
          columnName: 'end',
        },
        start:{
          type: 'ref', 
          columnType: 'timestamp' ,
          columnName: 'start',
        },
        actualEnd: {
            columnName: 'actual_end',
            type: 'ref',
            columnType: 'timestamp'
        },
        actualStart: {
            columnName: 'actual_start',
            type: 'ref',
            columnType: 'timestamp'
        }, 
        startLabel: {
            type: 'string',
            columnName: 'start_label',
        }, 
        endLabel: {
            type: 'string',
            columnName: 'end_label',
        },
        progress: {
            columnName: 'progress',
            type: 'number'
        },
        isSubtask: {
            columnName: 'isSubtask',
            type: 'boolean'
        },
        list: {
            columnName: 'lists_id',
            model: 'List'
        },
        logs: {
            collection: 'ActivityLog',
            via: 'task'
        },
        comments: {
            collection: 'Comment',
            via: 'task'
        },
        tags: {
            collection: 'TasksHasTags',
            via: 'task'
        },
        childrenTasks: {
            collection: 'Task',
            via: 'parentTask'
        },
        parentTask:{
            columnName: 'parent_task_id',
            model: 'Task'
        },
        attachments: {
            collection: 'TaskAttachment',
            via: 'task'
        },
        taskMembers: {
            collection: 'TaskMember',
            via: 'task'
        },
        createdAt: { columnName: 'created_at', type: 'ref', columnType: 'timestamp' },
        updatedAt: { columnName: 'updated_at', type: 'ref', columnType: 'timestamp' }
    },
};

