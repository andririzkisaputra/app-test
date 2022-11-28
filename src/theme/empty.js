import React, { PureComponent } from 'react';
import { View, StyleSheet, SafeAreaView, Platform, Image } from 'react-native';
import { Layout, Text } from '@ui-kitten/components';
import layout from './styles/layout';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent : 'center',
         alignItems : 'center',
         backgroundColor : 'transparent'
    },
    img : {
      height  : 300,
      width   : 300,
      opacity : 0.7
    }
});

class Empty extends PureComponent {
    render() {
        return (
          <View style={styles.container} renderToHardwareTextureAndroid={true} shouldRasterizeIOS={true}>
              <Text style={[layout.bold, { color : '#E4E9F2' }]} category="h6">Tidak ada data</Text>
          </View>
        );
    }
}

export default Empty;
