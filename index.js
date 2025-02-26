const express = require('express');
const path = require('path');
const app = express();
const userRoute= require('./routes/user');
const blogRoute= require("./routes/blog")
const mongoose = require('mongoose');
const Blog = require('./models/blog');
const {checkForAuthenticationCookie} = require('./midlewares/authentication')
const cookieParser = require('cookie-parser');

const port = 8000;



// Connect to MongoDB

mongoose.connect('mongodb://localhost:27017/Blogify'
 ).then(() => {
    console.log('Connected to MongoDB');
 }) ;

 app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));




app.use(express.urlencoded({extended: false}));
app.use('/user', userRoute);


app.use(cookieParser ());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve('./public')))


app.use('/blog', blogRoute);

app.get('/',async  (req, res) => {
  const allBlogs = await Blog.find({});
  console.log('req user',req.user);
    res.render('home',{

      user : req.user,
      blogs:allBlogs,
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
