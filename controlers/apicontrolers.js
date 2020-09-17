const StudentGrade = require('../models/studentGrade');
const assert = require('assert');


const deleteById = async(req, res, next) =>{
try{

  var grade = await StudentGrade.findById({_id: req.params.id}).exec();
  if(grade === null){
      throw new Error('Grade not found, check the id');

 }else{
   StudentGrade.deleteOne(grade);
   res.json(grade);
 }

}catch(err){
  next(err);
}
}



const postNewGrade = async (req, res, next) =>{
try{

  var grade = await StudentGrade.find({enrolment: req.body.enrolment}).exec();


    //add a grade with a enrolment never registered before
    if(grade.length === 0){


        if(await StudentGrade.exists({name: req.body.name})){

           throw new Error('this name is linked with another enrolment');

        }else{

           let createdGrade = await StudentGrade.create(req.body);
           res.json(createdGrade);
        }

   }else if(grade[0].name != req.body.name){

        throw new Error('this enrolment is used to other name');

   }else{

      if(await StudentGrade.exists({enrolment: req.body.enrolment, subject: req.body.subject, type: req.body.type})){

        throw new Error('You can set a type of test only once for each subject');

     }else{

         let createdGrade = await StudentGrade.create(req.body);
         res.json(createdGrade);

     }

  }

}catch(err){

  next(err);
}
}




const updateToNewGrade = async (req, res, next) =>{


var opts = {new:true, useFindAndModify:false, runValidators: true}

try{

  var grade = await StudentGrade.find({enrolment: req.body.enrolment}).exec();
  //Updating the enrolment as well as the name.
  //Uptading to a brand new grade.
      if(grade.length === 0){


         if(await StudentGrade.exists({name: req.body.name})){
            //custom error 1

            throw new Error('This name is linked with another enrolment.');

        }else{

           var updatedGrade = await StudentGrade.findByIdAndUpdate({_id: req.params.id}, req.body, opts)
           res.json(updatedGrade);
        }


     }else if(grade[0].name != req.body.name){

          //custom error 2
          throw new Error('This enrolment is used to other name');

     }else{

         throw new Error('Here you just can uptade the current grade to a brand new grande');
   }

 }catch(err){
   next(err);
}

}





const updateAnOldGrade = async (req, res, next) =>{

var opts = {new:true, useFindAndModify:false, runValidators: true}

try{

      var grade = await StudentGrade.findById(req.params.id).exec();

      if(grade === null){

         throw new Error('Grade not Found, please check the id');


     }else if(grade.subject !== req.body.subject && grade.type !== req.body.type){

        if(await StudentGrade.exists({name: req.body.name, subject: req.body.subject, type: req.body.type})){

           throw new Error('A test of each one subject must be unique');

        }else{

           assert.ok(grade.name === req.body.name && grade.enrolment === req.body.enrolment, 'You cannot change all fields of one grade here');
           let updatedGrade =  await StudentGrade.findByIdAndUpdate(grade, req.body, opts);
           res.json(updatedGrade);
       }


     }else if(grade.subject == req.body.subject && grade.type !== req.body.type){

        if(await StudentGrade.exists({name: req.body.name, subject: req.body.subject, type: req.body.type})){

           throw new Error('A test of each one subject must be unique');

        }else{

           assert.ok(grade.name === req.body.name && grade.enrolment === req.body.enrolment, 'You cannot change all fields of one grade here');
           let updatedGrade =  await StudentGrade.findByIdAndUpdate(grade, req.body, opts);
           res.json(updatedGrade);
       }


     }else if(grade.subject !== req.body.subject && grade.type == req.body.type){

        if(await StudentGrade.exists({name: req.body.name, subject: req.body.subject, type: req.body.type})){

           throw new Error('A test of each one subject must be unique');

        }else{

           assert.ok(grade.name === req.body.name && grade.enrolment === req.body.enrolment, 'You cannot change all fields of one grade here');
           let updatedGrade =  await StudentGrade.findByIdAndUpdate(grade, req.body, opts);
           res.json(updatedGrade);
       }


    }else if(grade.enrolment !== req.body.enrolment && grade.name == req.body.name){

        if(await StudentGrade.exists({enrolment: req.body.enrolment})){

           throw new Error('This enrolment is currently linked with another name');

        }else{

          assert.ok(grade.subject === req.body.subject && grade.type === req.body.type, 'You cannot change all fields of one grade here');
          StudentGrade.updateMany({name:grade.name}, {enrolment: req.body.enrolment}, opts).then((up)=>{
          res.json(up);
        }).catch(next);
        }


    }else if(grade.name !== req.body.name && grade.enrolment == req.body.enrolment){

        if(await StudentGrade.exists({name: req.body.name})){

           throw new Error('This name is currently linked with another enrolment');

        }else{

          assert.ok(grade.subject === req.body.subject && grade.type === req.body.type, 'You cannot change all fields of one grade here');
          StudentGrade.updateMany({enrolment:grade.enrolment}, {name: req.body.name}, opts).then((up)=>{
          res.json(up);
        }).catch(next);
        }

    }else if(grade.name !== req.body.name && grade.enrolment !== req.body.enrolment){

      throw new Error('You cannot change both name and enrolment at the same time, please create a new grade');


    }else{

      let updatedGrade = await StudentGrade.findByIdAndUpdate(req.params.id, {value: req.body.value}, opts);
      res.json(updatedGrade);
    }


}catch(err){
  next(err)
}

}




const searchGrade = (req, res, next) =>{

StudentGrade.findById(req.params.id).then((result)=>{
  if(result !== null)
    res.json(result);
  else
    throw new Error('Grade not found')

}).catch(next);

}

const getStudentAverage = async (req, res, next)=>{

  try{
    var sum = 0;
    var average = 0;
    var grades = await StudentGrade.find({name: req.body.name, subject: req.body.subject}).exec();
      if(grades.length !== 0){
        grades.forEach((grade) => {
           sum = grade.value + sum;
           //there is 5 types of assessment for each suject
           average = sum/5;
   });

    }else{

      throw new Error('Student or Subject not found');
 }

    res.json({studentAverage: average});

  }catch(err){
    next(err);
  }
}




const getSubjectAverage = async (req,res,next) =>{

  try{

    var sum = 0;
    var average = 0;
    var students = [];

    var subjects = await StudentGrade.find({subject: req.body.subject}).exec();
      if(subjects.length !== 0){

        subjects.forEach((grade) => {
            if(!students.includes(grade.name)){
               students.push(grade.name);
          }
          sum = grade.value + sum;
          average = sum/(students.length * 5);
     });

    }else{

       throw new Error('Subject not found');
   }

    res.json({subjectAverage: average});

  }catch(err){
    next(err);
  }
}





module.exports = {deleteById,
                  postNewGrade,
                  updateToNewGrade,
                  updateAnOldGrade,
                  searchGrade,
                  getStudentAverage,
                  getSubjectAverage
                 };
