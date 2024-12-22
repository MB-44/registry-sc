import mongoose, { Schema, model, models } from "mongoose";

interface IRegistry {
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
    createdAt: Date;
    updatedAt: Date;
    guests?: number;
    invitationLink?: string;
    accessCode?: string;
}

const RegistrySchema = new Schema<IRegistry>({
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
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
    guests: {type: Number},
    invitationLink: {type: String},
    accessCode: {type: String}
});

const Registry = models.Registry || model<IRegistry>("Registry", RegistrySchema);

export default Registry;