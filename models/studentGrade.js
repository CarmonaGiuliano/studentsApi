const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const types = ['First Test', 'Middle Test', 'Last Test', 'Extra Test', 'Homework', 'Forum'];
const subjects = ['Algebra', 'Geometry', 'Physics', 'English', 'Computer Science', 'Algorithm'];



const stdntGrdSchema = new Schema({

    _id: {
    type: Number,
    required: true,
},



    enrolment: {
      type: Number,
      required: true,
      validate:  { validator: function(v){
                  return v>= 1 && v <= 200
                            },
                   message:'Please, in the enrolment field enter just numbers between 1 and 500.'}

    },

    name: {
         type : String,
         required: true
     },

     subject: {
         type : String,
         //enum: subjects,
          required: true,
          validate:   { validator: function (val) {
                       return subjects.includes(val) },

                       message:`Please enter just one of this subjects: ${subjects}`}
     },

     type: {
         type : String,
         required: true,
         //enum: types,
         validate: {  validator: function (val) {
                       return types.includes(val) },

                       message:`Please enter just one of this subjects: ${types}`}
     },

      value: {
          type : Number,
          required: true,
          validate:  { validator: function (val) {
                        return val >=0 && val <= 10 },

                         message:'Please, in value field enter just numbers between 0 and 10'}
      },

      //to set an id to the events data stored and updated, we will use a timestamp

     },  {timestamps: true});


     //when I communicate with a DB in future, it will pluralize the name book and search for a collection with this name pluralized.

const StudentGrade = mongoose.model('StudentGrade', stdntGrdSchema);

module.exports = StudentGrade;
