const mongoose = require('mongoose');

const { Schema } = mongoose;

const PostLikesSchema = new Schema(
  {
    post: { type: Schema.Types.ObjectId, required: true },
    user: { type: Schema.Types.ObjectId, required: true },
    created: { type: Date, required: true },
  },
);

// Export model
module.exports = mongoose.model('PostLikes', PostLikesSchema);
