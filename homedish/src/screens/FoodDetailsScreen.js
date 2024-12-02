import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { addItem } from '../../redux/slices/cartSlice';

const FoodDetailsScreen = ({ route, navigation }) => {
  const { foodItem } = route.params;
  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{foodItem.title}</Text>
      <Text>{foodItem.description}</Text>
      <Text>${foodItem.price}</Text>
      <Button title="Add to Cart" onPress={() => dispatch(addItem(foodItem))} />
      <Button title="Back to Home" onPress={() => navigation.goBack()} />
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
});

export default FoodDetailsScreen;
