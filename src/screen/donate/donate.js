import React from 'react';
import {Dimensions, Image, Linking, Text, TouchableOpacity, View} from 'react-native';
import style from '../../style/globalStyle';

const Donate = () => {

    const paypal = async () => {
        await Linking.openURL('https://www.paypal.me/aarm1220');
    }
    var { width, height } = Dimensions.get('window')

  return (
    <View>
      <TouchableOpacity onPress={paypal}>
        <View
          style={{
            width: '94%',
            backgroundColor: style.primaryColor,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 'auto',
            marginLeft: 'auto',
            borderRadius: 8,
            marginTop: 50,
            padding: 15,
            // marginHorizontal: 20,
            marginBottom: 20,
          }}>
          <Text style={{color: 'white', fontSize: 20, fontWeight: '800'}}>
            Paypal me
          </Text>
        </View>
      </TouchableOpacity>
        <View style={{
            borderBottomColor: 'black',
            borderBottomWidth: 0.5,
            width: width - 20,
            marginRight: 'auto',
            marginLeft: 'auto',
        }}>
        </View>
        <Text style={{marginTop: 20,color: style.primaryColor,  marginRight: 'auto', marginLeft: 'auto', fontSize: 20, fontWeight: '800'}}>
           Pay by UPI
        </Text>

        <View>
            <Image
                source={require('../../img/upi.jpeg')}
                style={{
                    height: 150,
                    width: 150,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    marginVertical: 30,
                }}
            />
        </View>
        <Text style={{color: style.primaryColor,  marginRight: 'auto', marginLeft: 'auto', fontSize: 15, fontWeight: '600'}}>
            Scan and Pay
        </Text>
    </View>
  )
}
export default Donate;
