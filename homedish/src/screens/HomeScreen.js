import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import { useDispatch } from 'react-redux';
import { addItem } from '../../redux/slices/cartSlice';
import api from '../api';

const HomeScreen = () => {
  const [foodListings, setFoodListings] = useState([]);
  const dispatch = useDispatch(); // Initialize dispatch

  useEffect(() => {
    const fetchFoodListings = async () => {
      try {
        const response = await api.get('/foods');
        setFoodListings(response.data);
      } catch (error) {
        console.error('Error fetching food listings:', error);
      }
    };
    fetchFoodListings();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Food Listings</Text>
      <FlatList
        data={foodListings}
        renderItem={({ item }) => (
          <View style={styles.listing}>
            <Text style={styles.foodTitle}>{item.title}</Text>
            <Text>{item.description}</Text>
            <Text>${item.price}</Text>
            <Button title="Add to Cart" onPress={() => dispatch(addItem(item))} />
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
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
  listing: {
    marginBottom: 20, // Added more margin for better separation between items
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  foodTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
