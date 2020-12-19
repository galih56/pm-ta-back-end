/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const moment=require('moment-timezone');

module.exports = {
	find: async (req,res)=>{
		try {
			let users = await User.find();
	        return res.send(users);
	    }
	    catch (err){
	      return res.serverError(err);
	    }
	},
    findOne: async (req, res) => {
    	let params=req.allParams();
		try {
	        if (params.id) {
	            let users = await User.find({ id: params.id }).populate('employeeRole').populate('asMember');
	            if (users.length > 0) {
	                return res.send(users[0]);
	            }
	        	return res.notFound();
	        }
	        return res.notFound();
        }
	    catch (err){
	      return res.serverError(err);
	    }
    },

    update:async (req, res)=>{
		try {
			let params = req.allParams();
			let attributes = {};

			if(params.name) attributes.name = params.name;
			if(params.email) attributes.email = params.email; 
			if(params.phone_number) attributes.phone_number = params.phone_number; 
			if(params.token) attributes.token = params.token; 
			if(params.employee_roles_id) attributes.employee_roles_id = params.employee_roles_id; 
			if(params.last_login) attributes.last_login = params.last_login; 
			if(params.profile_picture_path) attributes.profile_picture_path = params.profile_picture_path; 
			attributes.updatedAt =  moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
			const results = await User.update({id: params.id}, attributes);
			return res.ok(results);
		} catch (err) {
			return res.serverError(err);
		}
  	},
	delete: async (req, res)=>{
		try {
    		let params=req.allParams();
			const results = await User.destroy({
				id: params.id
			});
			return res.ok(results);
		} catch (err) {
			return res.serverError(err);
		}
	},
	register: function(req, res) {
		const params=req.allParams();
		const name=params.name;
		const password=params.password;
		const confirmation=params.confirmation;
		const email=params.email;
		const phoneNumber=params.phoneNumber;

		if(!password || !confirmation || password != confirmation) {
			return callback({err: ["Password does not match confirmation"]});
		}

		let newUser={
			name:name, password:password, 
			email:email, profilePicturePath:'', 
			phoneNumber:phoneNumber, verified:false, 
			token:'', employeeRole:1, 
			last_login:'',
		}

		User.find({ email:params.email }).exec( async function (err, users){
	        if (err) {
	            return res.negotiate(err);
	        }
	        if (users.length) {
	            res.status(400);
	            return res.json('User already exists!');
	        } else {
		        await User.create(newUser).exec(function(err, user) {
		            if (err) {
			            var readableErr = '' + err;
				     
				        // return something the client will recognize and interpret
				        // you can use http error codes, or your own conventions
				        return res.send({
				            success: false,
				            message: readableErr
				        });
		            }
		            return res.json({success:true,...user});
		        });
	        }
	    });

    },
     login: function(req, res) {
		const params=req.allParams();

        //Return error if email or password are not passed
        if (!params.email || !params.password) {
            return res.badRequest({
                err: "Email or password cannot be empty"
            });
        }
        //Find the user from email
        User.findOne({
            email: params.email
        }).populate('asMember').populate('employeeRole').exec(function(err, user) {
            if (err) {
                return res.serverError(err);
            }
            if (!user) {
                return res.notFound({err: 'Could not find email,' + params.email + ' sorry.'});
            }
            //Compare the password
            bcrypt.compare(params.password,user.password, function(err, result) {
                if(result) {
                	const payload=user;
                	//password is a match
                	if(result) {
						//password is a match
						const payload=user;
						const SECRET='galih56zoopreme56';
						jwt.sign(payload,SECRET,{expiresIn:60*60*24*7},(err,token)=>{
							const auth_data={
								success:true,
								token:'Bearer '+token,
								user:user
							}
							return res.json(auth_data);
						});
					} 
                } else {
                	//password is not a match
                	return res.forbidden({err: 'Email and password combination do not match'});
                }
            });

        });
    },

    getProjects:async function(req, res) {
		const params=req.allParams();
		const user_id=params.id;
        //Find projects based on user_id that registered as a member of projects
        try {
        	await ProjectMember.find().where({'user':user_id})
        						.populate('project')
        						.populate('role')
								.exec(async (error,result)=>{
									if(error){
										console.log(error);
										res.serverError(error);
									}
									//looping through lists
									result=result.map(async (member)=>{
										//get the tasks of a list
										let lists = await List.find().where({ project: member.project.id }).populate('tasks').sort('position ASC');
										
										lists=lists.map(list=>{
											list.cards=list.tasks;
											delete list['tasks'];
											return list;
										})
										
										member.project.columns=lists;
										return member.project;
									});
				            		//handle promise from anonymous function within .map()
				            		var projects =await Promise.all(result)
				            							.then(result)
				            							.catch((error)=>{
				            								console.log('Promise.all() error : ',error);
				            							});
				            		return res.send(projects);
								});
	    }
	    catch (error){
	    	return res.serverError(error);
	    }
    },
    createProject : async function(req,res){
    	let params=req.allParams();
    	let users_id=params.users_id;
		try {
			var newProject={ 
			            	title: params.title,  description: params.description,  
			            	estimationDeadline: params.estimationDeadline,
			            	createdAt: moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss'), 
			            	updatedAt: moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss'),
			            }
			//Use fetch() to return values
			//exec() to execute query
			await Project.create(newProject)
						.fetch()
						.exec(async function(err, project){
			 				let project_id=project.id;
							if(err) {
								return res.send(err);
							}else{
								//Create first member of current project
								var newMember={ 
									project:project.id, 
									user:users_id,
									role:2,//Project Creator
									createdAt: moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss'), 
									updatedAt: moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss'),
								}
								await ProjectMember.create(newMember).fetch();
							}
							project.columns=[];
							return res.ok(project);
				        });
	    }
	    catch (err){
	    	return res.serverError(err);
	    }
    },
};
