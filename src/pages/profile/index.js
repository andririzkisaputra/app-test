import React, { Component } from 'react';
import { View, ScrollView, RefreshControl, TouchableOpacity, Image, FlatList } from 'react-native';
import { Container, Header } from '../../theme';
import { Layout, Text, Spinner, Icon, ListItem } from '@ui-kitten/components';
import { connect } from 'react-redux';
import { request, upload } from '../../bridge';
import { CommonActions } from '@react-navigation/native';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet';
import { logOut, userUpdate } from '../../root/redux/actions';
import ImagePicker from 'react-native-image-crop-picker';
import Toast from 'react-native-simple-toast';
import layout from '../../theme/styles/layout';
import styles from '../../theme/styles/styles';
import t from '../../lang';

const IconAll = (name) => {
  return (
    <Icon style={{width: 35, color: '#8F9BB3'}} name={name.name} />
  )
}

class Profile extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading : false,
      menu_user : [
        // {
        //   name    : 'Pengaturan',
        //   desc    : 'Pengaturan aplikasi Kostzy',
        //   icon    : 'settings-outline',
        //   onPress : () => this._openPage('Pengaturan')
        // },
        {
          name    : 'Ubah Profile',
          desc    : 'Ubah profile anda',
          icon    : 'edit-outline',
          onPress : () => this._openPage('EditProfile')
        },
        // {
        //   name    : 'Bantuan',
        //   desc    : 'Aplikasi Kostzy bermasalah? cari bantuan',
        //   icon    : 'question-mark-circle-outline',
        //   onPress : () => this._openPage('Bantuan')
        // },
        {
          name    : 'Laporan',
          desc    : 'Informasi laporan',
          icon    : 'file-text-outline',
          onPress : () => this._openPage('Laporan')
        },
        {
          name    : 'Adjustment',
          desc    : 'Adjustment laporan',
          icon    : 'file-outline',
          onPress : () => this._openPage('Adjustment')
        },
        {
          name    : 'Telat Bayar',
          desc    : 'List Anak Kos Telat Bayar',
          icon    : 'book-outline',
          onPress : () => this._openPage('Tagihan')
        },
        {
          name    : 'Tentang',
          desc    : 'Tentang aplikasi Kostzy',
          icon    : 'info-outline',
          onPress : () => this._openPage('TentangTab')
        },
        {
          name    : 'Logout',
          desc    : 'Keluar dari aplikasi',
          icon    : 'log-out-outline',
          onPress : this._logout
        },
      ],
      imgAct        : [
        <Text status='danger'>{t('bClose')}</Text>,
        <ListItem
          title={t('aKamera')}
          description={t('aSubKamera')}
          descriptionStyle={layout.regular}
          onPress={this._camera}
          accessoryLeft={<IconAll name='camera-outline'/>}
          key={1}
        />,
        <ListItem
          title={t('aGaleri')}
          description={t('aGaleriSub')}
          descriptionStyle={layout.regular}
          onPress={this._gallery}
          accessoryLeft={<IconAll name='image-outline'/>}
          key={2}
        />
      ],
      isSewa    : false,
      lastKamar : []
    }
  }

  componentDidMount = () => {
    if (this.props.state.user.role == '2') {
      let menu = this.state.menu_user;
      menu.splice(1, 3);
      this.setState({ menu_user : menu });
    }
  }

  render() {
    return (
      <Container>
        <Header navigation={this.props.navigation} params={{
          center : t('pProfile'),
          isBack : false
        }}/>
        <Layout style={[layout.container, styles.containerInner]}>
          {
            (this.state.isLoading) ?
            (
              <View style={layout.spinner}>
                <Spinner/>
              </View>
            ) : (
              <FlatList
                data={this.state.menu_user}
                renderItem={this._renderItem}
                keyExtractor={item => item.id}
                ListHeaderComponent={this._header}
              />
            )
          }
        </Layout>
        <ActionSheet
          ref={o => this.imgSheet = o}
          title={<View style={layout.actionSheetHeader}></View>}
          options={this.state.imgAct}
          styles={layout.actionSheet}
          cancelButtonIndex={0}
        />
      </Container>
    )
  }

  _header = () => {
    return (
      <View style={styles.containerHeader}>
        <View style={styles.containerHeaderLeft}>
          <TouchableOpacity style={styles.containerHeaderIcon} activeOpacity={0.9} onPress={this._photoProf}>
            {
              (this.state.isLoadingImg) ?
              (
                <Spinner status='basic'/>
              ) : (
                <>
                  {
                    (this.props.state.user.user_img) ?
                    (<Image style={styles.iconAvatarProfileImg} source={{uri : this.props.state.user.user_img_preview}} />) :
                    (<Icon style={styles.iconAvatarProfile} name="person-outline"/>)
                  }
                </>
              )
            }
          </TouchableOpacity>
          <View style={[styles.containerTextHeader, {width: '100%'}]}>
            <Text style={[layout.bold, {marginBottom : 4}]} numberOfLines={1}>{this.props.state.user.nama}</Text>
            <Text category="c2" appearance="hint">{this.props.state.user.email}</Text>
          </View>
        </View>
        {
          // <TouchableOpacity onPress={this._edit} style={styles.containerIconHome1}>
          //   <Icon style={styles.iconHeaderRight} name="edit-outline"/>
          // </TouchableOpacity>
        }
      </View>
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

  _photoProf = () => {
    this.imgSheet.show();
  }

  _camera = () => {
    this.imgSheet.hide();
    ImagePicker.openCamera({
        mediaType : 'photo',
        cropping  : true,
    }).then(image => {
      let explode  = image.path.split('/');
      let fileName = explode[explode.length-1];
      this._uploadImage({
        'type'     : image.mime,
        'path'     : image.path,
        'uri'      : image.path,
        'fileName' : fileName
      });
    });
  }

  _gallery = () => {
    this.imgSheet.hide();
    ImagePicker.openPicker({
        mediaType             : 'photo',
        compressImageQuality  : 0.9,
        cropping              : true
    }).then(image => {
      let explode  = image.path.split('/');
      let fileName = explode[explode.length-1];
      this._uploadImage({
        'type'     : image.mime,
        'path'     : image.path,
        'uri'      : image.path,
        'fileName' : fileName
      });
    });
  }

  _uploadImage = (response) => {
    this.setState({isLoadingImg : true}, () => {
      upload({
        'key'               : 'profile',
        'user_id'           : this.props.state.user.user_id,
        'image'             : response
      }).then((res) => {
        if (res.success) {
          this.props.userUpdate([
            {key : 'user_img', value : res.filename},
            {key : 'user_img_preview', value : res.preview},
          ]);
        }else {
          Toast.show(res.why, Toast.LONG);
        }
        this.setState({isLoadingImg : false});
      }).catch((error) => {
        Toast.show(t('aError', {ercode : error}), Toast.LONG);
        this.setState({isLoadingImg : false});
      });
    });

    ImagePicker.cleanSingle(response.path);
  }

  _edit = () => {
    this.props.navigation.push('GoTo', {
      page : 'EditProfile'
    })
  }

  _openPage = (page) => {
    this.props.navigation.push('GoTo', {
      page : page,
      params : {
        checkIn  : false,
        checkOut : false,
        data :  {
          'sewa.status_sewa' : '8',
        },
        title : 'Telat Bayar'
      }
    })
  }

  _logout = () => {
    this.props.logOut();
    const commonActions = CommonActions.navigate({name : 'Home'});
    this.props.navigation.dispatch(commonActions);
  }

  _onRefresh = () => {
    this.setState({isRefresh : true}, () => {
      this.getData()
    })
  }

}

const mapStateToProps = state => ({state: state});
const mapDispatchToProps = dispatch => ({
  logOut: (data) => dispatch(logOut(data)),
  userUpdate: (data) => dispatch(userUpdate(data))
});
export default connect(mapStateToProps, mapDispatchToProps)(Profile);
