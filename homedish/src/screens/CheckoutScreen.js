// src/screens/CheckoutScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../../redux/slices/cartSlice';
import { addOrder } from '../../redux/slices/orderSlice'; // Import the addOrder action
import api from '../api';

const CheckoutScreen = ({ navigation }) => {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  const handlePlaceOrder = async () => {
    try {
      // Construct order data
      const orderData = {
        items: cartItems,
        totalAmount: cartItems.reduce((total, item) => total + item.price, 0),
        date: new Date().toISOString(), // Add order date for record keeping
      };

      // Assuming your backend has an endpoint to handle orders
      const response = await api.post('/orders', orderData);

      if (response.status === 201) {
        // Order placed successfully, dispatch action to add order to order history in Redux
        dispatch(addOrder(orderData));

        // Clear the cart and navigate back to Home
        dispatch(clearCart());
        alert('Order placed successfully!');
        navigation.navigate('Home');
      } else {
        alert('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Checkout</Text>
      {cartItems.length > 0 ? (
        cartItems.map((item, index) => (
          <View key={index} style={styles.item}>
            <Text>{item.title}</Text>
            <Text>${item.price}</Text>
          </View>
        ))
      ) : (
        <Text>Your cart is empty.</Text>
      )}
      {cartItems.length > 0 && (
        <Button title="Place Order" onPress={handlePlaceOrder} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  item: {
    marginBottom: 15,
  },
});

export default CheckoutScreen;
