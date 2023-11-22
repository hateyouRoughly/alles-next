import { CustomEnv } from "@/interface";
import { NextRequest, NextResponse } from "next/server";
import products from "@/inventory/etsy/libaasbyanam/products.json";

const env: CustomEnv = process.env;

export async function GET(request: NextRequest) {

    const xmlElement = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
            <loc>https://libaasbyanam.com</loc>
            <lastmod>2023-11-22T09:34:40.236Z</lastmod>
        </url>
        ${ 
            products.map(e => `<url>
                <loc>${e.url.replace("www.etsy.com", 'libaasbyanam.com')}</loc>
                <lastmod>${new Date().toISOString()}</lastmod>
            </url>`) 
        }
    </urlset>`;

    return new NextResponse(xmlElement, {
        headers: { "Content-Type": "text/xml" },
    });
}
