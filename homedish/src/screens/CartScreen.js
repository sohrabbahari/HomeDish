// Updated CartScreen.js
import React from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { removeItem, clearCart } from '../../redux/slices/cartSlice';
import { placeOrder } from '../api';

const CartScreen = ({ navigation }) => {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  const handleRemoveItem = (itemId) => {
    dispatch(removeItem(itemId));
  };

  const handlePlaceOrder = async () => {
    try {
      const orderData = {
        items: cartItems,
        total: cartItems.reduce((total, item) => total + item.price, 0),
      };
      const response = await placeOrder(orderData);
      console.log('Order placed successfully:', response);
      dispatch(clearCart());
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>
      <FlatList
        data={cartItems}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text>${item.price}</Text>
            <Button title="Remove" onPress={() => handleRemoveItem(item.id)} />
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
      <Button title="Place Order" onPress={handlePlaceOrder} disabled={cartItems.length === 0} />
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
  },
  itemContainer: {
    marginBottom: 15,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CartScreen;
