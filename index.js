const express = require("express");
const sequelize = require('./database');
const Tutor = require('./Tutor');
const Student = require('./Student');
const ClassRow = require('./ClassRow')
const date = require('date-and-time')

sequelize.sync({ force: true }).then(() => console.log('db is ready'));

const app = express();

app.use(express.json());

// app.post('/users', async (req, res) => {
//   await User.create(req.body);
//   res.send("success");
// })

app.get('/', async (req, res) => {
  res.send("<a href=\"/init\">link text</a>");
})

app.get('/init', async (req, res) => {
  const now = new Date()
  const dtF = 'YYYY-MM-DD HH:mm:ss.SSS Z'
  let ag = date.addHours(now, -1)
  past1hr = date.format(ag, dtF)
  let ag2 = date.addHours(now, -2)
  past2hr = date.format(ag2, dtF)
 
  let s1 = await ClassRow.create({ student_id: 1, tutor_id: 1, start_time: past2hr, end_time: past1hr,  class_fee_per_hour: 10, discount_rate: 5})

  let s2 = await ClassRow.create({ student_id: 1, tutor_id: 2, start_time: date.format(date.addHours(now, -3), dtF), end_time: date.format(date.addHours(now, -2), dtF),  class_fee_per_hour: 10, discount_rate: 5})

  let s3 = await Tutor.create({firstname: 'Vikas', lastname: 'Kumar', email: 'vikas@learnq.in', tutor_id: 1})

  let s4 = await Tutor.create({firstname: 'Ajay', lastname: 'Singh', email: 'ajay@learnq.in', tutor_id: 2})

  let s5 = await Student.create({firstname: 'Vicky', lastname: 'Chaiwala', email: 'vky@chaiwa.la', student_id: 1})

  let s6 = await Student.create({firstname: 'Rocky', lastname: 'tvwala', email: 'rky@tvwa.la', student_id: 2})

  const classes = await sequelize.query("SELECT Classes.student_id, Classes.tutor_id, Classes.start_time, Classes.end_time, Classes.class_fee_per_hour, Classes.discount_rate, students.firstname AS sfirst, students.lastname AS slast, students.email FROM Classes, students WHERE Classes.student_id=students.student_id")
// console.log(classes.every(classs => clas instanceof ClassRow)); // true
console.log("All users:", JSON.stringify(classes, null, 2));
  res.json(classes);
})

app.get('/getInvoice', async (req, res) => {
  let result;
  if(req.query.tutorId != undefined){
    result = await getInvoiceForTutor(req.query.tutorId)
  }
  result = await getTotalInvoice()
  res.json(result)
})

async function getTotalInvoice(){
  const tutors = await Tutor.findAll()
  return tutors.map(tutor => {
    return getInvoiceForTutor(tutor.tutor_id)
  })
}

async function getInvoiceForTutor(tutorid){
  const classes = await sequelize.query("SELECT Classes.student_id, Classes.tutor_id, Classes.start_time, Classes.end_time, Classes.class_fee_per_hour, Classes.discount_rate, students.firstname AS sfirst, students.lastname AS slast, students.email FROM Classes, students WHERE Classes.student_id=students.student_id AND tutor_id=" + (''+tutorid))

  let uniqueStudents = [...new Set(classes[0].map(item => item.student_id))]
  let students = [uniqueStudents.map(sid => {
    let hrs=0, amt=0.0, first='', last='', email='';
    classes[0].forEach(cls => {
      if(cls.student_id == sid) {
        st = new Date(cls.start_time)
        et = new Date(cls.end_time)
        hrs = hrs + date.subtract(et, st).toHours();
        amt = amt + hrs*cls.class_fee_per_hour*(1- cls.discount_rate/100)
        first = cls.firstname
        last = cls.lastname
        email = cls.email
      }
    })
    return {first: first, last: last, email: email, hrs: hrs, amount: amt}
  })]
 
  const tutor = await Tutor.findOne({
    where: {
    tutor_id: tutorid
  }
  })
  totalAmount = 0.0;
  students.forEach(student => {
    totalAmount += student.amount
  })
  return {first: tutor.firstname, last: tutor.lastname, email: tutor.email, students: students, amount: totalAmount*0.92}

}





app.listen(3000, () => {
  console.log("app is running");
});
