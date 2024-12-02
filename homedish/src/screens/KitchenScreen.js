// src/screens/KitchenScreen.js
import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, Button } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const KitchenScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {
    kitchenName,
    address,
    cuisine,
    rating,
    foodItems
  } = route.params;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: route.params.imageUri }} style={styles.image} />
        <Text style={styles.kitchenName}>{kitchenName}</Text>
        <Text style={styles.cuisine}>{cuisine}</Text>
        <Text style={styles.rating}>Rating: {rating} ⭐</Text>
        <Text style={styles.address}>{address}</Text>
      </View>
      
      <View style={styles.foodItems}>
        {foodItems.map((item, index) => (
          <View key={index} style={styles.foodItem}>
            <Image source={{ uri: item.imageUri }} style={styles.foodImage} />
            <Text style={styles.foodTitle}>{item.name}</Text>
            <Text style={styles.foodPrice}>${item.price}</Text>
            <Button
              title="Add to Cart"
              onPress={() => navigation.navigate('Cart', { foodItem: item })}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  kitchenName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  cuisine: {
    fontSize: 18,
    color: '#555',
  },
  rating: {
    fontSize: 16,
    marginTop: 5,
  },
  address: {
    fontSize: 16,
    color: '#777',
  },
  foodItems: {
    marginTop: 20,
  },
  foodItem: {
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  foodImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  foodTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  foodPrice: {
    fontSize: 16,
    color: '#444',
  },
});

export default KitchenScreen;
