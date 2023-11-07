import { JSDOM } from 'jsdom'
import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { CustomEnv, ProductList, ItemListElement, Queuelist, ProductDetail } from "./interface"
import { extname, basename } from 'path';

const { ETSY_END_POINT, ETSY_SELLER, MAX_API_THREAD, ETSY_INCLUDE_IMAGE}: CustomEnv = process?.env;

// for custom logging
const log = (message?: string, type: "error" | "info" = "info") => {
    console.log(message);
}

//creating directory sync
const dir = './inventory/etsy/' + ETSY_SELLER;
mkdirSync(dir, { recursive: true });

const filename = "/products.json";
let productListing: ItemListElement[] = [];
let counter = 0;

try {
    const content: string | any = readFileSync(dir + filename);
    productListing = JSON.parse(content);
} catch (error: any) {
    log("readFileSync: " + error.message);
}

const list = async (page: number) => {
    const url = ETSY_END_POINT + ETSY_SELLER + '?page=' + page;

    //getting response from etsy
    const data: ProductList = await etsyGetResponse(url);

    if(data && data.itemListElement.length){
        // adding data
        data.itemListElement.forEach(item => {
            // finding if already have data
            const index = productListing.findIndex(e => e.url === item.url );
            if(index === -1){
                productListing.push(item);
            }else{
                productListing[index] = item;
            }
        
            try{
                writeFileSync(dir + filename, JSON.stringify(productListing));
            }catch(error: any){
                log("writeFileSync: " + error.message);
            }
        });

        // adding current data length in counter
        counter += data.itemListElement.length;

        log("list: listed " + counter + ' of ' + data.numberOfItems);
        await list(++page); // recurring next page
    }else{
        log("list: completed");
    }

    return productListing;
}

// get product detail from url
export class Products {
    public queuelist: Queuelist[] = productListing;

    constructor(itemListElement?: ItemListElement[]) {
        if(itemListElement){
            this.queuelist = itemListElement;
        }
        this.queuelist = this.queuelist.map(item => ({ ...item, status: 'pending' }));
    }

    productDetail: any = async({src, retry = true}: { src?: string, retry?: boolean }) => {

        const itemIndex = this.queuelist.findIndex(e => (!src && e.status === "pending") || src === e.url);
        
        if(itemIndex === -1){
            return null;
        }
        
        this.queuelist[itemIndex].status = 'inprocess';

        const data: ProductDetail = await etsyGetResponse(this.queuelist[itemIndex].url);

        if(data){
            this.queuelist[itemIndex].status = 'completed';

            // saving data
            const index = productListing.findIndex(e => e.url === this.queuelist[itemIndex].url);
            const currentData = productListing[index]?.productDetail ?? {};
            productListing[index].productDetail = {...currentData, ...data};

            try{
                writeFileSync(dir + filename, JSON.stringify(productListing));
            }catch(error: any){
                log("writeFileSync: " + error.message);
            }

            // saving images
            if(ETSY_INCLUDE_IMAGE){
                //creating image directory sync
                const imageDir = dir + '/image/' + data.sku;
                mkdirSync(imageDir, { recursive: true });

                //creating thumb directory sync
                const thumbDir = dir + '/thumb';
                mkdirSync(thumbDir, { recursive: true });

                for(let i = 0; i < data.image.length; i++){
                    const imageUrl = data.image[i].contentURL;
                    const blob = await (await fetch(imageUrl)).blob();
                    writeFileSync(imageDir + '/' + basename(imageUrl), Buffer.from(await blob.arrayBuffer()));

                    if(i === 1){
                        writeFileSync(thumbDir + '/' + data.sku + extname(imageUrl), Buffer.from(await blob.arrayBuffer()));
                    }

                    //logging
                    log("imageDownload: " + basename(imageUrl));
                }
            }

            // logging status
            log(this.queuelist[itemIndex].url + " is completed");
            log(this.queuelist.filter(e => e.status === "pending").length + " items in pending...");
            
            this.productDetail({});
        }else{
            if(retry){
                return await this.productDetail({ src: this.queuelist[itemIndex].url, retry: false });
            }else{
                this.queuelist[itemIndex].status = 'failed';
                log(this.queuelist[itemIndex].url + " is failed");
                this.productDetail({});
            }
        }

        return data;
    };

    async save() {
        // running multiple thread for fast processing
        for(let i = 0; i < MAX_API_THREAD; i++){
            this.productDetail({});
        }
    }
}



//method to parse HTML tag to filter json from etsy website
const etsyGetResponse = async (url: string) => {

    // fetch header option
    const option = {
        method: 'GET',
        headers: {
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'accept-language': 'en-US,en;q=0.9',
            'sec-fetch-site': 'none',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 Edg/119.0.0.0'
        },
    }

    // fetch request for html response
    const response = await fetch(url, option);

    if(response.status !== 200){
        log("etsyGetResponse: invalid response from " + url);
        return null;
    }

    const html = await response.text();

    // initializing window using html
    const { window } = new JSDOM(html);
    // filtering json from html
    const data = window.document.querySelector("[type='application/ld+json']")?.innerHTML;

    if(data){
        return JSON.parse(data);
    }else{
        log("etsyGetResponse: undefined innerHTML, " + url);
        return null;
    }
}

export { list }