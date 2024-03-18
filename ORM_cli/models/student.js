'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Student.init({
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "Name field should have a value"
        }
      }
    },
    rollNo: {
      type: DataTypes.INTEGER,
      validate: {
        min: {
          args: 1,
          msg: "minimum value should be one"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          args: true,
          msg: "Email value is not a valid value"
        }
      }
    },
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Student',
    timestamps: false
  });
  return Student;
};