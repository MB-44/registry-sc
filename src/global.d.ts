import { MongoClient } from "mongodb";

declare global {
    namespace NodeJS {
        interface Global {
            _mongoClientPromise? : Promise<MongoClient>;
        }
    }

    var _mongoClientPromise: Promise<MongoClient>;
}

export {};