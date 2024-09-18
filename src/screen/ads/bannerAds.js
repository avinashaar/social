import React from 'react';
import {Image, TouchableOpacity, View} from 'react-native';

import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';

const adUnitId = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-7413044334609188/9550370239';

function BannerAds({navigation}) {
  return (
    <View style={{position: 'absolute', left: 0, right: 0, bottom: 0}}>
       <BannerAd
          unitId={adUnitId}
          size={BannerAdSize.FULL_BANNER}
        />
      {/* <View
        style={{
          flex: 1,
          // flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          // width: '100%',
          // height: undefined,
          // aspectRatio: 1,
        }}>
       
      </View> */}
    </View>
  );
}

export default BannerAds;
