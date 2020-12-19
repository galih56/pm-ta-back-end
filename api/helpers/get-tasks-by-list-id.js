module.exports = {


  friendlyName: 'Get tasks by list id',


  description: 'Get a group of tasks based on id of a list model',

  // sync: true, 

  inputs: {
    list_id:{
      type:'number',
      example: 0,
      description:'id of list that contains a group of tasks',
      required:true
    }
  },


  exits: {

    success: {
      outputFriendlyName: 'Tasks by list id',
    },

  },


  fn: async function(inputs, exits){
      //Cannot use `async function` since implementation is declared `sync: true`
      return await Task.find().where({'list':inputs.id}).exec((error,result)=>{
          console.log(result)
          return exits.success(result);
      });
  },


};

