import { useInterstitialAd, TestIds } from 'react-native-google-mobile-ads';
import React, {forwardRef, useEffect, useImperativeHandle} from 'react';
import {View} from 'react-native'

const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-7413044334609188/8092736761';


const InterAds = forwardRef((props, ref) => {
    const { isLoaded, isClosed, load, show } = useInterstitialAd(adUnitId, {
        requestNonPersonalizedAdsOnly: true,
    });

    useEffect(() => {
        // Start loading the interstitial straight away
        load();
    }, [load]);

    useImperativeHandle(ref, () => ({
        showInterstitialAds() {
            if(isLoaded) {
                show()
            }
        }

    }));

    return null;
})

export default InterAds;
