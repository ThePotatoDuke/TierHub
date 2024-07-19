export type Item = {
    id: number;
    imageUrl: string;
    tierId: number|string;
};
  
export type Row = {
    id: number;
    title: string;
    color: string;
    items: Item[];
};