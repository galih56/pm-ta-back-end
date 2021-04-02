/**
 * Occupation.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
    tableName: 'occupation_relations',
    primaryKey: 'id',
    attributes: {
        id: {
            columnName: 'id',
            type: 'number',
            autoIncrement: true,
            unique: true
        },
        parent: {
            columnName: 'parent_id',
            model: 'Occupation'
        },
        child: {
            columnName: 'child_id',
            model: 'Occupation'
        },
        createdAt: false,
        updatedAt: false,
    },

};

