/**
 * OccupationController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

function findOccupationFromArray(occupations, id) {
	var item = null;
	for (let i = 0; i < occupations.length; i++) {
		const occupation = occupations[i];
		if (occupation.id == id) item = occupation;
	}
	// console.log('item : ',item,occupations,id);
	return item;
}

function restructureData(root, all_occupations) {
	var children = [];
	if (root.childrenRelations.length > 0) {
		for (let i = 0; i < root.childrenRelations.length; i++) {
			var relation = root.childrenRelations[i];
			var child = findOccupationFromArray(all_occupations, relation.child);
			if(child) {
				child = restructureData(child, all_occupations);
				children.push(child);
			}
		}
	}
	root.children = children;
	return root;
}

async function getParentAndChildren(occupations) {
	occupations = occupations.map(function (item) {
		var children = []
		for (let i = 0; i < item.childrenRelations.length; i++) {
			var childRelation = item.childrenRelations[i];
			var child = findOccupationFromArray(occupations, childRelation.child);
			children.push(child);
		}

		delete item.parentRelations;
		delete item.childrenRelations;
		var newItem = { ...item, children: children}
		return newItem;
	})
	return occupations;
}

module.exports = {
	find: async (req, res) => {
		let occupations = await Occupation.find()
			.populate('users')
			.populate('parentRelations')
			.populate('childrenRelations');
		return res.send(occupations);
	},
	getTree:async function(req,res){
		let occupations = await Occupation.find()
			.populate('users')
			.populate('parentRelations')
			.populate('childrenRelations');
			
		var users = [];
		occupations.forEach(function (item) {
			for (let i = 0; i < item.users.length; i++) {
				const user = item.users[i];
				var newUser = {
					id: item.id,
					user_id: user.id,
					title: user.name,
					name: item.name,
					parentsRelations: item.parentsRelations,
					childrenRelations: item.childrenRelations,
					root: item.root
				}
				users.push(newUser);
			}
		});

		var root = null;
		for (let i = 0; i < users.length; i++) {
			const item = users[i];
			if (item.root === true) root = item;
		}
		tree = restructureData(root, users);
		return res.send(tree);
	},
	findOne: async (req, res) => {
		try {
			let params = req.allParams();
			if (params.id) {
				let occupations = await Occupation.find({ id: params.id })
					.populate('parentRelations')
					.populate('childrenRelations')
				if (occupations.length > 0) {
					occupations = await getParentAndChildren(occupations);
					return res.send(occupations[0]);
				}
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
			let occupations = await Occupation.create({ name: params.name, color: params.color, bgColor: params.bgColor, }).fetch();

			if (params.children.length > 0) {
				var children = params.children;
				for (let i = 0; i < children.length; i++) {
					const child = children[i];
					await OccupationRelation.create({ parent: occupations.id, child: child.id });
				}
			}
			occupations = await Occupation.find({ id: occupations.id })
				.populate('parentRelations')
				.populate('childrenRelations');
			occupation = await getParentAndChildren(occupation);
			return res.ok(occupation);
		}
		catch (err) {
			return res.serverError(err);
		}
	},
	update: async (req, res) => {
		try {
			let params = req.allParams();
			let attributes = {};

			if (params.id) attributes.id = params.id;
			if (params.name) attributes.name = params.name;
			if (params.color) attributes.color = params.color;
			if (params.bgColor) attributes.bgColor = params.bgColor;

			await Occupation.update({ id: params.id }, attributes);
			await OccupationRelation.destroy().where({ parent: params.id });

			if (params.children.length > 0) {
				var children = params.children;
				for (let i = 0; i < children.length; i++) {
					const child = children[i];
					await OccupationRelation.create({ parent: attributes.id, child: child.id });
				}
			}

			let occupations = await Occupation.find({ id: params.id })
				.populate('parentRelations')
				.populate('childrenRelations')
			if (occupations.length > 0) {
				occupations = await getParentAndChildren(occupations);
				return res.send(occupations[0]);
			} else return res.notFound();

		} catch (err) {
			return res.serverError(err);
		}
	},
	delete: async (req, res) => {
		try {
			let params = req.allParams();
			const results = await User.destroy({ id: params.id });
			return res.ok(results);
		} catch (err) {
			return res.serverError(err);
		}
	}
};

