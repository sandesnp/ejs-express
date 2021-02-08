const express = require('express');
const mongoose = require('mongoose');
const _ = require('lodash');
const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//Declaration
const homeContent =
	'Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.';
const aboutContent =
	'Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.';
const contactContent =
	'Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.';

mongoose.connect(
	'mongodb+srv://admin-sandesh:adminsandesh@cluster0.b9kou.mongodb.net/ejsblog',
	{
		useUnifiedTopology: true,
		useFindAndModify: true,
		useNewUrlParser: true,
	}
);

const Blog = mongoose.model(
	'Blog',
	mongoose.Schema({
		title: {
			type: String,
			required: true,
			min: 2,
			max: 50,
		},
		content: {
			type: String,
			required: true,
			min: 2,
		},
	})
);

const posts = [];

// Home
app.get('/', function (req, res) {
	Blog.find(function (err, posts) {
		if (!err) {
			res.render('home', {
				heading: 'Hello, Sandesh',
				content: homeContent,
				posts: posts,
			});
		}
	});
});

// About
app.get('/about', function (req, res) {
	res.render('home', { heading: 'About', content: aboutContent, posts: [] });
});

// Contact
app.get('/contact', function (req, res) {
	res.render('home', {
		heading: 'Contact',
		content: contactContent,
		posts: [],
	});
});
// Compose Post
app.get('/compose', function (req, res) {
	res.render('compose');
});

app.post('/compose', function (req, res) {
	Blog.find(
		{ $text: { $search: req.body.title, $caseSensitive: false } },
		function (err, postValue) {
			if (postValue.length > 0) {
				res.render('home', {
					heading: 'Error',
					content: 'Posts with same title has already been created',
					posts: [],
				});
				//seems to continue so giving a return function
				return;
			}
			Blog.create({
				title: req.body.title,
				content: req.body.content,
			});
			res.redirect('/');
		}
	);
});

//Get Single Post
app.get('/posts/:title', function (req, res) {
	Blog.findOne(
		{
			$text: { $search: _.lowerCase(req.params.title), $caseSensitive: false },
		},
		function (err, postValue) {
			if (!err) {
				if (postValue.length === 0) {
					res.render('home', {
						heading: 'Error',
						content: 'Post not found',
						posts: [],
					});
					//seems to continue so giving a return function
					return;
				}
				res.render('home', {
					heading: postValue.title,
					content: postValue.content,
					posts: [],
				});
			}
		}
	);
});
let port = process.env.PORT;
if (port == null || port == '') {
	port = 3000;
}

app.listen(port, function () {
	console.log('Server started on port 3000');
});
