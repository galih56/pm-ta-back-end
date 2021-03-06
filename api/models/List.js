/**
 * List.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'lists',
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
    position: {
      type: 'number',
      columnType: 'BigInt',
      columnName: 'position',
    },
    tasks: {
      collection: 'task',
      via: 'list'
    },
    project: {
      columnName: 'projects_id',
      model: 'Project'
    },
    actualEnd:{
      type: 'ref', 
      columnType: 'timestamp' ,
      columnName: 'actual_end',
    },
    actualStart:{
      type: 'ref', 
      columnType: 'timestamp' ,
      columnName: 'actual_start',
    },
    start:{
      type: 'ref', 
      columnType: 'timestamp' ,
      columnName: 'start',
    },
    end:{
      type: 'ref', 
      columnType: 'timestamp' ,
      columnName: 'end',
    },
    createdAt: { columnName: 'created_at', type: 'ref', columnType: 'timestamp' },
    updatedAt: { columnName: 'updated_at', type: 'ref', columnType: 'timestamp' }
  },
  // getTasks:async function(req,res){
  //     return await sails.helpers.getTasksByListId(this.id);
  // },
  // customToJSON: function() {
  //     // can't use async with customToJSON. The json will be an empty object
  //     this.tasks=this.populate('tasks');
  //     console.log(this);
  //     return _.omit(this,[]);
  // },
};