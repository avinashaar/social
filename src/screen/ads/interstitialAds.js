import React, {useEffect, useImperativeHandle, forwardRef} from 'react';
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';
////ca-app-pub-7413044334609188~4960388535
//// old        ca-app-pub-7413044334609188/8092736761
const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-7413044334609188/8092736761';

const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
    requestNonPersonalizedAdsOnly: true,
});

const InterstitialAds = forwardRef((props, ref) => {
    const [loaded, setLoaded] = React.useState(false);
    useEffect(() => {
        const unsubscribe = interstitial.addAdEventListener(AdEventType.LOADED, () => {
            setLoaded(true);
        });
        interstitial.load();
        return unsubscribe;
    }, []);

    useEffect(() => {
        if (interstitial) {
          const adClosedListener = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
            const unsubscribe = interstitial.addAdEventListener(AdEventType.LOADED, () => {
                setLoaded(true);
            });
            interstitial.load();
            return unsubscribe
        });
    
          return () => {
            adClosedListener();
          };
        }
      }, [interstitial]);

    useImperativeHandle(ref, () => ({
        showInterstitialAds:() => {
            if (interstitial.loaded) {
                interstitial.show()
            }
        },
        updateAds:() => {
            const unsubscribe = interstitial.addAdEventListener(AdEventType.LOADED, () => {
                setLoaded(true);
            });
            interstitial.load();
            return unsubscribe;
        }

    }));

    // if (!loaded) {
    //     return null;
    // }

    return null;
});

export default InterstitialAds;
