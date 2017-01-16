const express = require('express');
const router = express.Router();
const userService = require('../models/users');
const app = express();

app.use((req, res, next) => {
  if(req.session.username) {
    userService.getUser(req.session.username).then((userData) => {
      req.session.userData = userData;
      next();
    }).catch((err)=>{
      res.send('error');
    });
  } else {
    res.redirect('/sign-up');
  }
});

app.get('/dashboard', (req, res)=> {
  res.render('dashboard', {
    userData: req.session.userData,
    layout: 'private'
  });
});

app.get('/log-out', (req, res) => {
  delete req.session.username;
  res.redirect('log-in');
});

app.get('/edit-profile', (req, res)=> {
  res.render('edit-profile', {
    userData: req.session.userData,
    layout: 'private'
  });
});

app.get('/view-friends', (req, res)=> {
  userService.getFriends(req.session.username).then((friends) => {
    res.render('view-friends', {
      friends,
      layout: 'private'
    });
  });
});

app.get('/add-friend/:username', (req, res) => {
  userService.addFriend(req.session.username, req.params.username).then((result) => {
    req.flash('info', {message: 'Added Friend'});
    userService.addFriend(req.params.username, req.session.username).then((result) => { 
      req.flash('info', {message: 'Added To Friend\'s Friends'});  // maybe call this something else
      res.redirect('/view-friends'); 
    }).catch((err) => {
      console.log(err);
      res.send(err);
    });
  }).catch((err) => {
    console.log(err);
    res.send(err);
  });
});

app.get('/delete-friend/:username', (req, res) => {
  userService.deleteFriend(req.session.username, req.params.username).then((result) => {
     req.flash('info', {message: 'Deleted Friend'});
     userService.deleteFriend(req.params.username, req.session.username).then((result) => {
       req.flash('info', {message: 'Deleted From Friend\'s Friends'});
       res.redirect('/view-friends');
     }).catch((err) => {
       console.log(err);
       res.send(err);
     });
  }).catch((err) => {
    console.log(err);
    res.send(err);
  });
});


app.get('/list-users', (req, res) => {
  userService.getAllUsers().then((users) => {
    res.render('users', {
      layout: 'private',
      users
    });
  });
});

app.get('/search-users', (req, res) => {
  if(req.query.username) {
    userService.getUser(req.query.username).then((user) => {
        res.render('search-users', {
          layout: 'private',
          searchResult: user,
          query: req.query.username
        });     
    }).catch((err) => { console.error(err); res.send(err)});
  } else {
    res.render('search-users', {
      layout: 'private'
    });  
  }
  
});

app.get('/profile/:username', (req, res) => {
  userService.getUser(req.params.username).then((user) => {
    if(user) {
      res.render('profile', {
        profile: user,
        layout: 'private'
      });      
    } else {
      res.sendStatus(404);
    }

  }).catch((err) => { 
    res.send(err);
  });
});

app.post('/edit-profile', (req, res) => {
  let userData = req.body;
  userData.username = req.session.username;
  userService.amendUser(userData).then((userData) => {
    req.session.userData = userData;
    res.redirect('/edit-profile');
  });
  
});

module.exports = app;