import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProduct = async (req, res) => {
    try {
        // gunakan include untuk menambahkan model category dan color
        const response = await prisma.product.findMany();
        // Membuat respons yang berisi data produk dengan nama kategori dan warna
        // const productsWithCategoryAndColorName = response.map(product => ({
        //     name: product.name,
        //     description: product.description,
        //     image: product.image,
        //     price: product.price,
        //     height: product.height,
        //     weight: product.weight,
        //     width: product.width,
        //     warranty: product.warranty,
        //     quantity: product.quantity,
        //     category: product.category.name, // Mengambil nama kategori
        //     color: product.color.name // Mengambil nama warna
        // }));

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}
export const getProductById = async (req, res) => {
    try {
        const product = await prisma.product.findUnique({

            where: {
                id: Number(req.params.id)
            },
            select: {
                name: true,
                price: true,
                image: true,
                weight: true,
                width: true,
                height: true,
                quantity: true,
            },
        });
        if (!product) {
            res.status(404).json({ msg: "Product Not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}
export const createProduct = async (req, res) => {
    const { name, description, image, price, height, weight, width, warranty, quantity, color_id, category_id } = req.body;
    try {
        const product = await prisma.product.create({
            data: {
                name: name,
                description: description,
                image: image,
                price: price,
                height: height,
                weight: weight,
                width: width,
                warranty: warranty,
                quantity: quantity,
                category: {
                    connect: { id: category_id }
                },
                color: {
                    connect: { id: color_id }
                },
            },
        });
        res.status(200).json({ message: "Product successfully created", product });
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}
export const updateProduct = async (req, res) => {
    try {
        const response = await prisma.product.findMany();
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}
export const deleteProduct = async (req, res) => {
    const productId = req.params.id;
    try {
        const product = await prisma.product.findUnique({
            where: {
                id: Number(productId)
            }
        });
        if (!product) return res.status(404).json({ msg: "Product not found" })
        const { name, description, image, price, height, weight, width, warranty, quantity, category_id, color_id } = req.body;

        await prisma.product.delete({
            where: {
                id: Number(productId)
            }
        })
        res.status(200).json({ message: "Product deleted" });
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}
