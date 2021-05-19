/**
 * MeetingController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const moment = require('moment-timezone');
module.exports = {
    find: async (req, res) => {
        try {
            let meetings = await Meeting.find().populate('meetingMembers').populate('creator').populate('project');
            return res.send(meetings);
        }
        catch (err) {
            return res.serverError(err);
        }
    },
    findOne: async (req, res) => {
        let params = req.allParams();
        try {
            if (params.id) {
                let meetings = await Meeting.find({ id: params.id }).populate('meetingMembers').populate('creator').populate('project');
                
                if (meetings.length > 0) {
                    return res.send(meetings[0]);
                }
                return res.notFound();
            }
            return res.notFound();
        }
        catch (err) {
            return res.serverError(err);
        }
    },
    create: async (req, res) => {
        try {
            let params = req.allParams();
            const data = {
                title: params.title,
                description: params.description,
                start: params.start,
                end: params.end,
                project:params.projects_id,
                creator:params.users_id,
                createdAt: moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss'),
                updatedAt: moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss'),
            }
            let meeting = await Meeting.create(data).fetch();
            if(params.members){
                var members=params.members;
                members.map(async function(item){
                    return await MeetingMember.create({
                        meeting:meeting.id,
                        user:params.users_id,
                        createdAt: moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss'),
                        updatedAt: moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss'),
                    }).fetch();
                });
                members=await Promise.all(members);
            }
            return res.ok(meeting);
        }
        catch (err) {
            return res.serverError(err);
        }
    },
    update: async (req, res) => {
        try {
            let params = req.allParams();
            let attributes = {};
            if (params.title) attributes.title = params.title;
            if (params.description) attributes.description = params.description;
            if (params.start) attributes.start = params.start;
            if (params.end) attributes.end = params.end;
			if ('googleCalendarInfo' in params) attributes.googleCalendarInfo = params.googleCalendarInfo;
            if (params.creator) attributes.creator = params.creator.id;
            
            attributes.updatedAt = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
            const results = await Meeting.update({ id: params.id }, attributes).fetch();
            if(results.length){
                return res.json(results[0]);
            }else return res.json(results);
        } catch (err) {
            return res.serverError(err);
        }
    },
    delete: async (req, res) => {
        try {
            let params = req.allParams();
            await Meeting.destroy({ id: params.id });
            return res.ok();
        } catch (err) {
            return res.serverError(err);
        }
    },
    respondToZoom:function(req,res){
        console.log(req.allParams());
        return res.ok();
    }
};