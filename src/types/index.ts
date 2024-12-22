export interface User {
    _id?: string;
    firstName: string;
    lastName: string;
    email: string;
    passwordHash: string;
    accessCode: string;
    createdAt: Date;
}

export interface Registry {
    _id?: string;
    coupleId: string;
    accessCode: string;
    weddingDate: Date;
    deliveryAddress: string;
    items: string[];
}

export interface Product {
    _id?: string;
    title: string;
    price: number;
    images: string[];
    collectionId: string;
}

export interface Wishlist {
    _id?: string;
    userId: string;
    items: Product[];
}