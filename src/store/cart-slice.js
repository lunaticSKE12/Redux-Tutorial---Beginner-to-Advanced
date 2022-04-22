import { createSlice } from '@reduxjs/toolkit';
import { uiActions } from './ui-slice';
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    itemsList: [],
    totalQuantity: 0,
    showCart: false,
  },
  reducers: {
    addToCart(state, action) {
      const newItem = action.payload;
      // to check if item is already available
      const existingItem = state.itemsList.find(
        (item) => item.id === newItem.id
      );
      if (existingItem) {
        existingItem.quantity++;
        existingItem.totalPrice += newItem.price;
      } else {
        state.itemsList.push({
          id: newItem.id,
          price: newItem.price,
          quantity: 1,
          totalPrice: newItem.price,
          name: newItem.name,
        });
        state.totalQuantity++;
      }
    },
    removeFromCart(state, action) {
      const id = action.payload;
      const existingItem = state.itemsList.find((item) => item.id === id);
      if (existingItem.quantity === 1) {
        state.itemsList = state.itemsList.filter((item) => item.id !== id);
        state.totalQuantity--;
      } else {
        existingItem.quantity--;
        existingItem.totalPrice -= existingItem.price;
      }
    },
    setShowCart(state) {
      state.showCart = !state.showCart;
    },
  },
});

export const sendCartData = (cart) => {
  return async (dispatch) => {
    // Send state as Sending request
    dispatch(
      uiActions.showNotification({
        open: true,
        message: 'Sending Request',
        type: 'warning',
      })
    );
    const sendRequest = async () => {
      const res = await fetch(
        'https://redux-http-64149-default-rtdb.asia-southeast1.firebasedatabase.app/cartItems.json',
        {
          method: 'PUT',
          body: JSON.stringify(cart),
        }
      );
      const data = await res.json();
      // Send state as Request is successful
      dispatch(
        uiActions.showNotification({
          open: true,
          message: 'Sent Request to database Successfully',
          type: 'success',
        })
      );
    };

    try {
      await sendRequest();
    } catch (err) {
      dispatch(
        uiActions.showNotification({
          open: true,
          message: 'Sending Request Failed',
          type: 'error',
        })
      );
    }
  };
};

export const cartActions = cartSlice.actions;

export default cartSlice;
