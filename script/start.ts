import { config } from 'dotenv';
config({ path: '.env.local' });

const scrap = async () => {
    const { list, Products } = await import('./etsy/scraping/product');

    const productList = await list(1);
    const obj = new Products(productList);
    obj.save();
}

scrap();