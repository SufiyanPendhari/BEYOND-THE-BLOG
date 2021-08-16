const app = require('express')
const router =app.Router()
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../model/dataSchema')
const Blog = require('../model/blogData')

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

router.get('/',ensureAuthenticated,(req,res)=>{
    res.render('blog')
})
// Login page
router.get('/login',forwardAuthenticated,(req,res)=>{
    res.render('login',)
})
// Register Page
router.get('/register',forwardAuthenticated,(req,res)=>{
    res.render('resgiter')
})
//  Register 
router.post('/register',(req,res)=>{
    const { username, password, repassword } = req.body;
    let errors = [];

  if (!username || !password || !repassword) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != repassword) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  } 

  if (errors.length > 0) {
    res.render('resgiter', {
      errors,
      username,
      password,
      repassword
    });
  } else {
    User.findOne({ username: username }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('resgiter', {
          errors,
          username,
          password,
          repassword
        });
      } else {
        const newUser = new User({
          username,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
    console.log(req.body)
    
})
// Login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/blog',
      failureRedirect: '/login',
      failureFlash: true
    })(req, res, next);
  });
  
  // Logout
  router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
  });
//   dashboard
  router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    user: req.user
  })
);
// Blog page
router.get('/blog',ensureAuthenticated,(req,res)=>{
 
   Blog.find().then((data)=>{
   const value = data
    res.render('blog',{data:value})
    
   })
  
})
// one blog post
router.get('/blog/:id',ensureAuthenticated,(req,res)=>{
  Blog.findById(req.params.id).then((data)=>{
    res.render('blogMainPage',{data})
    })
})

// Delete Blog
router.get('/delete/:id',ensureAuthenticated,(req,res)=>{
  Blog.findByIdAndDelete(req.params.id).then((data)=>{
    res.redirect('/blog')
    })
})

// Create a Blog
router.get('/create',ensureAuthenticated,(req,res)=>{
  res.render('create')
})
router.post('/create',ensureAuthenticated,(req,res)=>{
  const newPost = new Blog({
    uniqueId:req.user.id,
    title:req.body.title,
    descript:req.body.descript,
    body:req.body.body,
  })
  newPost.save()
  // console.log(req.body)
  res.render('blog')
})
router.use((req,res)=>{
  res.send('not found')
})
module.exports = router