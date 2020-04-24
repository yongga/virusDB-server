// var mongoose = require('mongoose');
// var schema = mongoose.Schema;

// var citationSchema = new schema({
//     author: { type: String, required: true },
//     pub_year: { type: String },
// },
//     { timestamps: true },
//     { toObject: {
//         transform: function (doc, ret) {
//             delete ret._id;
//         }
//     },
//     toJSON: {
//         transform: function (doc, ret) {
//             delete ret._id;
//         }
//     },
// });

// // export Citation.js as a user db model
//   // 1st arg: explicit virus model name
//   // 3rd arg: explicit collection title
//   module.exports = mongoose.model('Citation', citationSchema, 'citation');