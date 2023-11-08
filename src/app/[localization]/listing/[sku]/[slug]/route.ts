import { ProductDetail } from "@/etsy/scraping/interface";
import { Products } from "@/etsy/scraping/product";
import { CustomEnv } from "@/interface";
import { NextRequest } from "next/server";

const env: CustomEnv = process.env;

export async function GET(request: NextRequest) {
    const uri = new URL(request.url);
    const url = uri.href.replace(new RegExp(uri.origin), env.ETSY_BASE_URL)

    console.log(url);
    
    // getting data from etsy
    const product = new Products([{ url }]);
    const productDetail: ProductDetail = await product.productDetail({});

    return Response.json(productDetail);
}