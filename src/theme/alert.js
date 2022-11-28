import React, { PureComponent } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Platform } from 'react-native';
import { Avatar, Spinner, Modal, Layout, Text, Button, Input } from '@ui-kitten/components';
import t from '../lang';

class Calert extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      textValue : ''
    }
  }

  componentDidUpdate = (state) => {
    if (!state.visible) {
      this.setState({textValue : ''});
    }
  }

  render() {
    const { visible, params } = this.props;
    return (
      <Modal
        backdropStyle={styles.backdrop}
        onBackdropPress={(params.BgNotDismis) ? null : params.action}
        visible={visible}>
        <TouchableWithoutFeedback onPress={this._unFocus}>
          {this._renderModalElement()}
        </TouchableWithoutFeedback>
      </Modal>
    )
  }

  _renderModalElement = () => {
    const { visible, params } = this.props;
    return (
      <Layout style={styles.modalContainer}>
        <Text category='h6' style={styles.alertTitleInfo}>{(params.title) ? params.title : t('aTitleInfo')}</Text>
        <Text category='s1' style={styles.alertMsg}>{params.message}</Text>

        {
          (params.isInput) && (
            <Input
              label={(params.iLabel) ? params.iLabel : ''}
              placeholder={(params.iPlaceholder) ? params.iPlaceholder : 'Input text here'}
              style={[params.iStyle, styles.paddingVertical]}
              textStyle={[params.iTextStyle, styles.inputStyle, (Platform.OS == 'ios' ? ((params.iMultiline) ? styles.inputStyleIos : null) : null)]}
              keyboardType={params.iKeyboard}
              value={(this.state.textValue) ? (this.state.textValue == '-' ? '' : this.state.textValue) : this.props.params?.iValue}
              onChangeText={this._changeText}
              autoCapitalize={(params.iCaps) ? params.iCaps : 'none'}
              status={(params.iStatus) ? params.iStatus : 'basic'}
              caption={(params.iCaption) ? params.iCaption : ''}
              multiline={(params.iMultiline) ? params.iMultiline : false}
              ref={(o) => this.inputGen = o}
            />
          )
        }

        {
          (params.hint) && (<Text category='c2' style={styles.alertMsg} appearance="hint">{params.hint}</Text>)
        }

        {
          (!params.hideButton) && (
            <View style={styles.buttonAlert}>
              <Button
                  status={(params.negativeFill ? params.negativeFill : "basic")}
                  size='small'
                  onPress={(params.negativeAction) ? params.negativeAction : params.action}>
                    {(params.negativeLabel) ? params.negativeLabel : t('bNo')}
              </Button>

              {
                (params.dualButton) ?
                (
                  <Button
                      status={(params.positiveFill ? params.positiveFill : "primary")}
                      size='small'
                      style={{marginLeft : 10}}
                      onPress={() => {((params.dontClose) ? null : params.action());params.positiveAction();}}>
                      {(params.positiveLabel) ? params.positiveLabel : t('bYes')}
                  </Button>
                ) : null
              }
            </View>
          )
        }
      </Layout>
    )
  }

  _changeText = (text) => {
    this.setState({textValue : (text ? text : '-')}, () => {
      this.props.params.iChange(text);
    });
  }

  _unFocus = () => {
    if (this.inputGen) {
      this.inputGen.blur();
    }
  }

}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalContainer: {
    justifyContent: 'center',
    // alignItems: 'center',
    width: 300,
    padding: 16,
    borderRadius : 10
  },
  alertTitleInfo : {
    paddingBottom : 10,
    borderBottomWidth : 1,
    width : '100%',
    borderColor : '#f0f0f0'
  },
  alertMsg : Platform.select({
    ios: {
      paddingVertical: 10,
      fontFamily: 'opensans-regular',
      fontWeight : '400'
    },
    android: {
      paddingVertical: 10,
      fontFamily: 'opensans-regular'
    }
  }),
  buttonAlert : {
    flexDirection : 'row',
    justifyContent : 'flex-end',
    borderTopWidth : 1,
    borderColor : '#f0f0f0',
    paddingTop : 10
  },
  inputStyle : Platform.select({
    ios: undefined,
    android: {
      paddingVertical: 0,
      fontFamily:'opensans-regular'
    },
  }),
  paddingVertical : {
    paddingVertical : 12
  },
  inputStyleIos : {
    paddingTop : 0
  }
});

export default Calert;
