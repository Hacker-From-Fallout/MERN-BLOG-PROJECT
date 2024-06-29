import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import User from '../models/User.js'
import UserModel from "../models/User.js";

export const register = async (req, res) => {
    try {
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarURL: req.body.avatarUrl,
            passwordHash: hash,
        });

        const user = await doc.save();

        const token = jwt.sign(
            {
                _id: user._id,
            },
            'secret123',
            {
                expiresIn: '30d',
            }
        );

        const { passwordHash, email, ...userData } = user._doc;

        res.json({
            ...userData,
            token,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось зарегистрироваться",
        });
    }
};

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({
                message: "Пользователь не найден",
            });
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if (!isValidPass) {
            return res.status(400).json({
                message: "Неверный логин или пароль",
            });
        }

        const token = jwt.sign(
            {
                _id: user._id,
            },
            'secret123',
            {
                expiresIn: '30d',
            }
        );

        const { passwordHash, email, ...userData } = user._doc;

        res.json({
            ... userData,
            token,
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось авторизоваться",
        });
    }
};

export const update = async (req, res) => {
    try {
        const userId = req.params.id;

        UserModel.findOneAndUpdate(
            { _id: userId },
            { 
                $set: { avatarURL: req.body.avatarUrl }
            },
            { new: true }) // Применяем опцию { new: true } чтобы вернуть обновленный документ
            .then(user => {
                if (!user) {
                    return res.status(404).json({
                        message: 'Пользователь не найден',
                    });
                }
                
                const { passwordHash, email, ...userData } = user._doc;

                res.json(userData);
            })
            .catch(err => res.status(500).json({
                message: 'Не удалось обновить аккаунт',
            }));

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось обновить аккаунт',
        });
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден'
            });
        }

        const { passwordHash, email, ...userData } = user._doc;

        res.json(userData);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Нет доступа",
        });
    }
};
