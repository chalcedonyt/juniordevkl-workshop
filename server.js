const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const path = require('path')
const logger = require('morgan');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');

var mongoDB = 'mongodb://127.0.0.1/practiceDB';
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));

const index = require('./routes/index');
const api = require('./routes/api');


app.use('/', index);
app.use('/api', api);


const PORT = 3000;
app.listen(PORT, function(){
  console.log('app listening on port', PORT)
})