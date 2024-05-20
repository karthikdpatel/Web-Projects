import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IItemListData, IItemListItemData } from "../interfaces/Item-List-Data";
import { IItemDetailData } from "../interfaces/Item-Detail-Data";
import { IWishlistData } from "../interfaces/Wishlist-Data";

interface ItemsDataState {
  itemsList?: IItemListData;
  itemDetails?: IItemDetailData;
  selectedItemId?: string;
  wishListData?: IWishlistData[];
  itemListInfoForSelectedId?: IItemListItemData;
}

const initialState: ItemsDataState = {};

export const itemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    upsertItemList: (state, action: PayloadAction<IItemListData>) => {
      state.itemsList = action.payload;
    },
    upsertItemDetails: (
      state,
      action: PayloadAction<
        | {
            itemId: string;
            data: IItemDetailData;
            itemListInfo: IItemListItemData;
          }
        | undefined
      >,
    ) => {
      state.itemDetails = action.payload?.data;
      state.selectedItemId = action.payload?.itemId;
      state.itemListInfoForSelectedId = action.payload?.itemListInfo;
    },
    addItemInWishlist: (state, action: PayloadAction<string>) => {
      if (state.itemsList) {
        const index = state.itemsList.items.findIndex(
          (o) => o.id === action.payload,
        );

        if (index !== -1) {
          const updatedItem: IItemListItemData = {
            ...state.itemsList.items[index],
            addedToWishlist: true,
          };
          state.itemsList.items[index] = updatedItem;

          if (state.itemListInfoForSelectedId !== undefined) {
            state.itemListInfoForSelectedId.addedToWishlist = true;
          }

          state.wishListData?.push({
            itemId: updatedItem.id,
            imageURL: updatedItem.imageURL,
            title: updatedItem.title,
            itemURL: updatedItem.link,
            itemPrice: updatedItem.itemPrice,
            shippingPrice: updatedItem.shippingPrice,
          });
        } else {
          console.error("Should not come here");
        }
      } else {
        if (state.itemListInfoForSelectedId !== undefined) {
          state.itemListInfoForSelectedId.addedToWishlist = true;

          state.wishListData?.push({
            itemId: state.itemListInfoForSelectedId.id,
            imageURL: state.itemListInfoForSelectedId.imageURL,
            title: state.itemListInfoForSelectedId.title,
            itemURL: state.itemListInfoForSelectedId.link,
            itemPrice: state.itemListInfoForSelectedId.itemPrice,
            shippingPrice: state.itemListInfoForSelectedId.shippingPrice,
          });
        } else {
          console.error("Should not come here");
        }
      }
    },
    removeItemFromWishlist: (state, action: PayloadAction<string>) => {
      if (state.itemsList) {
        const index = state.itemsList.items.findIndex(
          (o) => o.id === action.payload,
        );

        if (index !== -1) {
          const updatedItem: IItemListItemData = {
            ...state.itemsList.items[index],
            addedToWishlist: false,
          };
          state.itemsList.items[index] = updatedItem;
        } else {
          console.error("Should not come here");
        }
      }

      if (state.itemListInfoForSelectedId !== undefined) {
        state.itemListInfoForSelectedId.addedToWishlist = false;
      }

      if (state.wishListData) {
        const wishlistIndex = state.wishListData.findIndex(
          (item) => item.itemId === action.payload,
        );

        state.wishListData.splice(wishlistIndex, 1);
      }
    },
    upsertWishlistData: (state, action: PayloadAction<IWishlistData[]>) => {
      state.wishListData = action.payload;
    },
    clearAllData: (state) => {
      state.itemsList = undefined;
      state.itemDetails = undefined;
      state.selectedItemId = undefined;
      state.wishListData = undefined;
      state.itemListInfoForSelectedId = undefined;
    },
  },
});

export const {
  upsertItemList,
  upsertItemDetails,
  addItemInWishlist,
  removeItemFromWishlist,
  upsertWishlistData,
  clearAllData,
} = itemsSlice.actions;

export default itemsSlice.reducer;
