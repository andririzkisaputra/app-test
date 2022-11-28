import React, { PureComponent } from 'react';
import { View, Dimensions } from 'react-native';
import { Text } from '@ui-kitten/components';
import NetInfo from '@react-native-community/netinfo';
import layout from './styles/layout';
import t from '../lang';

const { width } = Dimensions.get('window');

function MiniOfflineSign() {
  return (
    <View style={[layout.offlineContainer, {width : width}]}>
      <Text style={layout.offlineText} category="c2">{t('aNoConnetion')}</Text>
    </View>
  );
}

class OfflineNotice extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isConnected: true
    }

    this.unsubscribe = null;
  }

  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({isConnected : state.isConnected});
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  render() {
    if (!this.state.isConnected) {
      return <MiniOfflineSign />;
    }

    return null;
  }
}

export default OfflineNotice;
