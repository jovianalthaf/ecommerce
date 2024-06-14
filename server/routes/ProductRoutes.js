import express from "express";
import {
    getProduct,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../Controllers/ProductController.js"

import { authToken, verifyUser } from "../middleware/AuthUser.js"
import { adminOnly } from "../middleware/AuthAdmin.js";

const router = express.Router();


router.get('/products', authToken, getProduct);
router.get('/products/:id', verifyUser, authToken, getProductById);
router.post('/products', verifyUser, authToken, adminOnly, createProduct);
router.patch('/products/:id', verifyUser, authToken, updateProduct);
router.delete('/products/:id', verifyUser, authToken, deleteProduct);

export default router;