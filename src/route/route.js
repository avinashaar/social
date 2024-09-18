import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ToastProvider} from 'react-native-toast-notifications';
import NewScreen from '../screen/NewScreen/NewScreen';
import Donate from '../screen/donate/donate';
import BannerAds from '../screen/ads/bannerAds';

// const Route = createStackNavigator(
//     {
//         home: Home,
//         youtube: Youtube
//     }
// )

const Stack = createNativeStackNavigator();

const Route = () => {
  return (
    <SafeAreaProvider>
      <ToastProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="NewHome"
              component={NewScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Donate"
              component={Donate}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="BannerAds"
              component={BannerAds}
              options={{headerShown: false}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </ToastProvider>
    </SafeAreaProvider>
  );
};

export default Route;
