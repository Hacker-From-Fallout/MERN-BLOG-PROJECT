import mongoose from "mongoose";

const ChildCommentSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    postId: {
        type: String,
        required: true,
    },
    commentParentId: {
        type: String,
        required: true,
    },
    answerFor: {
        type: String,
        required: true,
    },
    avatarURL: String,
    createdAt: Date,
}, {
    _id: true,
});

const CommentSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    postId: {
        type: String,
        required: true,
    },
    avatarURL: String,
    children: [ChildCommentSchema],
}, {
    timestamps: true,
});

// Удаление уникального индекса
CommentSchema.index({'children.text': 1}, {unique: false});

export default mongoose.model('Comment', CommentSchema);