var mongoose = require('mongoose');

//Define and store a schema
var BlogSchema = new mongoose.Schema({
  title: { type: String, default: "Blog Title" },
  image: { type: String, default: "default.jpg" },
  body: { type: String, default: "This is default Blog Body" },
  created: { type: Date, default: Date.now },
});

// Virtual for blog's URL
BlogSchema
.virtual('url')
.get(function () {
  return '/blogs/' + this._id;
});

//Export function to create "blog" model
module.exports = mongoose.model("blog", BlogSchema);