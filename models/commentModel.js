const mongoose = require('mongoose');

const { Schema } = mongoose;

const CommentSchema = new Schema(
  {
    post: { type: Schema.Types.ObjectId, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    created: { type: Date, required: true },
    content: { type: String, required: true, maxlength: 1000 },
  },
);

// Export model
module.exports = mongoose.model('Comments', CommentSchema);
