const {Model,DataTypes }=require('sequelize');
const sequelize=require('./database')
class ClassRow extends Model{}

ClassRow.init({
    student_id:{
        type:DataTypes.INTEGER
    },
    tutor_id:{
        type:DataTypes.INTEGER
    },
    start_time:{
        type:DataTypes.DATE
    },
    end_time:{
        type:DataTypes.DATE
    },
    class_fee_per_hour:{
      type:DataTypes.INTEGER  
    },
    discount_rate:{
        type:DataTypes.INTEGER
    }},
{
    sequelize,
    modelName:'Class'
})

module.exports=ClassRow