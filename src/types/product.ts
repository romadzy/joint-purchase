export interface Product {
    id: number;
    categoryId: number;
    title: string;
    description: string;
    price: number;
    image: string;
    targetAmount: number;
    currentAmount: number;
}

export interface Category {
    id: number;
    name: string;
    image: string;
}
