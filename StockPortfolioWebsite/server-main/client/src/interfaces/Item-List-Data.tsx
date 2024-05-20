export interface IItemListData {
  itemCount: number;
  items: IItemListItemData[];
}

export interface IItemListItemData {
  id: string;
  title: string;
  itemPrice: number;
  shippingPrice: number;
  imageURL: string;
  postalCode: string;
  link: string;
  addedToWishlist: boolean;
  handlingTime: number;
  shippingLocations?: string;
  isReturnsAccepted?: boolean;
  isExpShipping?: boolean;
  isOneDayShipping?: boolean;
}
