'use strict';
import {StyleSheet} from 'react-native';

module.exports = StyleSheet.create({
  primaryColor: '#3973E2',
  darkBackground: {
    backgroundColor: '#1A1A2E',
    flex: 1,
    width: '100%',
    padding: 25,
  },
  lightText: {
    color: 'white',
  },
  card: {
    borderRadius: 20,
    padding: 15,
    height: 200,
    background:
      'linear-gradient(219deg, rgba(75, 53, 118, 1) 33%, rgba(248, 177, 60, 1) 100%)',
  },
});
