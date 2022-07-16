const {Model,DataTypes }=require('sequelize');
const sequelize=require('./database')
class Tutor extends Model{}

Tutor.init({
    firstname: {
    type:DataTypes.STRING
        },
    lastname: {
    type:DataTypes.STRING
    },
    email:{
        type:DataTypes.STRING
    },
    tutor_id:{
        type:DataTypes.INTEGER
    }}, 
    {
        sequelize,
        modelName:'tutor'
        
    })
module.exports=Tutor;