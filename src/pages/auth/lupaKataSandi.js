import React, { Component } from 'react';
import { useRef, ScrollView, TouchableOpacity, useEffect } from 'react-native';
import { Container, Header, Process } from '../../theme';
import { Layout, Text, Input, Button, Icon } from '@ui-kitten/components';
import { connect } from 'react-redux';
import { request } from '../../bridge';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import layout from '../../theme/styles/layout';
import styles from '../../theme/styles/styles';
import t from '../../lang';
import Toast from 'react-native-simple-toast';

const DEFAULT_TIMER = 59;

class LupaKataSandi extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isProcess      : false,
      isNomorHp      : false,
      isPassword     : false,
      isTampil       : false,
      isPasswordBaru : true,
      isPasswordKonf : true,
      user           : '',
      nomor          : '',
      password_baru  : '',
      konfirmasi     : '',
      timer          : DEFAULT_TIMER
    }
  }

  componentDidUpdate = () => {
    if(this.state.timer === 0){
      clearInterval(this.interval);
    }
  }
  
  _setIntervalCode = () => {
    this.interval = setInterval(
      () => this.setState((prevState)=> ({ timer: prevState.timer - 1 })),
      1000
    );
  }

  render() {
    return (
      <Container>
        <Header navigation={this.props.navigation} params={{
          center : 'Lupa Kata Sandi',
          isBack : true
        }}/>
        <Layout style={[layout.container, styles.containerInner]}>
          {
            (!this.state.isTampil) ? 
              (this.state.isNomorHp) ?
                this._renderOtp()
              :
                (this.state.isPassword) ? 
                  this._renderPassword()
                :
                  this._renderNomor()
            : 
              null
          }
        </Layout>
        <Process visible={this.state.isProcess}/>
      </Container>
    )
  }

  _renderPassword = () => { 
    return(
      <Layout>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.pinContainer}>
          <Text category="h6" style={layout.bold}>Masukan Password Baru kamu</Text>
            <Input
              accessoryRight={() =>
                <TouchableOpacity onPress={this._onPasswordBaru}>
                  {
                    (this.state.isPasswordBaru) ?
                    <Icon name='eye-off-outline' style={{width: 35, color: '#8F9BB3'}}/>
                    :
                    <Icon name='eye-outline' style={{width: 35, color: '#8F9BB3'}}/>
                  }
                </TouchableOpacity>
              }
              style={styles.loginInput}
              textStyle={styles.loginTextInput}
              placeholder='Password Baru'
              value={this.state.password_baru}
              onChangeText={this.onChangePasswordBaru}
              secureTextEntry={this.state.isPasswordBaru}
            />
            <Input
              accessoryRight={() =>
                <TouchableOpacity onPress={this._onPasswordKonf}>
                  {
                    (this.state.isPasswordKonf) ?
                    <Icon name='eye-off-outline' style={{width: 35, color: '#8F9BB3'}}/>
                    :
                    <Icon name='eye-outline' style={{width: 35, color: '#8F9BB3'}}/>
                  }
                </TouchableOpacity>
              }
              style={styles.loginInput}
              textStyle={styles.loginTextInput}
              placeholder='Konfirmasi Password'
              value={this.state.isPasswordKonf}
              onChangeText={this.onChangePasswordKonf}
              secureTextEntry={this.state.isPasswordKonf}
            />
            <Button style={{marginTop: 10}} status="info" disabled={(!this.state.password_baru || !this.state.konfirmasi || this.state.password_baru != this.state.konfirmasi) ? true : false} onPress={this._submitPassword}>Simpan</Button>
        </ScrollView>
      </Layout>
    )
  }

  _onPasswordBaru = () => {
    this.setState({ isPasswordBaru : !this.state.isPasswordBaru });
  }

  _onPasswordKonf = () => {
    this.setState({ isPasswordKonf : !this.state.isPasswordKonf });
  }

  _renderNomor = () => { 
    return(
      <Layout>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.pinContainer}>
          <Text category="h6" style={layout.bold}>Masukan Nomor HP kamu</Text>
            <Input
              style={styles.loginInput}
              textStyle={styles.loginTextInput}
              placeholder='Nomor'
              value={this.state.nomor}
              onChangeText={this.onChangeNomor}
              status={(this.state.errNomor) ? 'danger' : 'basic'}
              keyboardType={'phone-pad'}
            />
            <Button style={{marginTop: 10}} status="info" disabled={(this.state.nomor.length < 10) ? true : false} onPress={this._setCode}>Kirim OTP</Button>
        </ScrollView>
      </Layout>
    )
  }

  _renderOtp = () => {
    return (
      <Layout>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.pinContainer}>
          <Text category="h6" style={layout.bold}>Verifikasi OTP</Text>
          <Text>Kode OTP sudah dikirim ke whatsapp dan email mu</Text>
          <OTPInputView
            style={{height: 100}}
            pinCount={6}
            autoFocusOnLoad
            codeInputFieldStyle={styles.loginUnderlineStyleBase}
            codeInputHighlightStyle={styles.loginUnderlineStyleHighLighted}
            onCodeFilled={this._submitCode}
            placeholderCharacter={'x'}
            placeholderTextColor={'#f0f0f0'}
          />
          <TouchableOpacity onPress={(this.state.timer == 0) ? this._setCode : null}>
            <Text style={[layout.bold, styles.btnKirim, (this.state.timer == 0) ? {color: '#60B8D6'} : {color: '#000000'}]}>Kirim Ulang({this.state.timer})</Text>
          </TouchableOpacity>
        </ScrollView>
      </Layout>
    )
  }

  _setCode = () => {
    this.setState({isProcess : true, timer : DEFAULT_TIMER}, () => {
      request({
        'model'    : 'auth_model',
        'key'      : 'setCode',
        'table'    : '-',
        'where'    : {
          'notelp' : this.state.nomor
        }
      }).then((res) => {
        if (res.success) {
          clearInterval(this.interval);
          this._setIntervalCode();
          this.setState({
            isNomorHp : true,
            user      : res.data
          })
        } else {
          Toast.show('Nomor Tidak Terdaftar', Toast.LONG);
        }
        this.setState({isProcess : false});
      }).catch((error) => {
        this.setState({isProcess : false});
      });
    })
  }

  _submitCode = (code) => {
    this.setState({isProcess : true}, () => {
      request({
        'model'         : 'auth_model',
        'key'           : 'checkCode',
        'table'         : '-',
        'where'         : {
          'user_id' : this.state.user.user_id,
          'code'    : code
        }
      }).then((res) => {
        if (res.success) {
          this.setState({
            isNomorHp  : !this.state.isNomorHp,
            isPassword : !this.state.isPassword
          })
        }else {
          Toast.show(t('aGagalOTP'), Toast.LONG);
        }
        this.setState({isProcess : false});
      }).catch((error) => {
        this.setState({isProcess : false});
      });
    })
  }

  _submitPassword = () => {
    this.setState({isProcess : true}, () => {
      request({
        'model'      : 'auth_model',
        'key'        : 'setPasswordBaru',
        'table'      : '-',
        'data'       : {
          'password' : this.state.password_baru
        },
        'where'      : {
          'user_id'  : this.state.user.user_id
        }
      }).then((res) => {
        if (res.success) {
          this.setState({isTampil : !this.state.isTampil})
          this.props.params.action({
            'email'    : this.state.user.email,
            'password' : this.state.password_baru
          });
        }else {
          Toast.show('Gagal', Toast.LONG);
        }
        this.setState({isProcess : false});
      }).catch((error) => {
        this.setState({isProcess : false});
      });
    })
  }

  onChangeNomor = (text) => {
    this.setState({ nomor : text });
  }

  onChangePasswordBaru = (text) => {
    this.setState({ password_baru : text });
  }

  onChangePasswordKonf = (text) => {
    this.setState({ konfirmasi : text });
  }

}

const mapStateToProps = state => ({state: state});
const mapDispatchToProps = dispatch => ({
  userSet: (data) => dispatch(userSet(data))
});
export default connect(mapStateToProps, mapDispatchToProps)(LupaKataSandi);
