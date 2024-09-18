import React, {useEffect, useImperativeHandle, forwardRef, useState} from 'react';
import {  RewardedAd, RewardedAdEventType ,TestIds,AdEventType } from 'react-native-google-mobile-ads';
////ca-app-pub-7413044334609188~4960388535
//// old        ca-app-pub-7413044334609188/8092736761
const adUnitId = __DEV__ ? TestIds.REWARDED : 'ca-app-pub-7413044334609188~4960388535';
const rewardedAd = RewardedAd.createForAdRequest(adUnitId, {
    requestNonPersonalizedAdsOnly: true,
});

const RewardAds = forwardRef((props, ref) => {
    const [loaded, setLoaded] = React.useState(false);


    const ads = () => {
        const unsubscribe = rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
            setLoaded(true);
        });
        rewardedAd.load();
        return unsubscribe;
    }

    const unsubscribe = rewardedAd.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
        const unsubscribe1 = rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
            setLoaded(true);
        });
        rewardedAd.load();
        rewardedAd.show();
        return unsubscribe1
    });

    useEffect(() => {
        ads()
    }, []);

    useEffect(() => {
        if (rewardedAd) {
          const adClosedListener = rewardedAd.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
            const unsubscribe = rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
                setLoaded(true);
            });
            rewardedAd.load();
            rewardedAd.show();
            return unsubscribe
        });
    
          return () => {
            adClosedListener();
          };
        }
      }, [rewardedAd]);


      useImperativeHandle(ref, () => ({
        showRewardAds() {
            console.log(rewardedAd.loaded, '<-----loaded')
            if (rewardedAd.loaded) {
                rewardedAd.show();
            }
        },

        updateAds() {
            const unsubscribe = rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
                setLoaded(true);
            });
            rewardedAd.load();
            return unsubscribe
        }

    }));
    

    // if (!loaded) {
    //     return null;
    // }

    return null;
});

export default RewardAds;
