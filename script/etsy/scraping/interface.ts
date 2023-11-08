import { CustomEnv } from "./../../../src/interface";

export type { CustomEnv };

export interface Brand {
    "@type": string;
    "@context": string;
    name: string;
}

export interface Offer {
    "@type": string;
    eligibleQuantity?: number;
    price: string;
    priceCurrency: string;
    availability?: string;
    shippingDetails?: ShippingDetails;
}

export interface AggregateRating {
    "@type": "AggregateRating";
    ratingValue: string;
    reviewCount: string | number;
}

export interface ProductDetail {
    "@type": string;
    "@context": string;
    url: string;
    name: string;
    sku: string;
    gtin: string;
    description: string;
    image: Image[];
    category: string;
    brand: Brand;
    logo: string;
    aggregateRating: AggregateRating;
    offers: Offer;
    material: string;
}

export interface Image {
    "@type": string;
    "@context": string;
    author: string;
    contentURL: string;
    description: any;
    thumbnail: string;
}

export interface ShippingDetails {
    "@type": string;
    shippingRate: ShippingRate;
}

export interface ShippingRate {
    "@type": string;
    value: string;
    currency: string;
}

export interface ItemListElement {
    "@context"?: string;
    "@type"?: string;
    image?: string;
    name?: string;
    url: string;
    brand?: Brand;
    offers?: Offer;
    position?: number;
    aggregateRating?: AggregateRating;
    productDetail?: ProductDetail;
}

export interface Queuelist extends ItemListElement {
    status?: "pending" | "inprocess" | "failed" | "completed";
}

export interface ProductList {
    "@context": string;
    "@type": string;
    itemListElement: [ItemListElement];
    numberOfItems: number;
}