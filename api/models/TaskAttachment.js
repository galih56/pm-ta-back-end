/**
 * TaskAttachments.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

 module.exports = {
    tableName: 'task_attachments',
    primaryKey: 'id',
    attributes: {
        id: {
            columnName: 'id',
            type: 'number',
            autoIncrement: true,
            unique: true
        },
        file: {
            columnName: 'files_id',
            model: 'File'
        },
        task: {
            columnName: 'tasks_id',
            model: 'Task'
        },
        createdAt: false,
        updatedAt: false,
    },

};

