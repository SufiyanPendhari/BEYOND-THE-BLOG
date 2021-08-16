const { urlencoded } = require('express');
const express = require('express')
const path = require('Path')
const mongoose =require('mongoose')
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
// Passport Config
require('./config/passport')(passport);
mongoose.connect('mongodb://localhost/Blogs',{ useNewUrlParser: true ,  useUnifiedTopology: true})

.then(()=>console.log('Database Connected'))

const app = express()
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );
  
  // Passport middleware
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Connect flash
  app.use(flash());
  
  // Global variables
  app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });
app.set('view engine','ejs')
app.use(express.static('public'));
app.use(urlencoded({extended:true}))

app.use('/',require('./routes/blogRoutes'))
app.listen(3000,()=>{
    console.log(`Server Started on ${3000}`)
})




function para(s) {
  var vasl =[]
  for (let i = 1; i <= s; i++) {
    vasl.push(i);
  }
 let value= vasl.reduce((acc,curr)=>acc*=curr,1);
return value
}
console.log(para(7));