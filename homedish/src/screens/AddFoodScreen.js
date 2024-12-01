import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import api from '../api';

const AddFoodScreen = ({ navigation }) => {
const [title, setTitle] = useState('');
const [description, setDescription] = useState('');
const [price, setPrice] = useState('');

const handleAddFood = async () => {
    try {
    const response = await api.post('/foods/add', {
        userId: 1, // Static for now; replace with dynamic userId
        title,
        description,
        price: parseFloat(price),
    });

    if (response.status === 201) {
        Alert.alert('Success', 'Food listing added successfully');
        navigation.navigate('Home');
    }
    } catch (error) {
    console.error('Error adding food:', error);
    Alert.alert('Error', 'Failed to add food listing');
    }
};

return (
    <View style={styles.container}>
    <Text style={styles.title}>Add New Food Listing</Text>
    <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
    />
    <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
    />
    <TextInput
        style={styles.input}
        placeholder="Price"
        value={price}
        keyboardType="numeric"
        onChangeText={setPrice}
    />
    <Button title="Add Food" onPress={handleAddFood} />
    </View>
);
};

export default AddFoodScreen;
