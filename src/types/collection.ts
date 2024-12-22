export interface ProductImage {
    src: string;
  }
  
  export interface Product {
    id: number;
    title: string;
    images: ProductImage[];
  }
  
  export interface CollectionImage {
    src: string;
  }
  
  export interface Collection {
    id: number;
    title: string;
    image: CollectionImage | null;
  }
  
  export interface CollectionWithProducts extends Collection {
    products: Product[];
  }
  