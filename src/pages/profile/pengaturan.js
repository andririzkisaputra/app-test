import React, { Component } from 'react';
import { View, ScrollView, RefreshControl, TouchableOpacity, Image, FlatList } from 'react-native';
import { Container, Header } from '../../theme';
import { Layout, Text, Spinner, Icon, ListItem } from '@ui-kitten/components';
import { connect } from 'react-redux';
import { request, upload } from '../../bridge';
import { CommonActions } from '@react-navigation/native';
import { logOut, userUpdate, setReload } from '../../root/redux/actions';
import Toast from 'react-native-simple-toast';
import layout from '../../theme/styles/layout';
import styles from '../../theme/styles/styles';
import t from '../../lang';

const IconAll = (name) => {
  return (
    <Icon style={{width: 35, color: '#8F9BB3'}} name={name.name} />
  )
}

class Pengaturan extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading : false,
      menu_user : [
        {
          name    : 'Ubah Profile',
          desc    : 'Ubah profile anda',
          icon    : 'edit-outline',
          onPress : () => this._openPage('EditProfile')
        },
        {
          name    : 'Logout',
          desc    : 'Keluar dari aplikasi',
          icon    : 'log-out-outline',
          onPress : this._logout
        },
      ]
    }
  }

  componentDidMount = () => {

  }

  render() {
    return (
      <Container>
        <Header navigation={this.props.navigation} params={{
          center : t('pPengaturan'),
          isBack : true
        }}/>
        <Layout style={[layout.container, styles.containerInner]}>
          <FlatList
            data={this.state.menu_user}
            renderItem={this._renderItem}
            keyExtractor={item => item.id}
          />
        </Layout>
      </Container>
    )
  }

  _renderItem = ({item}) => {
    return (
      <ListItem
        title={item.name}
        description={item.desc}
        accessoryLeft={(style) => <Icon style={style.style} name={item.icon}/>}
        onPress={item.onPress}
      />
    )
  }

  _openPage = (page) => {
    this.props.navigation.push('GoTo', {
      page : page
    })
  }

  _logout = () => {
    this.props.setReload([
      {key : 'home', value : true},
      {key : 'profile', value : true},
    ]);
    this.props.logOut();
    const commonActions = CommonActions.navigate({name : 'Home'});
    this.props.navigation.dispatch(commonActions);
  }

}

const mapStateToProps = state => ({state: state});
const mapDispatchToProps = dispatch => ({
  logOut: (data) => dispatch(logOut(data)),
  userUpdate: (data) => dispatch(userUpdate(data)),
  setReload: (data) => dispatch(setReload(data)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Pengaturan);
