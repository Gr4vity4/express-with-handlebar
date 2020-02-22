var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var courseSchema = new Schema({
  id: {
    type: Number,
    required: true
  },
  slug: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: false,
    default:
      "https://storage.googleapis.com/io-19-assets/images/global/io-social-banner.png"
  },
  price: {
    type: Number,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  author_image: {
    type: String,
    required: false,
    default: "https://image.flaticon.com/icons/svg/1587/1587565.svg"
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
