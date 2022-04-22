import React from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import './App.css';
import Auth from './components/Auth';
import Layout from './components/Layout';
import Notification from './components/Notification';
import { uiActions } from './store/ui-slice';
let isFirstRender = true;
function App() {
  const dispatch = useDispatch();
  const notification = useSelector((state) => state.ui.notification);
  const cart = useSelector((state) => state.cart);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    if (isFirstRender) {
      isFirstRender = false;
      return;
    }
    const sendRequest = async () => {
      // Send state as Sending request
      dispatch(
        uiActions.showNotification({
          open: true,
          message: 'Sending Request',
          type: 'warning',
        })
      );
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
    sendRequest().catch((err) => {
      dispatch(
        uiActions.showNotification({
          open: true,
          message: 'Sending Request Failed',
          type: 'error',
        })
      );
    });
  }, [cart]);
  return (
    <div className="App">
      {notification && (
        <Notification type={notification.type} message={notification.message} />
      )}
      {!isLoggedIn && <Auth />}
      {isLoggedIn && <Layout />}
    </div>
  );
}

export default App;
