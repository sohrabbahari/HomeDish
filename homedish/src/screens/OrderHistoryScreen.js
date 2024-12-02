// src/screens/OrderHistoryScreen.js
import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrderHistory } from '../../redux/slices/orderSlice';
import { useNavigation } from '@react-navigation/native';

const OrderHistoryScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const userId = useSelector((state) => state.user.id); // Assuming user data is available in the state
  const { orders, status, error } = useSelector((state) => state.orders);

  useEffect(() => {
    if (userId) {
      dispatch(fetchOrderHistory(userId));
    }
  }, [userId, dispatch]);

  if (status === 'loading') {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (status === 'failed') {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Failed to load order history: {error}</Text>
      </View>
    );
  }

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.orderItem}
      onPress={() => navigation.navigate('OrderDetails', { order: item })}
    >
      <Text style={styles.orderText}>Order ID: {item.id}</Text>
      <Text style={styles.orderDate}>Date: {new Date(item.date).toLocaleDateString()}</Text>
      <Text style={styles.orderTotal}>Total Amount: ${item.totalAmount.toFixed(2)}</Text>
      <Text>Items:</Text>
      {item.items.map((food, index) => (
        <Text key={index}>
          {food.title} - ${food.price.toFixed(2)}
        </Text>
      ))}
      <Text style={styles.viewDetails}>View Details</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order History</Text>
      {orders.length > 0 ? (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : (
        <Text>No orders found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  orderItem: {
    marginBottom: 15,
    padding: 15,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
  },
  orderText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
  },
  orderTotal: {
    fontSize: 16,
    marginVertical: 5,
  },
  viewDetails: {
    marginTop: 10,
    color: '#007BFF',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
});

export default OrderHistoryScreen;
