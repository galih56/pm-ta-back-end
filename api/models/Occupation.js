/**
 * Occupation.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'occupations',
  primaryKey: 'id',
  attributes: {
    id: {
      columnName: 'id',
      type: 'number',
      autoIncrement: true,
      unique: true
    },
    name: {
      type: 'string',
      columnName: 'name',
    },
    color: {
      type: 'string',
      columnName: 'color',
      allowNull: true
    },
    bgColor: {
      type: 'string',
      columnName: 'bg-color',
      allowNull: true
    },
    users: {
      collection: 'User',
      via: 'occupation'
    },
    parentRelations: {
      collection: 'OccupationRelation',
      via: 'child'
    },
    childrenRelations: {
      collection: 'OccupationRelation',
      via: 'parent'
    },
    root: {
      type: 'boolean',
      columnName: 'root',
      allowNull: true
    },
    createdAt: false,
    updatedAt: false,
  },

};

