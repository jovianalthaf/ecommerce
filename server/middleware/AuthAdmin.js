import jwt from "jsonwebtoken";
import express from "express";
import argon2 from "argon2";
import { PrismaClient } from "@prisma/client";
import { generateToken } from "./AuthUser.js";
const prisma = new PrismaClient();


export const adminOnly = async (req, res, next) => {
    const user = await prisma.user.findUnique({
        where: {
            id: req.session.userId
        },
    });
    if (!user) return res.status(404).json({ msg: "User not found" });
    if (user.role !== "Admin") return res.status(403).json({ msg: "This access admin only" });
    next();
}

export const LoginAdmin = async (req, res, next) => {
    const { email, password } = req.body;
    // const userId = req.session.userId

    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        if (!user) {
            return res.status(403).json({ msg: "User with existing account cannot login as admin" });
        }

        if (!user.password) {
            return res.status(403).json({ msg: "User with existing account cannot login as admin" });
        }
        // if (!user.role === "Admin") return res.status(403).json({
        //     msg: "Akses dilarang"
        // });

        const validPassword = await argon2.verify(user.password, password);
        if (!validPassword) return res.status(400).json({ msg: "Invalid password" });
        req.session.userId = user.id;
        const token = generateToken(user);
        res.status(200).json({
            msg: "Login successfull as Admin",
            token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        })

    } catch (error) {
        res.status(500).json({ msg: error.message });
    }



}