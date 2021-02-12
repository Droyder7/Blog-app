const mongoose = require('mongoose');
const Blog = require('../models/blog');
const { body, validationResult } = require('express-validator');

var blog_list = function (req, res, next) {
	Blog.find({}).exec(function (err, list_blogs) {
		if (err) return next(err);
		//Successful, so render
		res.render('blogs', { title: 'All Blogs', blogs: list_blogs });
	});
};

/* BLOG ROUTES */

// Index page to Display all Blogs.
exports.index = blog_list;

// Display detail page for a specific Blog.
exports.blog_detail = function (req, res, next) {
	var id = mongoose.Types.ObjectId(req.params.id); //  converting the id to a type that can be used
	Blog.findById(id).exec(function (err, foundBlog) {
		if (err) return next(err);
		//Successful, so render
		res.render('blog_detail', { blog: foundBlog });
	});
};

// Display blog create form page on GET.
exports.blog_create_get = function (req, res, next) {
	res.render('blog_form', { title: 'Create Blog', blog: null, errors: null });
};

// Handle blog create on POST.
exports.blog_create_post = [
	// Validate and sanitize fields.
	body('title', 'Title must not be empty.')
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body('body', 'Body must not be empty.').trim().isLength({ min: 1 }).escape(),

	// Process request after validation and sanitization.
	(req, res, next) => {
		// Extract the validation errors from a request.
		const errors = validationResult(req);

		// Create a Book object with escaped and trimmed data.
		var newBlog = new Blog({
			title: req.body.title,
			image: req.body.image,
			body: req.body.body,
		});

		if (!errors.isEmpty()) {
			// There are errors. Render form again with sanitized values/error messages.
			res.render('blog_form', {
				title: 'Create Blog',
				blog: newBlog,
				errors: errors.array(),
			});

			return;
		} else {
			// Data from form is valid. Save the new Blog.
			newBlog.save(function (err) {
				if (err) return next(err);
				//successful - redirect to new book record.
				res.redirect(newBlog.url);
			});
		}
	},
];

/* function (req, res) {
    Blog.create(req.body.blog, function (err, newBlog) {
        if (err) {
            console.log("Error!!!");
            res.render("new");
        } else {
            alert("New Blog Created Successfully");
            res.redirect("/blogs");
        }
        console.log(newBlog);
    });
}; */

// Display blog update form on GET.
exports.blog_update_get = (req, res, next) => {
	Blog.findById(req.params.id, (err, foundBlog) => {
		if (err) return next(err);
		res.render('blog_form', {
			title: 'Update Blog',
			blog: foundBlog,
			errors: null,
		});
	});
};

// Handle blog update on POST.
exports.blog_update_post = [
	// Validate and sanitize fields.
	body('title', 'Title must not be empty.')
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body('body', 'Body must not be empty.').trim().isLength({ min: 1 }).escape(),

	// Process request after validation and sanitization.
	(req, res, next) => {
		// Extract the validation errors from a request.
		const errors = validationResult(req);

		// Create a Book object with escaped and trimmed data.
		var newBlog = new Blog({
			title: req.body.title,
			image: req.body.image,
			body: req.body.body,
			_id: req.params.id, //This is required, or a new ID will be assigned!
		});

		if (!errors.isEmpty()) {
			// There are errors. Render form again with sanitized values/error messages.
			res.render('blog_form', {
				title: 'Update Blog',
				blog: newBlog,
				errors: errors.array(),
			});

			return;
		} else {
			// Data from form is valid. update the new Blog.
			Blog.findByIdAndUpdate(req.params.id, newBlog, (err, updatedBlog) => {
				if (err) return next(err);
				res.redirect(updatedBlog.url);
			});
		}
	},
];

// Display blog delete form on GET.
exports.blog_delete_get = function (req, res) {
	res.send('NOT IMPLEMENTED: blog delete GET');
};

// Handle blog delete on POST.
exports.blog_delete_post = function (req, res, next) {
	Blog.findByIdAndDelete(req.params.id, function (err) {
		if (err) return next(err);
		res.redirect('/blogs');
	});
};
