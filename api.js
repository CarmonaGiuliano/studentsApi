const express = require('express');
const api = express();
const mongoose = require('mongoose');
const routes = require('./routes/apiroutes');
const DBURI = 'mongodb+srv://ramoncarmona:da8189za1215@myfirstnode.wihlb.mongodb.net/school?retryWrites=true&w=majority';
const bodyParser = require('body-parser');

// connecting atlas
mongoose.connect(DBURI, { useNewUrlParser: true, useUnifiedTopology: true })
   .then()
   .catch((err) => console.log(err));

//changing the promise obj of mongoose (the current promise in mongoose is deprecated)

mongoose.Promise = global.Promise;


api.use(bodyParser.json());

api.use('/api', routes);

api.use((err, req, res, next)=>{
  console.log(err)
  res.status(422).send({error: err.message});
});

api.listen(3000, ()=> console.log('listening on the port 3000'));
