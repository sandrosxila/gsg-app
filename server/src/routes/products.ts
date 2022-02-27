import express from 'express';
import User from './../models/User';
import Product from '../models/Product';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { username, name, price, weight } = req.body;

        const user = await User.findOne({ username }).exec();

        if (!user) {
            return res.status(400).json({
                errors: [
                    {
                        message: "Couldn't find user with that username",
                    },
                ],
            });
        }

        const product = new Product({
            name,
            price,
            weight,
            createdBy: user._id,
        });

        product.save();

        res.status(201).json(product);
    } catch (error) {
        res.status(500).send({
            message: 'Something went wrong',
        });
    }

});

router.get('/:username', async (req, res) => {
    try {
        const { username } = req.params;

        const user = await User.findOne({ username }).exec();

        if (!user) {
            return res.status(400).json({
                errors: [
                    {
                        message: "Couldn't find user with that username",
                    },
                ],
            });
        }

        const products = await Product.find({ createdBy: user._id }).populate('createdBy').exec();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong',
        });
    }

});

router.get('/', async (req, res) => {
    try {
        const products = await Product.find().populate('createdBy', 'fullName username').exec();

        res.status(200).json({ products });
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong',
        });
    }

});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const newFields = req.body;
        await Product.updateOne({ _id: id }, newFields).exec();
        res.status(204).json({
            message: 'Product updated successfully',
        });
    }
    catch (e) {
        res.status(500).json({
            message: 'Something went wrong',
        });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Product.deleteOne({ _id: id }).exec();
        res.status(204).json({
            message: 'Product deleted successfully',
        });
    }
    catch (e) {
        res.status(500).json({
            message: 'Something went wrong',
        });
    }
});

export default router;