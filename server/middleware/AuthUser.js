import jwt from "jsonwebtoken";


import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
// generate token jwt
export const generateToken = (user) => {
    return jwt.sign({ id: user.id, name: user.name, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

export const authToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ msg: "Access denied, no token provided" });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ msg: "Access denied, no token provided" });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ msg: "Invalid token" });
    }
};

export const verifyUser = async (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ msg: "Mohon login ke akun anda" });
    }
    const user = await prisma.user.findUnique({
        where: {
            id: req.session.userId
        }
    });
    if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
    req.userId = user.id;
    req.role = user.role;
    next();

}

