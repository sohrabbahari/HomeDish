import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../src/screens/HomeScreen';
import CartScreen from '../src/screens/CartScreen';
import LoginScreen from '../src/screens/LoginScreen';
import RegisterScreen from '../src/screens/RegisterScreen';
import AddFoodScreen from '../src/screens/AddFoodScreen';

// Creating Stack Navigator
const Stack = createStackNavigator();

const Layout = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#f4511e', // Custom header style
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Add Food" component={AddFoodScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Layout;
