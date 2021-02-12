// Importing Node Libraries
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//Imports the mongoose module
var mongoose = require('mongoose');

// Importing modules from routes directory
var indexRouter = require('./routes/index');
var blogsRouter = require('./routes/blogs');

// creating app object using imported express
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// adding middleware libraries into request handling chain
app.use(logger('dev')); //  :method :url :status :response-time ms - :res[content-length]
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // parses urlencoded bodies
app.use(cookieParser());

/* use the express.static middleware to get Express to serve all the static files in the /public directory in the project root. */
app.use(express.static(path.join(__dirname, 'public')));

//Set up default mongoose connection
mongoose
	.connect('mongodb://localhost/blog', {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	})
	.then((obj) =>
		console.log('Connected to ' + obj.connection.name + ' DB successfully')
	)
	.catch(console.error);

// Adding route-handling
app.use('/', indexRouter);
app.use('/blogs', blogsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app; // allows it to be imported by /bin/www
