const mongoose = require('../lib/db');
const crypto = require('crypto');

const usersSchema = mongoose.Schema({
    username: String,
    password: String,
    fullName: String,
    email: String,
    friends: []
});

const User = mongoose.model('User', usersSchema);

const userService = {};

userService.createUser = (user) => {
  return new Promise((resolve, reject)=> {
    
      user.password = crypto.createHash('sha512').update(user.password).digest('hex');
      
      let newUser = new User(user);
      
      newUser.save().then((user) => {
        resolve(user);
      }).catch((err) => {
        console.error(err);
        reject(err);
      });
  });
};

userService.amendUser = (userData) => {
  return new Promise((resolve, reject)=> {
    let username = userData.username
    User.findOne({username}).then((user) => {
      if(userData.password.length){ // in fact this will always have a length
        user.password = crypto.createHash('sha512').update(userData.password).digest('hex');
      }
      user.fullName = userData.fullName;
      user.email = userData.email;
      user.save().then((done)=> {
        resolve(userData);    
      });
    }).catch((err) => {
      console.error(err);
      reject(err);
    });
  });
};
  
userService.isUsernameFree = (username) => {
  return new Promise ((resolve, reject) => {
    User.find({username}).then((users) => {
      if (users.length) {
        resolve(false);
      } else {
        resolve(true);
      }
    }).catch((err) => {
      reject(err);
    });
  });
};

userService.isEmailFree = (email) => {
  return new Promise ((resolve, reject) => {
    User.find({email}).then((users) => {
      if (users.length) {
        resolve(false);
      } else {
        resolve(true);
      }
    }).catch((err) => {
      reject(err);
    });
  });
};

userService.getAllUsers = () => {
  return new Promise((resolve, reject) => {
     User.find({}).then((users) => {
       resolve(users);
     }).catch((err)=> {
       reject(err);
     });   
  });
};

userService.getUser = (username) => {
  return new Promise((resolve, reject)=> {
    User.findOne({username}).then((user) => {
       resolve(user);
     }).catch((err)=> {
       reject(err);
     });   
  });  
};

userService.authenticateUser = (username, password) => {
  return new Promise((resolve, reject)=> {
    password = crypto.createHash('sha512').update(password).digest('hex');
    User.findOne({username, password}).then((user) => {
       if(user) {
         resolve(true);  
       } else {
         resolve(false);
       }
       
     }).catch((err)=> {
       reject(err);
     });   
  });  
};

userService.getFriends = (username) => {
  return new Promise((resolve, reject)=> {
    User.findOne({username}).then((me)=> {
      resolve(me.friends);
    }).catch((err) => {
      console.log(err);
      res.send(err);
    });
  });  
};

userService.addFriend = (username, friend) => {
  return new Promise((resolve, reject)=> {
    User.findOne({username}).then((me) => {
      if(!me.friends.includes(friend)) {
        me.friends.push(friend);  
      }
      me.save().then((done)=> {
        resolve({username, friend});    
      });
    }).catch((err) => {
     console.log(err);
     reject(err);
    });
  });  
};  

userService.deleteFriend = (username, friend) => {
  return new Promise((resolve, reject)=> {
    User.findOne({username}).then((me) => {
      me.friends.splice(me.friends.indexOf(friend), 1);
      me.save().then((done)=> {
        resolve(true);    
      });
    }).catch((err) => {
     console.log(err);
     reject(err);
    });
  });  
};  

userService.changeUsername = (username, newUsername) => {
  return new Promise((resolve, reject)=> {
    
  });  
};

userService.changePassword = (username, oldPassword, newPassword) => {
  return new Promise((resolve, reject)=> {
    
  });  
};


module.exports = userService;