export interface Cabin {
    id: number;
    name: string;
    description: string; 
    capacity: number;
    rating: number;
    price: number;
    favorite: boolean;
    images: Image[];
    address: Address;
    category: Category;
    features: Feature[];
};

export interface Address {
    id?: number;
    street: string;
    number: number;
    location: string;
    province: string;
    country: string;
};

export interface Image {
    id: number,
    fileName: string,
    data: string
}

export type Category = {
    id: number;
    name: string;
    description: string;
};

export interface Feature {
    id: number,
    name: string
}
