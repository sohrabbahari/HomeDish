import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import { useDispatch } from 'react-redux';
import { addItem } from '../../redux/slices/cartSlice';
import api from '../api';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const [foodListings, setFoodListings] = useState([]);
  const dispatch = useDispatch();
  const navigation = useNavigation();

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
            <Button title="View Details" onPress={() => navigation.navigate('FoodDetails', { item })} />
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
      <Button title="Go to Cart" onPress={() => navigation.navigate('Cart')} />
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
  listing: {
    marginBottom: 15,
  },
  foodTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
