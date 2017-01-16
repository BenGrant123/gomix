const mongodb = require('mongodb');
const mongoose = require('mongoose');
const crypto = require('crypto');

const uri = 'mongodb://bengrant:ben123456@ds141128.mlab.com:41128/bengrant';
const l = console.log.bind(console);

mongoose.connect(uri);  
mongoose.Promise = Promise;

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  l('connected to db...'); 
});


module.exports = mongoose;