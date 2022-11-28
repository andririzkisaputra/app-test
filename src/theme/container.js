import React, { PureComponent } from 'react';
import { View, StyleSheet, SafeAreaView, Platform, KeyboardAvoidingView } from 'react-native';
import { PropTypes } from 'prop-types';
import OfflineNotice from './offlineNotice';

const propTypes = {
    children: PropTypes.node.isRequired,
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

class Container extends PureComponent {
    render() {
        return (
          <SafeAreaView style={[{flex: 1}, (Platform.OS === 'ios' ? {marginTop:20} : null)]}>
            {
              (Platform.OS == 'ios') ?
              (
                <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
                  { this._renderContent() }
                </KeyboardAvoidingView >
              ) : this._renderContent()
            }
          </SafeAreaView>
        );
    }

    _renderContent = () => (
      <View style={styles.container} renderToHardwareTextureAndroid={true} shouldRasterizeIOS={true}>
          {this.props.children}
          <OfflineNotice />
      </View>
    )
}

Container.propTypes = propTypes;
export default Container;
