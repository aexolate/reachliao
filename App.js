import React, { useEffect, useState, ReactElement, useRef } from 'react';
import { Platform, StyleSheet, Text, View, Button, StatusBar, TextInput, Vibration, Pressable, Alert, SafeAreaView } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import Geocoder from 'react-native-geocoding';
import { Audio } from 'expo-av';
import { distanceBetween } from './Utils.js'
import { AlarmManager } from './AlarmManager.js'
import { GOOGLE_MAPS_API_KEY } from '@env'

const App = () => {
  const [status, requestPermission] = Location.useForegroundPermissions();
  const [curLocation, setCurLocation] = useState({ latitude: 0, longitude: 0 })
  const [destination, setDestination] = useState({ latitude: 1.418916501296272, longitude: 103.6979021740996 }) //placeholder destination
  const [distanceToDest, setDistanceToDest] = useState(Infinity)
  const [destinationWord, setDestinationWord] = useState(''); //destination in string for geocoding
  const [isAlarmSet, setIsAlarmSet] = useState(false)  //Indicates whether the alarm has been set

  const ACTIVATION_RADIUS = 500;
  let foregroundSubscription = null;
  const alarmManager = AlarmManager();
  const mapRef = useRef(null);
  Geocoder.init(GOOGLE_MAPS_API_KEY);

  //Initializing Function
  useEffect(() => {
    Geocoder.init(GOOGLE_MAPS_API_KEY);
    alarmManager.setupAudio();
    requestPermission().then((response) => {
      if (!response.granted) {
        console.log("Foreground permission not granted");
        return;
      }
      startForegroundUpdate();
    });
  }, [])

  const startForegroundUpdate = async () => {
    foregroundSubscription?.remove()
    foregroundSubscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 1000
      },
      location => {
        setCurLocation({ latitude: location.coords.latitude, longitude: location.coords.longitude })
      }
    )
  };

  //React hook for curLocation
  React.useEffect(() => {
    setDistanceToDest(distanceBetween(curLocation, destination).toFixed(0));
    if (distanceToDest <= ACTIVATION_RADIUS && isAlarmSet) {
      alarmManager.playAlarm();
    }
  }, [curLocation]);

  //selecting destination via geocoding: word to coordinate
  const selectLocGeocode = (prop) => {
    Geocoder.from(prop)
      .then(json => {
        var location = json.results[0].geometry.location;
        const dest = {
          latitude: location.lat,
          longitude: location.lng,
        };
        setLocConfirmation(dest);
      })
      .catch(error => console.warn(error));
  }

  //selecting destination via longpress
  const selectLocLongPress = (prop) => {
    const dest = {
      latitude: prop.coordinate.latitude,
      longitude: prop.coordinate.longitude,
    };
    setLocConfirmation(dest);
  }

  //function to get user to confirm is this is the destination they want to set as alarm
  const setLocConfirmation = (dest) => {
    const oldDest = JSON.parse(JSON.stringify(destination));
    setDestination(dest);
    setDistanceToDest(distanceBetween(curLocation, dest).toFixed(0));
    mapRef.current.animateCamera(dest, { duration: 1000 });

    Alert.alert(
      null,
      'Would you like to set as your destination?',
      [{
        text: 'Cancel',
        style: 'cancel',
        onPress: () => {
          setDestination(oldDest);
          setDistanceToDest(distanceBetween(curLocation, oldDest).toFixed(0));
          mapRef.current.animateCamera(oldDest, { duration: 1000 });
        }
      },
      {
        text: 'Set Alarm',
        onPress: () => {
          setIsAlarmSet(true);
          alert('alarn SET!');
        }
      }],
    )
  };

  const unsetAlarm = () => {
    setIsAlarmSet(false);
    alarmManager.stopAlarm();
  };

  //Render
  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={setDestinationWord}
        value={destinationWord}
        placeholder='!input final destination!'
        selectionColor='#003D7C'
      />
      <Pressable
        onPress={() => { selectLocGeocode(destinationWord) }}
        style={styles.button}
      >
        <Text>Search Destination</Text>
      </Pressable>
      <MapView
        ref={mapRef}
        style={styles.map}
        showsUserLocation={true}
        mapPadding={{ top: StatusBar.currentHeight }}   //Keeps map elements within view such as 'Locate' button
        onLongPress={(prop) => { selectLocLongPress(prop.nativeEvent) }}>
          
          <View>
            <MapView.Circle
              radius={ACTIVATION_RADIUS}
              center={destination}
              strokeWidth={2}
              strokeColor={'#1a66ff'}
              fillColor={'rgba(230,238,255,0.6)'}
            >
            </MapView.Circle>
            <MapView.Marker
              coordinate={destination}
              pinColor='#1a66ff'
              title='Destination'
            >
            </MapView.Marker>
          </View>
        
      </MapView>
      {isAlarmSet &&
        <View style={{ position: 'absolute', backgroundColor: 'white', alignItems: 'center', width: '70%', bottom: '30%', alignSelf: 'center' }}>
          <Text>Alarm is set</Text>
          <Text> {'Distance to Destination: ' + distanceToDest + ' m'} </Text>
          <Button title="Cancel Alarm" onPress={unsetAlarm} />
        </View>
      }
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    flex: 6,
    paddingTop: StatusBar.currentHeight
  },
  distanceAndAlarm: {
    flex: 2,
    curLocation: 'absolute',
    alignSelf: 'center',
    backgroundColor: 'white'
  },
  input: {
    flex: 1,
    borderColor: 'black',
    borderWidth: 4,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  button: {
    flex: 1,
    backgroundColor: '#003D7C',
    borderColor: '#000000',
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'flex-end',
  }
})