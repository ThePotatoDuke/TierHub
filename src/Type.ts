export type Item = {
  id: number;
  imageUrl: string;
  tierId: number | string | null;
};

export type Row = {
  id: number;
  name: string;
  color: string;
  tierListID: number;
  items: Item[];
  position: number;
};

export type TierList = {
  id: number;
  name: string;
  description: string;
  tierListID: number;
  items: Item[];
  position: number;
};
export interface TierListDTO {
  id: number;
  description: string;
  name: string;
  imageUrl: string;
  userId: number;
  categoryId: number | null;
}
