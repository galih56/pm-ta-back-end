/**
 * TagController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

 const moment=require('moment-timezone');
 module.exports = {
    find: async (req,res)=>{
        try {
            let teams = await Team.find();
            return res.send(teams);
        }
        catch (err){
        return res.serverError(err);
        }
    },
    findOne: async (req, res) => {
        let params=req.allParams();
        try{
            if (params.id) {
                let teams = await Team.find({ id: params.id }).populate('users').populate('projects');
                if (teams.length > 0) {
                var team=teams[0];
                team.users=team.users.map(async (user)=>{
                    return await User.findOne({ id: user.user});
                });
                team.users = await Promise.all(team.users);

                team.projects=team.projects.map(async (project)=>{
                    return await Project.findOne({ id: project.project});
                });
                team.projects = await Promise.all(team.projects);
                    return res.send(team);
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
        let attributes={};
        if(params.name) attributes.name = params.name;
        if(params.description) attributes.description = params.description; 
        if(params.users)attributes.users=params.users;
        let team = await Team.create(attributes).fetch();

        return res.ok(team);
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
            if(params.description) attributes.description = params.description; 
            if(params.users) attributes.users = params.users; 

            const results = await Team.update({id: params.id}, attributes);
            return res.ok(results);
        } catch (err) {
            return res.serverError(err);
        }
    },
    delete: async (req, res)=>{
        try {
            let params = req.allParams();
            const results = await Team.destroy({
                id: params.id
            });
            return res.ok(results);
        } catch (err) {
            return res.serverError(err);
        }
    },
    addMember:async (req,res)=>{
        try{
            let params = req.allParams();
            if(typeof params.users=='array'){
                var insertedUsers=[];
                for (let i = 0; i < params.users.length; i++) {
                    const user = params.users[i];
                    var user_id=null;
                    if(typeof user == 'object') user_id=user.id; else user_id=user;
                    var team_member=await TasksHasUsers.create({ team:params.teamId,user:user_id }).fetch();
                    user=await User.find({id:team_member.user});
                    insertedUsers.push(user);
                }
                return res.ok(insertedUser);
            }else{  
                var team_member=await TasksHasUsers.create({ team:params.teamId,user:params.userId }).fetch();
                var user=await User.find({id:team_member.user});
                return res.ok(user);
            }
        }catch(err){
            return res.serverError(err);
        }
    },
    removeMember:async (req,res)=>{
        try{
            let params = req.allParams();
            await TasksHasUsers.destroy({ team:params.teamId, user:params.userId}).fetch();
            return res.ok(user);
        }catch(err){
            return res.serverError(err);
        }
    },
    addProject:async (req,res)=>{
        try{
            let params = req.allParams();
            var team_project=await TasksHasProjects.create({ team:params.teamId,user:params.projectId }).fetch();

            var project=await Project.find({id:projectId});
            return res.ok(project);
        }catch(err){
            return res.serverError(err);
        }
    },
    removeProject:async (req,res)=>{
        try{
            let params = req.allParams();
            var team_member=await TasksHasProjects.destroy({ team:params.teamId,user:params.projectId }).fetch();

            var user=await User.find({id:team_member.user});
            return res.ok(user);
        }catch(err){
            return res.serverError(err);
        }
    }
};

 