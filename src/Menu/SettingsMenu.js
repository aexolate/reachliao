import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { getData, storeData } from '../utils/AsyncStorage';
import PropTypes from 'prop-types';

//activation radius is currently only set in confirm location, should change to on load screen
const SettingsMenu = () => {
  const DEFAULT_RADIUS = 500;
  const [radiusText, setRadiusText] = useState(''); //text for radius setting input
  const [radiusValue, setRadiusValue] = useState(DEFAULT_RADIUS); //radius that is displayed in app, also the current setting value
  
  useEffect(() => {
    getData('radius').then((radius) => {
      setRadiusValue(radius == null ? DEFAULT_RADIUS : radius);
    });
  }, []);

  const SettingsButton = (props) => {
    return (
      <Button
        style={styles.button}
        mode="contained"
        onPress={() => {
          if (radiusText == '') {
            alert('No value keyed in!');
          } else {
            storeData(props.keyValue, radiusText);
            setRadiusValue(radiusText);
            setRadiusText('');
          }
        }}
      >
        confirm
      </Button>
    );
  };
  SettingsButton.propTypes = {
    keyValue: PropTypes.string.isRequired,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Default Activation Radius: {radiusValue} meters</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Enter Activation Radius"
        value={radiusText}
        onChangeText={setRadiusText}
        keyboardType="numeric"
      />
      <SettingsButton keyValue={'radius'} />
    </View>
  );
};

export default SettingsMenu;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  text: {
    fontSize: 19,
    top: 10,
  },
  textInput: {
    height: 50,
    width: 400,
    top: 18,
  },
  button: {
    height: 40,
    width: 400,
    top: 25,
  },
});
