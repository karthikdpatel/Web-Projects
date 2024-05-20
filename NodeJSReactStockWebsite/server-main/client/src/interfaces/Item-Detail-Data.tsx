export interface IItemDetailData {
  productImages: string[];
  price: number;
  title: string;
  itemLink: string;
  returnPolicy: string;
  itemSpecifics: {
    name: any;
    value: any;
  }[];
  popularity: number;
  feedbackScore: number;
  location?: string;
  feedbackRatingStar?: string;
  sellerUserId?: string;
  isTopRated?: boolean;
  storeName?: string;
  storeURL?: string;
}
