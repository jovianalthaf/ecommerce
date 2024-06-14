import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";
import jwt from 'jsonwebtoken';
import { generateToken } from "../middleware/AuthUser.js"
const prisma = new PrismaClient();


export const getUser = async (req, res) => {
    try {
        const response = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                role: true,
                email: true,
            }
        });

        res.status(200).json(response);
    } catch (error) {
        res.status(500).msg({ msg: error.message })
    }
}

export const getUserById = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.params.id
            },
            select: {
                id: true,
                name: true,
                role: true,
                email: true
            }
        });

        if (!user) {
            return res.status(404).json({ msg: "User not found", });
        }

        res.status(200).json({ data: user });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const createUser = async (req, res) => {
    const { name, password, confPassword, email, role } = req.body;

    if (password != confPassword) return res.status(400).json({ msg: error.message });
    const hashPassword = await argon2.hash(password);
    try {
        // check if email already exists 
        const existingUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        if (existingUser) {
            return res.status(400).json({ msg: "Email already exists" })
        }

        const user = await prisma.user.create({
            data: {
                name: name,
                password: hashPassword,
                role: role,
                email: email
            }
        });
        res.status(201).json({ msg: "Register successfuly" });
    } catch (error) {
        res.status(404).json({ msg: error.message });
    }
}






export const updateUser = async (req, res) => {
    // CARI USER ID
    const user = await prisma.user.findUnique({
        where: {
            id: req.params.id
        },
    });
    // VALIDASI
    if (!user) {
        return res.status(404).json({ msg: "User not found" })
    }
    // req body
    const { name, password, confPassword, email, role } = req.body;
    let hashPassword;
    // VALIDATION PASSWORD
    if (password === "" || password === null) {
        hashPassword = user.password
    } else {
        hashPassword = await argon2.hash(password);
    }

    // PASSWORD CONFIRMATION VALIDATION
    if (password !== confPassword) return res.status(400).json({ msg: "Password and confirm password is wrong" })
    try {
        // update user
        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                name: name,
                email: email,
                password: hashPassword,
                role: role
            }
        });
        res.status(202).json({ msg: "User updated " });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}

export const deleteUser = async (req, res) => {
    const userId = req.params.id;
    try {
        const response = await prisma.user.delete({
            where: {
                id: userId
            }
        });
        if (!user) {
            return req.status(404).json({ msg: "User tidak ditemukan" });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}