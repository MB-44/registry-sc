import mongoose, { Schema, model, models } from "mongoose";

interface IRegistry {
    firstName: string;
    lastName: string;
    partnerFirstName: string;
    partnerLastName: string;
    address: string;
    city: string;
    postalCode: string;
    specialDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

const RegistrySchema = new Schema<IRegistry>({
    firstName: { type: String, required: true},
    lastName: { type: String, required: true},
    partnerFirstName: {type: String, required: true},
    partnerLastName: {type: String, required: true},
    address: {type: String, required: true},
    city: {type: String, required: true},
    postalCode: {type: String, required: true},
    specialDate: {type: Date, require: true},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
});

const Registry = models.Registry || model<IRegistry>("Registry", RegistrySchema);

export default Registry;