import { Schema, model, Types } from 'mongoose';

export interface Product {
    name: string;
    price: number;
    weight: number;
    createdBy: Types.ObjectId;
}

const ProductSchema = new Schema<Product>({
    name: String,
    price: Number,
    weight: Number,
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

export default model('Product', ProductSchema);