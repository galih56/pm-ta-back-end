/**
 * ProjectMemberController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
	find: async (req,res)=>{
		try {
			let roles = await ProjectMember.find();
	        return res.send(roles);
	    }
	    catch (err){
	      return res.serverError(err);
	    }
	},
    findOne: async (req, res) => {
    	let params=req.allParams();
    	try{
       		if (params.id) {
            let roles = await ProjectMember.find({ id: params.id });
	            if (roles > 0) {
	                return res.send(roles[0]);
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
	        let roles = await ProjectMember.create({ 
			            	name: params.name, 
			            	color: params.color, 
			            	bgColor: params.bgColor,
			            	createdAt: moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss'),
			            	updatedAt: moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss'),
			            });
	      	return res.ok(roles);
	    }
	    catch (err){
	    	return res.serverError(err);
	    }
    },
    update:async (req, res)=>{
		try {
			let params = req.allParams();
			let attributes = {};
			
			if(params.user_id) attributes.user_id = params.user_id;
			if(params.projects_id) attributes.projects_id = params.projects_id; 
			if(params.roles_id) attributes.roles_id = params.roles_id; 

			const results = await ProjectMember.update({id: params.id}, attributes, {updatedAt:moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss')});
			return res.ok(results);
		} catch (err) {
			return res.serverError(err);
		}
  	},
    delete: async (req, res)=>{
		try {
    		let params=req.allParams();
			const results = await ProjectMember.destroy({
				id: params.id
			});
			return res.ok(results);
		} catch (err) {
			return res.serverError(err);
		}
	}
};