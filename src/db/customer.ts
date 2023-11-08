import { customers } from "@/db";

//listing all customer data
export const list = async () => {
    const client = await customers();
    return client.find({}).toArray();
};
