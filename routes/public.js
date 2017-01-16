const express = require('express');
const router = express.Router();
const userService = require('../models/users');
const l = console.log.bind(console);
const app = express();

app.get("/", function (req, res) {
  if(req.session.username) {
    res.redirect('/dashboard');
  } else {
    res.redirect('/log-in');
  }
});

app.get('/log-in', (req, res)=> {
  
  if(req.session.username) {
    res.redirect('/dashboard');
  }
  
  res.render('log-in', {
    layout: 'public'
  });
});

app.post('/log-in', (req, res)=> {
  
  if(req.session.username) {
    res.redirect('/dashboard');
  }
  
  req.checkBody('username', 'Please enter a username').notEmpty();
  req.checkBody('password', 'Password must be a minimum of 6 characters.').isLength(6, 65);
  
  let errors = req.validationErrors();
  let ourErrors = [];
  
  userService.authenticateUser(req.body.username, req.body.password).then((authenticated) => {
    if(authenticated) {
      req.session.username = req.body.username;
      res.redirect('/dashboard');
    } else {
        req.flash('error', {message: 'The username or password you entered is incorrect'});
        res.redirect('/log-in');
    }
    
  }).catch((err) => {
    res.send(err);
  })
  
  
  
});

app.get('/sign-up', (req, res)=> {
  
  if(req.session.username) {
    res.redirect('/dashboard');
  }
  
  res.render('sign-up', {
    layout: 'public'
  });
});

app.post('/sign-up', (req, res)=> {
  
  if(req.session.username) {
    res.redirect('/dashboard');
  }
  
  req.checkBody('email', 'Please enter a valid email address.').isEmail();
  req.checkBody('password', 'Password must be a minimum of 6 characters.').isLength(6, 65);
  req.checkBody('full-name', 'Please enter a full name').notEmpty();
  req.checkBody('username', 'Please enter a username').notEmpty();
  
  let errors = req.validationErrors();
  let ourErrors = [];
  
  userService.isUsernameFree(req.body.username).then((free) => {
    
    if(!free) {
      l('not free');
      ourErrors.push('Username is in use');
    } 
    
    return userService.isEmailFree(req.body.email);
    
  }).then((free) => {
      
    if(!free) {
      ourErrors.push('Email address is in use');
    }
    
    if (errors || ourErrors.length) {
  
      let errorMessages = [];
      
      if(errors) {
        errors.forEach((element, index) => {
          errorMessages.push({message: errors[index].msg});
        });  
      }
      
      if(ourErrors.length) {
        ourErrors.forEach((element, index) => {
          errorMessages.push({message: ourErrors[index]});
        });  
      }
      
      req.flash('error', errorMessages);
      res.redirect('/sign-up');
      
    } else {
      
      let newUser = {
          username: req.body.username,
          password: req.body.password,
          fullName: req.body['full-name'],
          email: req.body.email
      };
        
      return userService.createUser(newUser);
    }
      
  }).then((user) => {
    
    req.session.username = user.username;
    res.redirect('/dashboard');
  
  }).catch((err)=> {
    res.send(err);
  });
   
});

module.exports = app;