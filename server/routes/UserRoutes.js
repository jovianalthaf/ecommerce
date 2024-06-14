import express from "express";
import {
    getUser,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
} from "../Controllers/UserController.js"
import { authToken, verifyUser } from "../middleware/AuthUser.js";
import { adminOnly } from "../middleware/AuthAdmin.js";

const router = express.Router();

// router.get('/register', verifyUser, authToken, createUser);

router.get('/users', verifyUser, adminOnly, authToken, getUser);
router.get('/users/:id', verifyUser, adminOnly, authToken, getUserById);
router.post('/users', createUser);
router.patch('/users/:id', verifyUser, authToken, updateUser);
router.delete('/users/:id', verifyUser, adminOnly, authToken, deleteUser);

export default router;