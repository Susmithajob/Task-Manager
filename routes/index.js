var express = require('express');
var router = express.Router();
var userModel = require('./users');
const passport = require('passport');
const localStrategy = require('passport-local');

passport.use(new localStrategy(userModel.authenticate()));

router.post('/register', function(req, res) {
  var userdata = new userModel({
    firstName: req.body.firstname,
    lastName: req.body.lastname,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    confirmpassword: req.body.passwordconfirm
  });
  userModel.register(userdata, req.body.password, function(err, registeredUser) {
    if (err) {
      console.error(err);
      return res.redirect('/register'); // Redirect to registration page if registration fails
    }
    passport.authenticate("local")(req, res, function() {
      res.redirect('/profile');
    });
  });
});

router.get('/profile', async function(req, res, next) {
  try {
    const user = await userModel.findById(req.user._id);
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.render('home', { name: req.user.firstName, tasks: user.tasks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

router.get('/addTask', async (req, res) => {
  try {
      const userModel = await userModel.find();
      res.render('home',{name:req.user.firstName}); 
      // res.json({ userModel });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});


router.post('/addTask', function(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(401).send('Unauthorized');
  }

  userModel.findById(req.user._id)
    .then(user => {
      if (!user) {
        return res.status(404).send('User not found');
      }

      // Add the new task to the tasks array
      user.tasks.push({
        description: req.body.task,
        dateAssigned: req.body.date
      });
      

      // Save the updated user document
      return user.save();
    })
    .then(() => {
      res.redirect('/profile');
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error saving task');
    });
});

router.post('/deleteTask', function(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(401).send('Unauthorized');
  }

  userModel.findById(req.user._id)
    .then(user => {
      if (!user) {
        return res.status(404).send('User not found');
      }

      // Find the index of the task to be deleted
      const index = user.tasks.findIndex(task => task._id.toString() === req.body.taskId);

      if (index === -1) {
        return res.status(404).send('Task not found');
      }

      // Remove the task from the tasks array
      user.tasks.splice(index, 1);

      // Save the updated user document
      return user.save();
    })
    .then(() => {
      res.redirect('/profile');
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error deleting task');
    });
});

router.post('/editTask', function(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(401).send('Unauthorized');
  }

  userModel.findById(req.user._id)
    .then(user => {
      if (!user) {
        return res.status(404).send('User not found');
      }

      // Find the task to be edited
      const task = user.tasks.find(task => task._id.toString() === req.body.taskId);

      if (!task) {
        return res.status(404).send('Task not found');
      }

      // Update the task's description or date
      if (req.body.description) {
        task.description = req.body.description;
      }

      if (req.body.date) {
        task.dateAssigned = req.body.date;
      }

      // Save the updated user document
      return user.save();
    })
    .then(() => {
      res.redirect('/profile');
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error editing task');
    });
});


function isLoggedIn(req,res,next){
  if(req.isAuthenticated())
    return next();
  res.redirect('/'); 
}
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/login',function(req,res){
  res.render('login');
})

router.post('/login',passport.authenticate('local',{
  successRedirect: "/profile",
  failureRedirect: "/login"
}), function(req,res){})

router.get('/logout',function(req,res,next){
  req.logOut(function(err){
    if(err) return next(err);
    res.redirect('/');
  })
})
module.exports = router;
