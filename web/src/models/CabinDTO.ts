export interface Cabin {
    id: number;
    name: string;
    description: string; 
    capacity: number;
    rating: number;
    price: number;
    images: Image[];
    address: Address;
    categoryId: number;
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
    fileName: string,
    data: string
}
