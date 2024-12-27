import mongoose, { Schema, model, models, Document } from "mongoose";
import { title } from "process";

export interface Image {
    src: string;
}

export interface Product { 
    id: number;
    title: string;
    price: string;
    images: { src: string }[];
    quantity: number;
    url?: string;
}

export interface IRegistry extends Document {
    firstName: string;
    lastName: string;
    partnerFirstName: string;
    partnerLastName: string;
    address: string;
    address2?: string;
    city: string;
    postalCode: string;
    deliveryDate: Date;
    specialDate: Date;
    guests?: number;
    invitationLink?: string;
    accessCode?: string;
    wishlist: Product[];
    createdAt: Date;
    updatedAt: Date;
}

const ImageSchema: Schema = new Schema({
    src: { type: String, required: true },
});

const ProductSchema: Schema = new Schema({
    id: { type: Number, required: true },
    title: { type: String, required: true },
    price: { type: String, required: true },
    images:{ type: [ImageSchema], required: true}, 
    quantity: { type: Number, required: true },
    url: { type: String },
})

const RegistrySchema: Schema = new Schema(
    {
        firstName: { type: String, required: true},
        lastName: { type: String, required: true},
        partnerFirstName: {type: String, required: true},
        partnerLastName: {type: String, required: true},
        address: {type: String, required: true},
        address2: {type: String},
        city: {type: String, required: true},
        postalCode: {type: String, required: true},
        deliveryDate: {type: Date, require: true},
        specialDate: {type: Date, require: true},
        guests: {type: Number},
        invitationLink: {type: String},
        accessCode: {type: String},
        wishlist: {type: [ProductSchema], required: true},
        createdAt: {type: Date, default: Date.now},
        updatedAt: {type: Date, default: Date.now},
    },
    {timestamps: true}
);

const Registry = mongoose.models.Registry || mongoose.model<IRegistry>("Registry", RegistrySchema);

export default Registry;