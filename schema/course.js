var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var courseSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    required: false,
    default: new Date()
  },
  updatedAt: {
    type: Date,
    required: false,
    default: new Date()
  },
  deletedAt: {
    type: Date,
    required: false,
    default: null
  }
});

var Course = mongoose.model("Course", courseSchema);

module.exports = Course;
