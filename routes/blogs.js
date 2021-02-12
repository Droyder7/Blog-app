var express = require('express');
var router = express.Router();

// Require controller modules.
var blog_controller = require('../controllers/blogController');

/* GET blogs page. */
router.get('/', blog_controller.index);

// GET request for creating a Blog. NOTE This must come before routes that display Blog (uses id).
router.get('/create', blog_controller.blog_create_get);

// POST request for creating Blog.
router.post('/create', blog_controller.blog_create_post);

// POST request to delete blog
router.post('/:id/delete', blog_controller.blog_delete_post);

// Blog edit page route.
router.get('/:id/edit', blog_controller.blog_update_get);

// POST request to edit blog
router.post('/:id/edit', blog_controller.blog_update_post);

// Blog detail page route.
router.get('/:id', blog_controller.blog_detail);

module.exports = router;
