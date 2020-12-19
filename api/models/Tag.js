/**
 * Label.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
    tableName: 'tags',
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
        tasks: {
          collection: 'TasksHasTags',
          via: 'tag'
        },
        createdAt: false,
        updatedAt: false,
    },
};




// color: {
//   type: 'string',
//   columnName: 'color'
// },
// bgColor: {
//   type: 'string',
//   columnName: 'bg-color'
// },