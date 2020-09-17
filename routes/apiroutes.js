const express = require ('express');
const router = express.Router();
const StudentGrade = require('../models/studentGrade');
const controllers = require('../controlers/apicontrolers');


router.get('/', (req, res) =>{
res.send('test');

});

router.post('/grades/add', controllers.postNewGrade);

router.delete('/grades/:id', controllers.deleteById);

router.put('/grades/:id', controllers.updateToNewGrade);

router.patch('/grades/update/:id', controllers.updateAnOldGrade);

router.get('/grades/search/:id', controllers.searchGrade);

router.get('/grades/studentaverage', controllers.getStudentAverage);

router.get('/grades/subjectaverage', controllers.getSubjectAverage);


module.exports = router;
