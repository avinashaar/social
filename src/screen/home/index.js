import React, {useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  PermissionsAndroid,
} from 'react-native';

const Home = ({navigation}) => {
  const socialImage = [
    // {
    //   name: 'Youtube',
    //     url: 'https://www.techadvisor.com/wp-content/uploads/2022/06/how-to-skip-ads-on-youtube-logo-1-1.jpg?quality=50&strip=all&w=1024',
    // },
    {
      name: 'Instagram',
      url: require('../../img/instagram.png'),
    },
    {name: 'Facebook', url: require('../../img/facebook.png')},
    {
      name: 'TikTok',
      url: require('../../img/tiktok.png'),
    },
    {name: 'Twitter', url: require('../../img/twitter.png')},
    {name: 'Other', url: require('../../img/other.png')},
  ];

  useEffect(() => {
    getPermission();
  }, []);

  const getPermission = async () => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]).then(result => {
        if (
          result['android.permission.ACCESS_COARSE_LOCATION'] &&
          result['android.permission.ACCESS_FINE_LOCATION'] &&
          result['android.permission.READ_EXTERNAL_STORAGE'] &&
          result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted'
        ) {
          console.log('get permission');
        } else if (
          result['android.permission.ACCESS_COARSE_LOCATION'] ||
          result['android.permission.ACCESS_FINE_LOCATION'] ||
          result['android.permission.READ_EXTERNAL_STORAGE'] ||
          result['android.permission.WRITE_EXTERNAL_STORAGE'] ===
            'never_ask_again'
        ) {
          console.log(
            'Please Go into Settings -> Applications -> APP_NAME -> Permissions and Allow permissions to continue',
          );
        }
      });
    }
  };

  const goto = name => {
    navigation.navigate(name);
  };

  return (
    <SafeAreaView style={styles.container}>
      {
        <>
          <View style={styles.logoView}>
            <Image
              style={{
                flexDirection: 'row',
                margin: 'auto',
                justifyContent: 'center',
                width: 200,
                height: 150,
              }}
              source={require('../../img/download.png')}
              resizeMode="contain"
            />
          </View>
        </>
      }
      <View style={styles.swipe}>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            margin: 'auto',
            justifyContent: 'center',
          }}>
          {socialImage.map((img, index) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  goto(img.name);
                }}>
                <View style={styles.categoryBox}>
                  <Image
                    // source={{uri: img.url}}
                    source={img.url}
                    style={{width: 80, height: 80}}
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  swipe: {
    backgroundColor: 'white',
    height: '100%',
    padding: 40,
    borderRadius: 20,
  },
  container: {
    backgroundColor: '#3D3362',
    flex: 1,
    // padding: 20
  },
  logoView: {
    width: '100%',
    height: '25%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    flex: 1,
    height: '35%',
    backgroundColor: '#3D3362',
    borderBottomRightRadius: 85,
    // marginBottom: 10
  },
  categoryBox: {
    padding: 10,
    width: 100,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'thistle',
    display: 'flex',
    alignItems: 'center',
    marginBottom: 20,
    marginRight: 20,
  },
  text: {
    color: 'white',
    fontSize: 20,
    marginHorizontal: 20,
    textAlign: 'center',
    marginTop: 10,
  },
  input: {
    height: 50,
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    backgroundColor: '#463D69',
    borderColor: '#463D69',
    color: 'white',
    marginHorizontal: 20,
  },
  download: {
    color: 'white',
    height: 50,
    marginTop: 10,
    borderRadius: 30,
    marginHorizontal: 20,
  },
});

export default Home;
