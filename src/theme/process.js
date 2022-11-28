import React, { PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import { Layout, Modal, Text, Spinner} from '@ui-kitten/components';

export default class Process extends PureComponent {

  constructor(props) {
    super(props);
  }

  render() {
    const { visible } = this.props;
    return (
      <Modal
        backdropStyle={styles.backdrop}
        visible={(visible) ? visible : false} >
        { this.renderModalElement() }
      </Modal>
    );
  }

  renderModalElement = () => {
    return (
      <Layout level='3' style={styles.modalContainer}>
        <View style={{flexDirection : 'row', justifyContent : 'center', alignItems : 'center'}}>
          <Spinner />
          <Text style={{paddingLeft : 10}}>Processing...</Text>
        </View>
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    minHeight: 256,
    padding: 16,
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 256,
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderRadius : 10
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
