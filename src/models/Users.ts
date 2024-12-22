import { ObjectId } from "mongodb";

export interface IUser {
    _id?: ObjectId;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    password: string;
    otp?: string;
    otpExpiry?:number;
}