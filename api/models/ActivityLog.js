/**
 * ActivityLog.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
    tableName: 'activity_logs',
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
        description: {
          type: 'string',
          columnName: 'description',
        },
        task: {
          model: 'Task',
          columnName:'tasks_id'
        },
        user:{
            columnName:'users_id',
            model:'User',
        },
        createdAt: { columnName: 'created_at',  type: 'ref', columnType: 'timestamp'},
        updatedAt: { columnName: 'updated_at',  type: 'ref', columnType: 'timestamp'}
    },
};

