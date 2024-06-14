import express from "express";
import { LoginAdmin, adminOnly } from "../middleware/AuthAdmin.js";
import { verifyUser } from "../middleware/AuthUser.js";
import {
    getProduct,
    getProductById,
    updateProduct,
    createProduct,
    deleteProduct,

} from "../Controllers/ProductController.js";


const router = express.Router();
router.post('/admin', adminOnly, LoginAdmin);


router.get('/admin/products', verifyUser, adminOnly, getProduct);
router.get('/admin/products/:id', verifyUser, adminOnly, getProductById);
router.post('/admin/products/create', verifyUser, adminOnly, createProduct);
router.patch('/admin/products/update', verifyUser, adminOnly, updateProduct);
router.delete('/admin/products/:id', verifyUser, adminOnly, deleteProduct);


// router.get('/admin')

export default router;