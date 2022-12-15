const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const { redirect, render } = require('express/lib/response');
const Blog = require('./models/blogSchema');
const bodyParser = require("body-parser");

const app = express();


const port = process.env.PORT || 5000;


//connect to mongoDB
const mongoURI = 'mongodb+srv://kusum:test123@blog-database.gjjel.mongodb.net/blog-database?retryWrites=true&w=majority';
mongoose.connect(mongoURI, {useNewUrlParser: true , useUnifiedTopology: true })
// .then((result) => console.log('connected to db'))
.then((result)=> app.listen(port, () => {
    console.log('server is running on port 5000')
}))
.catch((err) => console.log(err));

//register view engine
//bye default view engine looks into views folder
app.set('view engine', 'ejs');

app.set('views', 'myViews'); //if have to change view folder from views to other

//Third party console middleware
app.use(bodyParser.urlencoded({extended: true})); //to enclude req.body thing
app.use(express.urlencoded({extended: true})); //to get requested data eg. req.body
app.use(morgan('dev'));

//middleware & static files
app.use(express.static('public')); // this will allow to access files(.html) available in public folder on browser.

//get & save data mongo
app.get('/get-data', (req,res) => {
    const blog = new Blog({
        title: "My Blog 2",
        snippet: "view full content of my Blog",
        body: "This blog is for public awareness"
    });
    blog.save()
    .then((data) => {
     res.send(data);
    })
    .catch((err) => {
        console.log(err);
    })
});

app.get('/all-blog', (req,res) => {
    Blog.find()
    .then((data) => {
        res.send(data);
    })
    .catch(err => {
        console.log(err)
    })
});

app.get('/single-blog', (req,res) => {
    Blog.findById('6261f829dda611ee3ccbee7b')
    .then((data) => {
        res.send(data);
    })
    .catch(err => {
        console.log(err)
    })
});

//blog route from view
app.get('/blogs', (req, res) => {
    Blog.find().sort({createdAt: -1})
    .then((data) => {
        res.render('index', {title: 'ALl Blogs', blogs:data}) //rendering view i.e index.ejs
    })
    .catch(err => console.log(err))
});

//post
app.post('/blogs', (req,res) => {  //route should same as action of form
console.log(req.body);
const blog = new Blog({
    title: req.body.title,
    snippet: req.body.snippet,
    body: req.body.body
});

blog.save()
.then((data) => {
res.redirect('/blogs');
})
.catch(err => console.log(err))
});

app.get('blogs/:id', (req,res) => {
    const id = req.params.id;
console.log(id);

Blog.findById(id)
.then(data => {
    res.render('details', {blog: data, title:'Blog Details'})
    .catch(err => console.log(err))
})
})

// //Custom console log middleware
// app.use((req, res, next) => {      // as this middleware written at top, will execute for each function
//     console.log('Request made');
//     console.log('host:', req.hostname);
//     console.log("path:", req.path);
//     console.log("method:", req.method)
//     next();       // next() call to resolve loading issue, now it will execute properly.
// });


// //to use another middleware next() is mandatory.
// app.use((req,res,next) => {
//     console.log('in next middleware');
//     next(); 
// })


//rendering from view engine
app.get('/', (req, res) => {
    const blogs = [
        {title: 'Yoshi finds eggs', snippet: 'Lorem ipsum dolor sit amet consectetur'},
        {title: 'Mario finds stars', snippet: 'Lorem ipsum dolor sit amet consectetur'},
        {title: 'How to defeat bowser', snippet: 'Lorem ipsum dolor sit amet consectetur'},
      ];
    res.render('index', {title: 'Home', blogs});
})

app.get('/about', (req, res) => {
    res.render('about', {title: 'About'})
});

app.get('/about-me' , (res, req) => {
    res.redirect('/about')
});

app.get('/create', (req, res) => {
    res.render('create', {title: 'Create'})
});

app.use((req, res) => {
res.status(404).render('404', {title: '404'})
})


// app.get('/', (req, res) => {
//     res.sendFile('./views/index.html', {root: __dirname});
// });


// app.get('/about', (req, res) => {
//     res.sendFile('./views/about.html', {root: __dirname}); //here EXPRESS is root directory 
// });

//redirect
// app.get('/about-me' , (res, req) => {
//     res.redirect('/about')
// });

//404 page
// app.use((req, res) => {
//     res.status(404).sendFile('./views/404.html', {root: __dirname});
// })

