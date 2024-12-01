import { Text, View, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export default function HomeScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    })();
  }, []);

  let address = 'Fetching Location...';
  if (errorMsg) {
    address = errorMsg;
  } else if (location) {
    address = `Lat: ${location.coords.latitude}, Lon: ${location.coords.longitude}`;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.locationText}>{address}</Text>
      </View>
      <View style={styles.mainContent}>
        <Text style={{ fontSize: 24 }}>Welcome to HomeDish!</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: '#f4511e',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    color: 'white',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
