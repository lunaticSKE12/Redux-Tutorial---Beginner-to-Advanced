import React from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import './App.css';
import Auth from './components/Auth';
import Layout from './components/Layout';
import Notification from './components/Notification';

function App() {
  const cart = useSelector((state) => state.cart);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const cartItems = useSelector((state) => state.cart.itemsList);
  useEffect(() => {
    const sendRequest = async () => {
      const res = await fetch(
        'https://redux-http-64149-default-rtdb.asia-southeast1.firebasedatabase.app/cartItems.json',
        {
          method: 'PUT',
          body: JSON.stringify(cart),
        }
      );
      const data = await res.json();
    };
    sendRequest();
  }, [cart]);
  return (
    <div className="App">
      <Notification type="success" message={'this is test msg'} />
      {!isLoggedIn && <Auth />}
      {isLoggedIn && <Layout />}
    </div>
  );
}

export default App;
