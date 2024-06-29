import PostModel from '../models/Post.js';

export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec();

        const tags = posts
            .map((obj) => obj.tags)
            .flat()
            .slice(0, 5);

        res.json(tags);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось получить статьи",
        });
    }
}

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate({path:'user', select:['fullName','avatarURL']}).exec();
        posts.reverse()
        res.json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось получить статьи",
        });
    }
}

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;
        const updatedDoc = await PostModel.findOneAndUpdate(
            { _id: postId },
            { $inc: { viewsCount: 1 } },
            { returnDocument: 'after' }
        );
        
        const populatedDoc = await PostModel.populate(updatedDoc, {path:'user', select:['fullName','avatarURL']});

        res.json(populatedDoc);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось вернуть статью",
        });
    }

    // try {
    //     const postId = req.params.id;

    //     PostModel.findOneAndUpdate(
    //     { _id: postId },
    //     { $inc: { viewsCount: 1 } },
    //     { returnDocument: 'after' })
    //     .then(doc => {
    //         return PostModel.populate(doc, { path: 'user' });
    //     })
    //     .then(populatedDoc => {
    //         res.json(populatedDoc);
    //     })
    //     .catch(err => res.status(500).json({
    //         message: 'Не удалось вернуть статью',
    //     }));

        //
        
        // PostModel.findOneAndUpdate(
        //     {
        //         _id: postId,
        //     }, 
        //     {
        //         $inc: { viewsCount: 1 },
        //     },
        //     {
        //         returnDocument: 'after',
        //     },
        //     (err, doc) => {
        //         if (err) {
        //             console.log(err);
        //             return res.status(500).json({
        //                 message: 'Не удалось вернуть статью',
        //             });
        //         }

        //         if (!doc) {
        //             return res.status(404).json({
        //                 message: 'Статья не найдена',
        //             });
        //         }

        //         res.json(doc);
        //     },
        // );

    // } catch (err) {
    //     console.log(err);
    //     res.status(500).json({
    //         message: "Не удалось создать статью",
    //     });
    // }
}

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;

        PostModel.findOneAndDelete(
            { _id: postId },
            { $inc: { viewsCount: 0 } },
            { returnDocument: 'after' })
            .then(doc => res.json(doc))
            .catch(err => res.status(500).json({
                message: 'Не удалось удалить статью',
            }));

        // PostModel.findOneAndDelete(
        //     {
        //         _id: postId,
        //     }, 
        //     (err, doc) => {
        //         if (err) {
        //             console.log(err);
        //             return res.status(500).json({
        //             message: 'Не удалось удалить статью',
        //             });
        //         }

        //         if (!doc) {
        //             return res.status(404).json({
        //                 message: 'Статья не найдена',
        //             });
        //         }

        //         res.json({
        //             success: true,
        //         })
        //     },
        // );

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось удалить статью",
        });
    }
}

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageURL: req.body.imageUrl,
            tags: req.body.tags.split(' '),
            user: req.userId,
        });

        const post = await doc.save();

        res.json(post); 
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось создать статью",
        });
    }
}

export const update = async (req, res) => {
    try {
        const postId = req.params.id;

        PostModel.findOneAndUpdate(
            { _id: postId },
            { 
                $set: {
                    title: req.body.title,
                    text: req.body.text,
                    imageURL: req.body.imageUrl,
                    tags: req.body.tags.split(' '),
                    user: req.userId,
                }
            },
            { new: true }) // Применяем опцию { new: true } чтобы вернуть обновленный документ
            .then(doc => {
                if (!doc) {
                    return res.status(404).json({
                        message: 'Статья не найдена',
                    });
                }
                res.json(doc);
            })
            .catch(err => res.status(500).json({
                message: 'Не удалось обновить статью',
            }));

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось обновить статью',
        });
    }
}