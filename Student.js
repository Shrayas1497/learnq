const {Model,DataTypes }=require('sequelize');
const sequelize=require('./database')
class Student extends Model{}

Student.init({
    firstname: {
      type:DataTypes.STRING
    },
    lastname: {
      type:DataTypes.STRING
    },
    email:{
        type:DataTypes.STRING
    },
    student_id:{
        type:DataTypes.INTEGER
    }}, 
    {
        sequelize,
        modelName:'student'
        
    })
module.exports=Student;