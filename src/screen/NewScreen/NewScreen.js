import React, {useState} from 'react';
import {
  ScrollView,
  Text,
  Image,
  View,
  StyleSheet,
  TextInput,
  Pressable,
  Clipboard,
  TouchableOpacity,
  ActivityIndicator,
  Share,
  Dimensions,
} from 'react-native';
import FileViewer from 'react-native-file-viewer';
import {useToast} from 'react-native-toast-notifications';
import axios from 'axios';
import RNFetchBlob from 'rn-fetch-blob';
import BannerAds from '../ads/bannerAds';
import style from '../../style/globalStyle';
import InterAds from '../ads/interstitialAds';
import RewardAds from '../ads/rewardAds';

const NewScreen = ({navigation}) => {
  var {width, height} = Dimensions.get('window');
  const toast = useToast();
  const childRef = React.useRef();
  const childRefInterAds = React.useRef();
  const [link, setLink] = useState('');
  const [filePath, setFilePath] = useState('');
  const [disableDownload, setDisableDownload] = useState(false);
  const [thumb, setThumb] = React.useState('');
  const [downloadableUrl, setDownloadableUrl] = React.useState({urls: []});
  const [showLoader, setShowLoader] = React.useState(false);
  const [downloadComplete, setDownloadComplete] = React.useState(false);
  const [retry, setRetry] = React.useState(false);

  const pasteClipboard = async () => {
    const text = await Clipboard.getString();
    if (
      text.includes('youtube') ||
      text.includes('you') ||
      text.includes('youtu.be')
    ) {
      toast.show('Youtube video can not download', {
        type: 'danger',
        animationType: 'zoom-in',
      });
    } else {
      setShowLoader(true);
      setLink(text);
      if (text.includes('facebook') && text.includes('reel')) {
        //// Facebook reels download
        const formData = new FormData();
        formData.append('q', text);
        formData.append('vt', 'facebook');
        const config = {
          headers: {
            Referer: 'https://www.fbvideodown.com/',
            // "Content-Type": `multipart/form-data; boundary=${formData._parts}`/////; charset=utf-8;
          },
          timeout: 5000,
        };
        axios
          .get(
            `https://api.fbvideodown.com/st-tik-video/fb/dl?url=${text}`,
            config,
          )
          .then(res => {
            setShowLoader(false);
            let data = {
              thumbnail:
                res?.data?.result?.fbBos[0]?.cover ||
                res?.data?.result?.fbBos[0]?.thumb,
              urls: [res?.data?.result?.fbBos[0]?.url],
              caption: res?.data?.result?.fbBos[0]?.id,
            };
            setRetry(false);
            setDownloadableUrl(data);
            setThumb(
              res?.data?.result?.fbBos[0]?.cover ||
                res?.data?.result?.fbBos[0]?.thumb,
            );
          })
          .catch(error => {
            setShowLoader(false);
            setRetry(true);
            toast.show('Please re-try again', {
              type: 'danger',
              animationType: 'zoom-in',
            });
            console.log('error-------------->', error.response);
          });
        // axios.post("https://yt5s.io/api/ajaxSearch/facebook", formData, config).then(response => {
        //     console.log(response, '<---------res')
        //     setShowLoader(false);
        //     if (Object.keys(response?.data?.links)?.length) {
        //       let data = {
        //         thumbnail: response?.data?.thumbnail,
        //         urls: Object.values(response?.data?.links),
        //         caption: response?.data?.title
        //       }
        //       setRetry(false);
        //       setDownloadableUrl(data);
        //       setThumb(response?.data?.thumbnail);
        //     } else {
        //       setRetry(true);
        //       toast.show('Please re-try again', {
        //         type: 'danger',
        //         animationType: 'zoom-in',
        //       });
        //     }
        //   }
        // )
        // .catch(error => {
        //   setShowLoader(false);
        //   setRetry(true);
        //   toast.show('Please re-try again', {
        //     type: 'danger',
        //     animationType: 'zoom-in',
        //   });
        //   console.log('error-------------->', error.response);
        // });
      } else {
        axios
          .get(`https://instadownloaderaarm.vercel.app/api/video?url=${text}`)
          .then(response => {
            setShowLoader(false);
            if (response?.data?.data?.videoUrl?.length) {
              let data = {
                thumbnail: response?.data?.data?.thumb,
                urls: [response?.data?.data?.videoUrl],
                caption: response?.data?.data?.filename,
              };
              setRetry(false);
              setDownloadableUrl(data);
              setThumb(response?.data?.data?.thumb);
            } else {
              setRetry(true);
              toast.show('Please re-try again', {
                type: 'danger',
                animationType: 'zoom-in',
              });
            }
          })
          .catch(error => {
            setShowLoader(false);
            setRetry(true);
            toast.show('Please re-try again', {
              type: 'danger',
              animationType: 'zoom-in',
            });
            console.log('error', error.response);
          });
      }
    }
  };

  const downloadVideo = async () => {
    let dirs = RNFetchBlob.fs.dirs;
    childRefInterAds.current.updateAds();
    childRef.current.updateAds();
    childRefInterAds.current.showInterstitialAds();
    // return
    let downloadname =
      downloadableUrl?.caption?.substring(0, 10) || 'AllforVideo';
    let mydirs = RNFetchBlob.fs.dirs.DownloadDir;
    let checkdir = await RNFetchBlob.fs.isDir(`${mydirs}/AllForYou`);
    if (!checkdir) {
      RNFetchBlob.fs
        .mkdir(`${mydirs}/AllForYou`)
        .then(res => {
          console.log('created', res);
        })
        .catch(error => {
          console.log('Error', error);
        });
    } else {
      console.log('Dir existss');
    }
    childRef.current.showRewardAds();
    toast.show('Download start check in notification', {
      type: 'success',
      animationType: 'zoom-in',
    });
    setDisableDownload(true);
    RNFetchBlob.config({
      fileCache: true,
      path: `${dirs.DownloadDir}/${downloadname}.mp4`,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        mediaScannable: true,
        title: `${downloadname}.mp4`,
        path: `${dirs.DownloadDir}/AllForYou/${downloadname}.mp4`,
      },
    })
      .fetch(
        'GET',
        downloadableUrl?.urls[0],
        {'Content-Type': 'octet-stream'},
        'base64DataString',
      )
      .progress((received, total) => {
        console.log('progress', received / total);
      })
      .then(res => {
        setDownloadComplete(true);
        setFilePath(res.path());
        setDisableDownload(false);
        console.log('The file saved to ', res.path());
      })
      .catch(e => {
        setRetry(true);
        setDisableDownload(false);
        setDownloadComplete(true);
        console.log(e);
      });
  };

  const downloadAnotherVideo = () => {
    setDownloadComplete(false);
    setLink('');
    setDownloadableUrl({urls: []});
    setThumb('');
    setRetry(false);
    childRef.current.updateAds();
    childRefInterAds.current.showInterstitialAds();
  };

  const openDownloadedVideo = async () => {
    childRef.current.updateAds();
    childRefInterAds.current.showInterstitialAds();
    RNFetchBlob.android.actionViewIntent(filePath, 'video/mp4');
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        title: 'App link',
        message:
          'Please install this app for download social media app , AppLink :https://play.google.com/store/apps/details?id=com.allforyou',
        url: 'https://play.google.com/store/apps/details?id=com.allforyou',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <View style={{backgroundColor: 'white', flex: 1, padding: 10}}>
      <RewardAds ref={childRef} />
      <InterAds ref={childRefInterAds} />
      {!link?.length ? (
        <>
          <Image
            source={require('../../img/logoicon.png')}
            style={{
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: 10,
              height: 65,
              width: 65,
            }}
          />
          {/* <Image
             source={require('../../img/logo.png')}
            style={{ height: 50 }}
            resizeMode={"contain"}
          /> */}
          <Text
            style={[
              styles.center,
              {marginTop: 10, fontSize: 24, fontWeight: '400'},
            ]}>
            Social Media
          </Text>
          <Text
            style={[
              styles.center,
              {
                fontSize: 24,
                fontWeight: '700',
                color: style?.primaryColor,
              },
            ]}>
            Video Downloader
          </Text>

          <Text
            style={[
              styles.center,
              {
                fontSize: 14,
                fontWeight: '400',
                color: '#686868',
                textAlign: 'center',
              },
            ]}>
            Download Videos, Photos, Reels, Stories and IGTV from social media
            platform
          </Text>

          {/* <Image
            source={require('../../img/social_icon.png')}
            style={{marginLeft: 'auto', marginRight: 'auto', marginTop: 20}}
          /> */}
        </>
      ) : null}

      {retry && !downloadComplete ? (
        <TouchableOpacity onPress={downloadAnotherVideo}>
          <View
            style={{
              backgroundColor: style?.primaryColor,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 'auto',
              borderRadius: 8,
              marginTop: 10,
              padding: 15,
              // marginHorizontal: 20,
              marginBottom: 10,
            }}>
            <Text style={{color: 'white', fontSize: 10, fontWeight: '400'}}>
              Back
            </Text>
          </View>
        </TouchableOpacity>
      ) : null}

      {!downloadComplete ? (
        <View style={[styles.sectionStyle, {marginTop: 30}]}>
          <TextInput
            style={{flex: 1, width: '100%', color: 'black', paddingLeft: 15}}
            placeholder="Paste Your Link Here"
            underlineColorAndroid="transparent"
            value={link}
            onChange={e => setLink(e.target.value)}
          />
          <View style={[styles.imageStyle]}>
            <Pressable onPress={pasteClipboard}>
              <Image
                source={require('../../img/paste.png')}
                // style={styles.imageStyle}
              />
            </Pressable>
          </View>
        </View>
      ) : null}

      {!link?.length ? (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Donate');
          }}>
          <Image
            source={require('../../img/donate.png')}
            style={{
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: height - 450,
            }}
          />
        </TouchableOpacity>
      ) : null}

      {showLoader ? (
        <TouchableOpacity>
          {/*<View*/}
          {/*  style={{*/}
          {/*    width: '94%',*/}
          {/*    backgroundColor: style?.primaryColor,*/}
          {/*    alignItems: 'center',*/}
          {/*    justifyContent: 'center',*/}
          {/*    marginRight: 'auto',*/}
          {/*    marginLeft: 'auto',*/}
          {/*    borderRadius: 8,*/}
          {/*    marginTop: 10,*/}
          {/*    padding: 15,*/}
          {/*    // marginHorizontal: 20,*/}
          {/*    marginBottom: 10,*/}
          {/*  }}>*/}
          <ActivityIndicator size="large" />
          {/*</View>*/}
        </TouchableOpacity>
      ) : null}

      {downloadableUrl?.urls[0] &&
      downloadableUrl?.urls[0].length &&
      !downloadComplete ? (
        <>
          {thumb && thumb?.length ? (
            <View
              style={{
                flex: 1,
                width: '94%',
                marginRight: 'auto',
                marginLeft: 'auto',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white',
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.5,
                shadowRadius: 4,
                elevation: 3,
              }}>
              <Image
                source={{
                  uri: thumb,
                }}
                style={{
                  flex: 1,
                  width: '100%',
                }}
              />
            </View>
          ) : null}

          {!disableDownload ? (
            <TouchableOpacity onPress={downloadVideo}>
              <View
                style={{
                  width: '94%',
                  backgroundColor: style?.primaryColor,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 'auto',
                  marginLeft: 'auto',
                  borderRadius: 8,
                  marginTop: 10,
                  padding: 15,
                  // marginHorizontal: 20,
                  marginBottom: 60,
                }}>
                <Text style={{color: 'white', fontSize: 20, fontWeight: '800'}}>
                  Download Now
                </Text>
                {/*<ActivityIndicator size="large" />*/}
              </View>
            </TouchableOpacity>
          ) : (
            <View
              style={{
                width: '94%',
                backgroundColor: style?.primaryColor,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 'auto',
                marginLeft: 'auto',
                borderRadius: 8,
                marginTop: 10,
                padding: 15,
                marginBottom: 60,
              }}>
              <Text style={{color: 'white', fontSize: 16, fontWeight: '600'}}>
                Downloading Please wait....
              </Text>
            </View>
          )}
        </>
      ) : null}

      {downloadComplete ? (
        <View style={{marginTop: 30}}>
          <View
            style={{
              width: '94%',
              backgroundColor: 'white',
              borderWidth: 1,
              borderColor: '#DEF1FF',
              height: 54,
              borderRadius: 5,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Image
              source={{
                uri: thumb,
              }}
              style={{
                height: 54,
                width: 54,
              }}
            />
            <Text style={{fontSize: 16, fontWeight: '500', marginLeft: 30}}>
              {downloadableUrl?.caption?.substring(0, 20) || 'Instagram'}
            </Text>
          </View>

          <View style={{marginTop: 40}}>
            <Image
              source={require('../../img/complete_icon.png')}
              style={{
                width: 120,
                height: 120,
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: 10,
              }}
            />
            <Text
              style={[
                styles.center,
                {
                  fontSize: 15,
                  fontWeight: '700',
                  color: style?.primaryColor,
                },
              ]}>
              Download Completed 😊
            </Text>
          </View>
          <View style={{marginTop: 60}}>
            <TouchableOpacity onPress={openDownloadedVideo}>
              <View
                style={{
                  width: '94%',
                  backgroundColor: style?.primaryColor,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 'auto',
                  marginLeft: 'auto',
                  borderRadius: 8,
                  marginTop: 10,
                  padding: 15,
                  // marginHorizontal: 20,
                  marginBottom: 10,
                }}>
                <Text style={{color: 'white', fontSize: 20, fontWeight: '800'}}>
                  Open Video
                </Text>
                {/*<ActivityIndicator size="large" />*/}
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={downloadAnotherVideo}>
              <View
                style={{
                  width: '94%',
                  backgroundColor:
                    'linear-gradient(184.65deg, #93ECB7 -49.16%, rgba(104, 176, 103, 0.99) 90.94%), linear-gradient(0deg, #DEF1FF, #DEF1FF)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 'auto',
                  marginLeft: 'auto',
                  borderRadius: 8,
                  marginTop: 10,
                  padding: 15,
                  // marginHorizontal: 20,
                  marginBottom: 10,
                }}>
                <Text style={{color: 'white', fontSize: 20, fontWeight: '800'}}>
                  Download Another Video
                </Text>
                {/*<ActivityIndicator size="large" />*/}
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={onShare}>
              <View
                style={{
                  width: '94%',
                  backgroundColor: style?.primaryColor,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 'auto',
                  marginLeft: 'auto',
                  borderRadius: 8,
                  marginTop: 10,
                  padding: 15,
                  // marginHorizontal: 20,
                  marginBottom: 10,
                }}>
                <Text style={{color: 'white', fontSize: 20, fontWeight: '800'}}>
                  Share the App
                </Text>
                {/*<ActivityIndicator size="large" />*/}
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Donate');
              }}>
              <Image
                source={require('../../img/donate.png')}
                style={{
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  marginVertical: 60,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      ) : null}

      <BannerAds />
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  sectionStyle: {
    flexDirection: 'row',
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#DEF1FF',
    height: 54,
    borderRadius: 5,
    margin: 10,
    border: '2px solid #DEF1FF',
    // shadowColor: '#CDD8FF80',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  imageStyle: {
    padding: 10,
    margin: 5,
    height: 45,
    width: 45,
    borderRadius: 5,
    resizeMode: 'stretch',
    alignItems: 'center',
    backgroundColor: style?.primaryColor,
  },
});
export default NewScreen;
