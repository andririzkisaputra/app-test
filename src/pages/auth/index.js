import React, { Component } from 'react';
import { View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Container, Header, Process } from '../../theme';
import { Layout, Text, Input, Button, Icon } from '@ui-kitten/components';
import { connect } from 'react-redux';
import { LOGO } from '../../config';
import { request } from '../../bridge';
import { validator } from '../../func';
import layout from '../../theme/styles/layout';
import styles from '../../theme/styles/styles';
import t from '../../lang';
import Toast from 'react-native-simple-toast';
import { userSet, setReload } from '../../root/redux/actions';
import { CommonActions } from '@react-navigation/native';

const IconAll = (name) => {
  return (
    <Icon style={{width: 35, color: '#8F9BB3'}} name={name.name} />
  )
}

class Login extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isProcess   : false,
      isEmail    : true,
      isPassword  : true,
      nama        : '',
      email       : '',
      password    : ''
    }
  }

  render() {
    return (
      <Container>
        <Header navigation={this.props.navigation} params={{
          center : t('pLogin'),
          isBack : true
        }}/>
        <Layout style={[layout.container, styles.containerInner]}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[layout.containerScroll, styles.loginPage]}>
            <View style={styles.loginHeader}>
              <Image style={styles.loginImg} source={LOGO}/>
              <Text style={styles.loginText}>Masuk untuk pengalaman lebih {'\n'}bersama Koszy</Text>
            </View>
            <View>
             <Input
               style={styles.loginInput}
               textStyle={styles.loginTextInput}
               placeholder='Email'
               value={this.state.email}
               onChangeText={this.onChangeEmail}
               status={(this.state.errEmail) ? 'danger' : 'basic'}
             />
             <Input
               accessoryRight={() =>
                 <TouchableOpacity onPress={this._onPassword}>
                   {
                     (this.state.isPassword) ?
                     <Icon name='eye-off-outline' style={{width: 35, color: '#8F9BB3'}}/>
                     :
                     <Icon name='eye-outline' style={{width: 35, color: '#8F9BB3'}}/>
                   }
                 </TouchableOpacity>
               }
               style={styles.loginInput}
               textStyle={styles.loginTextInput}
               placeholder={t('iPassword')}
               value={this.state.password}
               onChangeText={this.onChangePassword}
               secureTextEntry={this.state.isPassword}
               status={(this.state.errPassword) ? 'danger' : 'basic'}
             />
            </View>
            <Button style={{marginTop: 10}} status="info" disabled={(!this.state.password || !this.state.email) ? true : false} onPress={this._prosesLogin}>Login</Button>
            <TouchableOpacity activeOpacity={0.9} onPress={this._lupaKatasandi} style={styles.loginHeader}>
              <Text style={styles.loginText} status="info">Lupa kata sandi</Text>
            </TouchableOpacity>
            <Layout style={{flexDirection: 'row'}}>
              <Layout style={{width: '45%', height: 1, alignSelf: 'center'}} level='3'/>
              <Text style={{marginHorizontal:10, color: '#adadad'}}>atau</Text>
              <Layout style={{width: '45%', height: 1, alignSelf: 'center'}} level='3'/>
            </Layout>
            <TouchableOpacity activeOpacity={0.9} onPress={this._register} style={styles.loginHeader}>
              <Text style={styles.loginText} status="info">Belum punya akun ?</Text>
            </TouchableOpacity>
          </ScrollView>
        </Layout>
        <Process visible={this.state.isProcess}/>
      </Container>
    )
  }

  _onPassword = () => {
    this.setState({ isPassword : !this.state.isPassword });
  }

  onChangePassword = (text) => {
    this.setState({ password : text });
  }

  onChangeEmail = (text) => {
    this.setState({ email : text });
  }

  _lupaKatasandi = () => {
    this.props.navigation.push('GoTo', {
      page : 'LupaKataSandi',
      params : {
        action : this._onAction
      }
    })
  }

  _register = () => {
    this.props.navigation.push('GoTo', {
      page : 'Register',
      params : {
        action : this._onAction
      }
    })
  }

  _onAction = (data) => {
    this.setState({
      nama  : data.nama,
      email : data.email
    }, () => {
      this.props.navigation.pop();
    });
  }

  _prosesLogin = () => {
    this.setState({
      errEmail : (validator({ type : 'email', value : this.state.email })) ? false : true
    }, () => {
      if (!this.state.errEmail) {
        this._login();
      }
    });
  }

  _login = () => {
    this.setState({isProcess : true}, () => {
      request({
        'model'         : 'auth_model',
        'key'           : 'login',
        'table'         : '-',
        'where'         : {
          'email'    : this.state.email,
          'password' : this.state.password,
        }
      }).then((res) => {
        if (res.success) {
          if (res.data.is_verif == '1') {
            this._goToHome(res.data);
          }else {
            Toast.show(res.message, Toast.LONG);
          }
        }else {
          Toast.show(res.message, Toast.LONG);
        }
        this.setState({isProcess : false});
      }).catch((error) => {
        this.setState({isProcess : false});
      });
    })
  }

  _goToHome = (data) => {
    // if (this.props.state.user.role == data.role) {
    this.props.setReload({key : 'home', value : true});
    this.props.setReload({key : 'inform', value : true});
    this.props.setReload({key : 'komplain', value : true});
    // }
    const commonActions = CommonActions.navigate({name : 'Home'});
    this.props.navigation.dispatch(commonActions);
    this.props.userSet(data);
    Toast.show(t('aSuccessLogin', {name : data.nama}),Toast.SHORT);
  }

}

const mapStateToProps = state => ({state: state});
const mapDispatchToProps = dispatch => ({
  userSet: (data) => dispatch(userSet(data)),
  setReload: (data) => dispatch(setReload(data)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Login);
