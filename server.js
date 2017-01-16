const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const app = express();
const l = console.log.bind(console);
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const validator = require('express-validator');
const flash = require('express-flash');
const mongoose = require('./lib/db'); 

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

const publicRoutes = require('./routes/public');
const privateRoutes = require('./routes/private');

// Set up session

app.use(session({
  secret: 'q43easfdfewfefsdf',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));


app.use(flash());

app.use(express.static('public'));

app.use(validator());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', publicRoutes);
app.use('/', privateRoutes);



listener = app.listen("3000", function () {
  console.log('Server started on port ' + listener.address().port);
});