/**
 * TaskMemberController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
	find: async (req,res)=>{
		try {
			let taskMember = await TaskMember.find();
	        return res.send(taskMember);
	    }
	    catch (err){
	      return res.serverError(err);
	    }
	},
    findOne: async (req, res) => {
    	let params=req.allParams();
		try {
	        if (params.id) {
	            let taskMember = await TaskMember.find({ id: params.id });
	            if (taskMember.length > 0) {
	                return res.send(taskMember[0]);
	            }
	        	return res.notFound(); 
	        }
	        return res.notFound(); 
        }
	    catch (err){
	      return res.serverError(err);
	    }
    },
    create: async (req, res) => {
		try {
    		let params=req.allParams();
	        let user = await TaskMember.create({ 
			            	tasks_id: params.tasks_id, 
			            	project_members_id: params.project_members_id, 
			            	createdAt: moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss'),
			            	updatedAt: moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss'),
			            });
	      	return res.ok(user);
	    }
	    catch (err){
	    	return res.serverError(err);
	    }
    },
    update:async (req, res)=>{
		try {
			let params = req.allParams();
			let attributes = {};

			if(params.title) attributes.title = params.title;
			if(params.description) attributes.description = params.description; 
			if(params.due_on) attributes.due_on = params.due_on; 
			if(params.labels_id) attributes.labels_id = params.labels_id; 
			if(params.checklists) attributes.checklists = params.checklists; 
			attributes.updatedAt =  moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');

			const results = await TaskMember.update({id: params.id}, attributes);
			return res.ok(results);
		} catch (err) {
			return res.serverError(err);
		}
  	},
	delete: async (req, res)=>{
		try {
			let params = req.allParams();
			const results = await TaskMember.destroy({
				id: params.id
			});
			return res.ok(results);
		} catch (err) {
			return res.serverError(err);
		}
	}
};

