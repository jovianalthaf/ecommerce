import express from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import ProductRoute from './routes/ProductRoutes.js';
import UserRoute from './routes/UserRoutes.js';
import AuthRoute from "./routes/AuthRoute.js";
import AdminRoute from "./routes/AdminRoute.js";
import { PrismaClient } from '@prisma/client';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

// Buat session store menggunakan Prisma
const store = new PrismaSessionStore(
    prisma,
    {
        checkPeriod: 2 * 60 * 1000,  // interval untuk memeriksa dan membersihkan sesi yang kedaluwarsa (2 menit)
        dbRecordIdIsSessionId: true,  // menggunakan ID sesi sebagai ID rekaman di database
        dbRecordIdFunction: undefined  // fungsi untuk menghasilkan ID sesi, jika diperlukan
    }
);

app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        secure: process.env.NODE_ENV === 'production',  // set secure cookie jika dalam mode produksi
        maxAge: 24 * 60 * 60 * 1000  // cookie berlaku selama 1 hari
    },
}));

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));

app.use(express.json());
app.use(ProductRoute);
app.use(UserRoute);
app.use(AuthRoute);
app.use(AdminRoute);

app.listen(process.env.APP_PORT, () => {
    console.log(`Server up and running on port ${process.env.APP_PORT}`);
});
