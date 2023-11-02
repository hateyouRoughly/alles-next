import { MongoClient } from "mongodb";
import { CustomEnv } from "@/interface";

const env: CustomEnv = process.env;

//initializing client
const client = new MongoClient(env.CONNECTION_URL);

const connection = async(collection: string) => {
    // Use connect method to connect to the server
    await client.connect();
    const connection = client.db(env.DB_NAME);
    return connection.collection(collection);
}

export const customers = async() => await connection('customers');

export default connection;