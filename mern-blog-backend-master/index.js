import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import fs from "fs";

import { registerValidation, loginValidation, postCreateValidation, commentCreateValidation } from "./validations.js";

import { checkAuth, handleValidationErrors } from "./utils/index.js";

import { PostController, UserController, CommentController } from './controllers/index.js';

mongoose
    .connect("mongodb+srv://admin:WWWWWW@cluster0.xqh26hj.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("DB OK"))
    .catch(() => console.log("DB error", err));


const app = express();

const folderPath = 'uploadsUser';
if (!fs.existsSync(folderPath)) {
    // Если папка не существует, создаем ее
    fs.mkdirSync(folderPath);
    console.log('Директория uploadsUser создана успешно.');
} 

const storage = multer.diskStorage({
    destination: (_, __, cd) => {
        cd(null, 'uploads');
    },
    filename: (_, file, cd) => {
        cd(null, file.originalname);
    },
});

const storageUser = multer.diskStorage({
    destination: (_, __, cd) => {
        cd(null, 'uploadsUser'); // папка для загрузки в uploadsUser
    },
    filename: (_, file, cd) => {
        cd(null, file.originalname);
    },
});

const upload = multer({ storage: storage });
const uploadUser = multer({ storage: storageUser });

app.use(express.json());
app.use(cors());

app.use('/uploads', express.static('uploads'));
app.use('/uploadsUser', express.static('uploadsUser'));

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.patch('/setting/:id', handleValidationErrors, UserController.update);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

app.post('/uploadUser', uploadUser.single('image'), (req, res) => {
    res.json({
        url: `/uploadsUser/${req.file.originalname}`,
    });
});

app.get('/tags', PostController.getLastTags);

app.get('/posts', PostController.getAll);
app.get('/posts/tags', PostController.getLastTags);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);

app.post('/posts/:id/comments', checkAuth, commentCreateValidation, handleValidationErrors, CommentController.create);
app.patch('/posts/:id/comments', checkAuth, commentCreateValidation, handleValidationErrors, CommentController.update);
app.put('/posts/:id/comments', checkAuth, CommentController.remove);
app.get('/comments', CommentController.getAll);

app.listen(8000, (err) => {
    if (err) {
        return console.log(err);
    } 

    console.log("Server OK");
});