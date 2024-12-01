import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import api from '../api'; // Import the Axios instance
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

const handleLogin = async () => {
    try {
    const response = await api.post('/users/login', { email, password });
    if (response.status === 200) {
        Alert.alert('Login Successful', 'Welcome to HomeDish!');
        await AsyncStorage.setItem('userToken', response.data.token);
        navigation.navigate('Home');
        }
    } 
    catch (error) {
        console.error('Error logging in:', error);
        Alert.alert('Login Failed', 'Invalid credentials. Please try again.');
    }
};

return (
    <View style={styles.container}>
    <Text style={styles.title}>Login to HomeDish</Text>
    <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
    />
    <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
    />
    <Button title="Login" onPress={handleLogin} />
    <Button title="Register" onPress={() => navigation.navigate('Register')} />
    </View>
);
};

const styles = StyleSheet.create({
container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
},
title: {
    fontSize: 24,
    marginBottom: 20,
},
input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
},
});

export default LoginScreen;
