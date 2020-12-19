/**
 * MemberRoleController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
	find: async (req,res)=>{
		try {
			let roles = await MemberRole.find();
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
	            let roles = await MemberRole.find({ id: params.id });
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
	        let roles = await MemberRole.create({ 
			            	name: params.name, 
			            	color: params.color, 
			            	bgColor: params.bgColor,
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
			
			if(params.title) attributes.title = params.title;
			if(params.description) attributes.description = params.description; 
			if(params.color) attributes.color = params.color; 
			if(params.bgColor) attributes.bgColor = params.bgColor; 
			
			const results = await Mahasiswa.update({id: params.id}, attributes, {updatedAt: moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss')});
			return res.ok(results);
		} catch (err) {
			return res.serverError(err);
		}
  	},
    delete: async (req, res)=>{
		try {
    		let params=req.allParams();
			const results = await MemberRole.destroy({
				id: params.id
			});
			return res.ok(results);
		} catch (err) {
			return res.serverError(err);
		}
	}
};

