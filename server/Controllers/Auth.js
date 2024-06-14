import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";
import jwt from 'jsonwebtoken';
import { generateToken } from "../middleware/AuthUser.js";
const prisma = new PrismaClient();

export const Login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if (!user) return res.status(404).json({ msg: "User not found" });
        const validPassword = await argon2.verify(user.password, password);
        if (!validPassword) return res.status(400).json({ msg: "Invalid Password" });
        req.session.userId = user.id;


        const token = generateToken(user);

        res.status(200).json({
            msg: "Login successfull",
            token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }

}

export const Me = async (req, res) => {
    if (!req.session.userId) {
        return res.status(404).json({ msg: "Login your account first" });
    }
    const user = await prisma.user.findUnique({
        where: {
            id: req.session.userId
        },
        select: {
            name: true,
            email: true,
            role: true
        }
    });
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.status(200).json(user);
};


export const Logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(400).json({ msg: "Tidak dapat logout" });
        res.status(200).json({ msg: "Anda telah logout" });
    })
}