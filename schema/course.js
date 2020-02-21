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
    default:
      "https://scontent.fbkk11-1.fna.fbcdn.net/v/t1.0-9/81010712_1537897206348331_1467944127269175296_o.jpg?_nc_cat=111&_nc_eui2=AeFIzILn-w1tB92mNhX-Z7t60nd6LEN-UCGVzt_2zkaCZE2QnZuJO_1xBLLItvyLD8gvQLoY9r6_pD23ymAjJLAUOtkT9k-J_rFRgABBkZd_aA&_nc_oc=AQngsq-H124ENPZK7JPyu5IpY5h9jNSra0nFJH6HK5RQQAnxNaRZtmbkS9X0dxyLeoQ&_nc_ht=scontent.fbkk11-1.fna&oh=941b32d57685b10fea9c5ecacba95223&oe=5EFC7381"
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
