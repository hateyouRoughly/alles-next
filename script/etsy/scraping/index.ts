'use server';

const scrap = async (url?: string) => {
    const { list, Products } = await import('./product');

    if(url){
        const obj = new Products([{ url }]);
        return obj.productDetail({});
    }else{
        const productList = await list(1);
        //const obj = new Products(productList);
        return productList;
    }
}

export { scrap }