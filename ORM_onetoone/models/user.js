'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    
    static associate(models) {
      // define association here
      User.hasOne(models.Email) //user has one email address
    }
  }
  User.init({
    name: DataTypes.STRING,
    phoneNo: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    timestamps: false
  });
  return User;
};