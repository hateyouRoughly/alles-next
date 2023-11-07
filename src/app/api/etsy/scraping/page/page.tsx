'use client';
import { scrap } from "@/etsy/scraping";
import { revalidatePath } from "next/cache";
import React from "react";

export default function page(){

    const getData = async() => {
        const obj = await scrap("https://www.etsy.com/in-en/listing/1562049702/gorgeous-wedding-gown-on-silk-wedding");
        console.log(obj);
    };

    return <React.Fragment><button onClick={getData}>Click</button></React.Fragment>
}