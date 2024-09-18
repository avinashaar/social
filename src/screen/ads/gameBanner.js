import React from 'react';
import {GAMBannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';

const adUnitId = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-7413044334609188/9550370239';

function GameBannerAds({navigation}) {
  return (
      <GAMBannerAd
      unitId={adUnitId}
      sizes={[BannerAdSize.FULL_BANNER]}
      requestOptions={{
        requestNonPersonalizedAdsOnly: true,
      }}
    />
  );
}

export default GameBannerAds;
