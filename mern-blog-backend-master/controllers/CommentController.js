import CommentModel from '../models/Сomment.js';
import PostModel from '../models/Post.js';

export const create = async (req, res) => {
    try {
        // Проверка на необходимые поля
        if (!req.body.text || !req.body.fullName) {
            return res.status(400).json({
                message: 'Текст и полное имя обязательны',
            });
        }

        const answer = req.body.answerFor;

        if (answer) {

            const commentParentId = req.body.commentParentId;
            if (!commentParentId) {
                return res.status(400).json({
                    message: 'commentParentId обязателен для дочерних комментариев',
                });
            }

            const newChildComment = {
                fullName: req.body.fullName,
                text: req.body.text,
                avatarURL: req.body.avatarUrl || "", // Даем дефолтное значение, если avatarUrl отсутствует
                postId: req.params.id,
                commentParentId: commentParentId,
                answerFor: answer,
                user: req.userId,
                createdAt: new Date(), // Добавляем текущее время создания
            };

            const postId = req.params.id;

            const updatedComment = await CommentModel.findOneAndUpdate(
                { _id: commentParentId },
                { $push: { children: { $each: [newChildComment] } } },
                { new: true }
            );

            if (!updatedComment) {
                return res.status(404).json({
                    message: 'Комментарий не найден',
                });
            }

            const updatedDoc = await PostModel.findOneAndUpdate(
                { _id: postId },
                { $inc: { commentsCount: 1 } },
                { returnDocument: 'after' }
            );

            const updatedDocPost = await PostModel.findOneAndUpdate(
                { _id: postId },
                { $inc: { viewsCount: -1 } },
                { returnDocument: 'after' }
            );

            if (!updatedDoc) {
                return res.status(404).json({
                    message: 'Пост не найден',
                });
            }

            const commentCount = await updatedDoc.commentsCount;

            const commentChild = {
                commentData: updatedComment,
                postData: {
                    commentCount,
                    updatedDocPost
                },
            };

            return res.json(commentChild);
        } else {
            const doc = new CommentModel({
                fullName: req.body.fullName,
                text: req.body.text,
                avatarURL: req.body.avatarUrl || "", // Даем дефолтное значение, если avatarUrl отсутствует
                postId: req.params.id,
                user: req.userId,
            });

            const commentData = await doc.save();

            const postId = req.params.id;

            const updatedDoc = await PostModel.findOneAndUpdate(
                { _id: postId },
                { $inc: { commentsCount: 1 } },
                { returnDocument: 'after' }
            );

            const updatedDocPost = await PostModel.findOneAndUpdate(
                { _id: postId },
                { $inc: { viewsCount: -1 } },
                { returnDocument: 'after' }
            );

            if (!updatedDoc) {
                return res.status(404).json({
                    message: 'Пост не найден',
                });
            }

            const commentCount = await updatedDoc.commentsCount;

            const comment = {
                commentData: commentData,
                postData: {
                    commentCount,
                    updatedDocPost
                },
            };

            return res.json(comment);
        }
    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({
            message: "Не удалось создать комментарий",
        });
    }
};

export const getAll = async (req, res) => {
    try {
        const comments = await CommentModel.find()
            .populate({ 
                path: 'user', 
                select: ['fullName', 'avatarURL'] 
            })
            .populate({ 
                path: 'children.user',
                select: ['fullName', 'avatarURL']
            })
            .exec();

        comments.reverse()
        
        res.json(comments);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось получить комментарии",
        });
    }
}

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;
        const commentParentId = req.body.commentParentId;
        const childCommentId = req.body.commentChildId; // Обратите внимание на исправление
        const commentIsChild = req.body.commentIsChild;

        if (commentIsChild) {
            const updatedComment = await CommentModel.findOneAndUpdate(
                { _id: commentParentId },
                { $pull: { children: { _id: childCommentId } } },
                { new: true }
            );

            const updatedDoc = await PostModel.findOneAndUpdate(
                { _id: postId },
                { $inc: { commentsCount: -1 } },
                { new: true }
            );

            const comment = {
                commentData: updatedComment,
                postData: {
                    commentCount: updatedDoc.commentsCount,
                },
            };

            return res.json(comment);
        } else {

            const comment = await CommentModel.findById(commentParentId);
            const childrenCount = comment.children.length;

            const updatedDoc = await PostModel.findOneAndUpdate(
                { _id: postId },
                { $inc: { commentsCount: -(1 + childrenCount)} },
                { new: true }
            );

            // Удаляем комментарий
            await CommentModel.findOneAndDelete({ _id: commentParentId });

            return res.json(updatedDoc);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось удалить комментарий",
        });
    }
}

export const update = async (req, res) => {
    try {
        const { commentParentId, commentChildId, text } = req.body;
        const postId = req.params.id;

        let updatedDoc;

        if (commentChildId) {
            // Обновляем дочерний комментарий

            updatedDoc = await CommentModel.findOneAndUpdate(
                { _id: commentParentId, 'children._id': commentChildId },
                { $set: { 'children.$.text': text } },
                { new: true }
            );
        } else {
            // Обновляем основной комментарий
            updatedDoc = await CommentModel.findOneAndUpdate(
                { _id: commentParentId },
                { $set: { text: text } },
                { new: true }
            );
        }

        if (!updatedDoc) {
            return res.status(404).json({
                message: 'Комментарий не найден',
            });
        }

        const updatedDocPost = await PostModel.findOneAndUpdate(
            { _id: postId },
            { $inc: { viewsCount: -1 } },
            { returnDocument: 'after' }
        );

        res.json(updatedDoc);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Не удалось обновить комментарий',
        });
    }
}
