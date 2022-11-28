import React, { Component } from 'react';
import { SectionList, View, Dimensions, Image, RefreshControl, TouchableOpacity } from 'react-native';
import { Container, Header, ListItem, Empty, Calert } from '../../theme';
import { Layout, Text, Icon, Button, Modal, Spinner } from '@ui-kitten/components';
import { connect } from 'react-redux';
import t from '../../lang';
import { setReload } from '../../root/redux/actions';
import { request, upload } from '../../bridge';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet';
import layout from '../../theme/styles/layout';
import styles from '../../theme/styles/styles';
import ActionButton from 'react-native-action-button';
import ImagePicker from 'react-native-image-crop-picker';

const BannerWidth = Dimensions.get('window').width - 32;
const BannerHeight = 130;

const IconAll = (name) => {
  return (
    <Icon style={{width: 35, color: '#8F9BB3'}} name={name.name} />
  )
}

class Properti extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isProcess    : false,
      isAlert      : false,
      isRefresh    : true,
      isBatal      : false,
      data         : [],
      menuAct      : [],
      menuKamarAct : [],
      paramsAlert  : [],
      imgAct        : [
        <Text status='danger'>{t('bClose')}</Text>,
        <ListItem
          title={t('aKamera')}
          description={t('aSubKamera')}
          descriptionStyle={layout.regular}
          onPress={this._camera}
          accessoryLeft={<Icon style={{width: 35, color: '#8F9BB3'}} name='camera-outline'/>}
        />,
        <ListItem
          title={t('aGaleri')}
          description={t('aGaleriSub')}
          descriptionStyle={layout.regular}
          onPress={this._gallery}
          accessoryLeft={<Icon style={{width: 35, color: '#8F9BB3'}} name='image-outline'/>}
        />
      ],
    }
  }

  componentDidMount = () => {
    this._getData();
  }

  componentWillUnmount = () => {
    this.props.setReload({key : 'home', value : true});
  }

  _getData = () => {
    this.setState({isProcess : true}, () => {
      request({
        'model'     : 'Properti_model',
        'key'       : 'properti_by',
        'table'     : '-',
        'where'     : {
          'created_by' : this.props.state.user.user_id,
          'role'       : this.props.state.user.role
        }
      }).then((res) => {
        if (this.props.state.user.role == '3') {
          this.setState({
            data      : res.data,
            menuAct   : [
              <Text status='danger'>{t('bClose')}</Text>,
              <ListItem
                title={t('aEdit')}
                descriptionStyle={layout.regular}
                onPress={this._edit}
                accessoryLeft={<IconAll name='edit-2-outline'/>}
              />
            ],
            isRefresh : false,
            isProcess : false
          });
        } else {
          this.setState({
            data      : res.data,
            menuAct   : [
              <Text status='danger'>{t('bClose')}</Text>,
              <ListItem
                title={t('aTambahManager')}
                descriptionStyle={layout.regular}
                onPress={this._manager}
                accessoryLeft={<IconAll name='person-add-outline'/>}
              />,
              <ListItem
                title={t('aEdit')}
                descriptionStyle={layout.regular}
                onPress={this._edit}
                accessoryLeft={<IconAll name='edit-2-outline'/>}
              />,
              <ListItem
                title={t('aHapus')}
                descriptionStyle={layout.regular}
                onPress={this._hapus}
                accessoryLeft={<IconAll name='trash-2-outline'/>}
              />
            ],
            isRefresh : false,
            isProcess : false
          });
        }
      }).catch((error) => {
        this.setState({isLoading : false, isRefresh : false, isProcess : false});
      });
    })
  }

  render() {
    return (
      <Container>
        <Header navigation={this.props.navigation} params={{
          center : (this.state.data.length  > 0 ? this.state.data[0]?.nama_properti : t('pProperti')),
          isBack : true,
          right  : (this.props.state.user.role == '3' || this.state.data.length == 0) ? null : this._right

        }}/>
        <Layout style={[layout.container, styles.containerInner]}>
          <SectionList
            keyExtractor={(item, index) => index}
            sections={this.state.data}
            renderItem={this._renderItem}
            renderSectionHeader={this._renderSectionHeader}
            contentContainerStyle={(this.state.data?.length > 0) ? null : layout.container}
            ListEmptyComponent={<Empty />}
            refreshControl={
              <RefreshControl refreshing={this.state.isRefresh} onRefresh={this._onRefresh} />
            }
            showsVerticalScrollIndicator={false}
          />
          <ActionSheet
            ref={o => this.menuSheet = o}
            title={<View style={layout.actionSheetHeader}></View>}
            options={this.state.menuAct}
            styles={layout.actionSheet}
            cancelButtonIndex={0}
          />
          { (this.state?.data?.length == 0 && this.props.state.user.role == '1') && <ActionButton onPress={this._tambah} buttonColor={layout.btnFloating}/>}
        </Layout>
        <ActionSheet
          ref={o => this.imgSheet = o}
          title={<View style={layout.actionSheetHeader}></View>}
          options={this.state.imgAct}
          styles={layout.actionSheet}
          cancelButtonIndex={0}
        />
        <Modal
          backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
          onBackdropPress={this._modalBatal}
          visible={this.state.isBatal}>
          {this._renderBatal()}
        </Modal>
        <Calert visible={this.state.isAlert} params={this.state.paramsAlert}/>
      </Container>
    )
  }

  _renderBatal = () => {
    return (
      <Layout style={{width: BannerWidth, padding: 20, borderRadius: 5}} level='3'>
        <View>
          <Text style={layout.semiBold}>Upload Bukti Pengembalian Dana</Text>
        </View>
        <TouchableOpacity onPress={this.openImg} style={{borderStyle: 'dashed', borderColor: '#b5b5b5', borderWidth: 1, borderRadius: 5, justifyContent: 'center', alignItems: 'center', height: BannerHeight, marginVertical: 10}}>
          {
            (this.state.isLoadingImg) ?
            (
              <Spinner/>
            ) : (this.state.gambar_link) ?
                <Image
                  style={{ width: 150, height: BannerHeight, borderRadius: 18}}
                  source={{
                    uri: (this.state.gambar_link) ? this.state.gambar_link : 'https://novelringan.com/wp-content/uploads/2019/02/1549963589-noimage.jpg',
                  }}
                />
              :
                <Icon style={[styles.buttonFilter, styles.textBasic, {height : 50}]} name="camera-outline"/>
          }
        </TouchableOpacity>
        <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
          <Button size='small' style={{marginHorizontal: 5}} status='basic' onPress={this._modalBatal}>Kembali</Button>
          <Button size='small' status='danger' onPress={this._checkOut}>Proses</Button>
        </View>
      </Layout>
    )
  }

  _renderItem = ({item, index}) => {
    return (
      <TouchableOpacity style={{flexDirection: 'row', marginVertical: 10}} onPress={() => this._renderMenu(item, false)}>
        <Image
          style={{ width: 110, height: 90, borderRadius: 18, justifyContent: 'center'}}
          source={{
            uri: (item?.gambar_link[0]) ? item?.gambar_link[0] : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
          }}
        />
        {
          (item.status == '1') &&
          <View style={{marginVertical: 5, marginHorizontal: 5}}>
            <Text style={[styles.title, layout.bold, {marginLeft: 10}, item.sewa ? {color: '#000000'} : {color: '#ff450d'} ]} category="s1">{item?.nomor_kamar+' - '+item.tipe_kamar}</Text>
            <Text style={[styles.title, {marginLeft: 10}]} category="c1">{(item?.sewa ? item.sewa?.nama : t('dKosong'))}</Text>
            <Text style={[styles.title, {marginLeft: 10}]} category="c1">{(item?.komplain ? 'Ada Komplain' : 'Aman')}</Text>
            <Text style={[styles.title, {marginLeft: 10}]} category="c1" appearance="hint">{'Pembersihan '+((this.state.data[0].waktu_bersih) ? this.state.data[0].waktu_bersih : '-')}</Text>
            <Text style={[styles.title, {marginLeft: 10}]} category="c1" appearance="hint">{'Ganti Sprei '+((this.state.data[0].ganti_sprei) ? this.state.data[0].ganti_sprei : '-')}</Text>
          </View>
        }
        
        {
          (item.status == '0') &&
          <View style={{marginVertical: 5, marginHorizontal: 5}}>
            <Text style={[styles.title, layout.bold, {marginLeft: 10}, item.sewa ? {color: '#000000'} : {color: '#ff450d'} ]} category="s1">{item?.nomor_kamar+' - '+item.tipe_kamar}</Text>
            <Text style={[styles.title, {marginLeft: 10}]} category="c1">{'Dalam perbaikan'}</Text>
            <Text style={[styles.title, {marginLeft: 10}]} category="c1" appearance="hint">{'Pembersihan '+((this.state.data[0].waktu_bersih) ? this.state.data[0].waktu_bersih : '-')}</Text>
            <Text style={[styles.title, {marginLeft: 10}]} category="c1" appearance="hint">{'Ganti Sprei '+((this.state.data[0].ganti_sprei) ? this.state.data[0].ganti_sprei : '-')}</Text>
          </View>
        }
      </TouchableOpacity>
    )
  }

  _renderSectionHeader = ({section, index}) => {
    if (section?.isKamar) {
      return null;
    }

    return (
      <View>
        <TouchableOpacity style={{flexDirection: 'row', marginVertical: 10, justifyContent : 'space-between'}} onPress={() => ((this.state.data[0].lantai_id == section?.lantai_id) ? this._renderMenu(section, true) : null)}>
          <Text style={[layout.bold, {marginHorizontal: 10}]}>{section?.value_lantai}</Text>
          <View style={{flexDirection : 'row', alignItems : 'center'}}>
            {
              (this.state.data[0].lantai_id == section?.lantai_id) &&
              <>
                <Text style={[layout.bold, {marginHorizontal: 10}]} status="primary">Edit</Text>
                <IconAll name='edit-2-outline'/>
              </>
            }
          </View>
        </TouchableOpacity>
        <View style={{borderWidth: 0.4, width: '100%', borderColor: '#e3e3e3'}}/>
      </View>
    )

  } 

  _renderMenu = (item, bool) => {
    let menu = [<Text status='danger'>{t('bClose')}</Text>];
    if (item.sewa && item.sewa?.status_sewa == '3') {
      console.warn(this.props.state.user.role);
      menu.push(
        <ListItem
          title={t('bInfoPenyewa')}
          descriptionStyle={layout.regular}
          onPress={this._infoPenyewa}
          accessoryLeft={<IconAll name='person-outline'/>}
        />
      );
      if (this.props.state.user.role == '1') {
        menu.push(
          <ListItem
            title={t('bCheckOut')}
            descriptionStyle={layout.regular}
            onPress={() => this._modalBatal()}
            accessoryLeft={<IconAll name='log-out-outline'/>}
          />
        );
      }
    } else if(item.sewa && item.sewa?.status_sewa != '3') {
      menu.push(
        <ListItem
          title={t('bInfoPenyewa')}
          descriptionStyle={layout.regular}
          onPress={this._infoPenyewa}
          accessoryLeft={<IconAll name='person-outline'/>}
        />
      )
    }
    if (this.props.state.user.role == '1') {
      menu.push(
        <ListItem
          title={(bool ? t('aTambahManager') : t('aInfoPembersihan'))}
          descriptionStyle={layout.regular}
          onPress={(bool ? this._manager : this._infoBersih)}
          accessoryLeft={<IconAll name={(bool ? 'person-add-outline' : 'archive-outline')}/>}
        />
      );
    } else {
      if (!bool) {
        menu.push(
          <ListItem
            title={t('aInfoPembersihan')}
            descriptionStyle={layout.regular}
            onPress={(this._infoBersih)}
            accessoryLeft={<IconAll name={(bool ? 'person-add-outline' : 'archive-outline')}/>}
          />
        );          
      }
    }
    menu.push(
      <ListItem
        title={t('aEdit')}
        descriptionStyle={layout.regular}
        onPress={this._edit}
        accessoryLeft={<IconAll name='edit-2-outline'/>}
      />,
      <ListItem
        title={t('aHapus')}
        descriptionStyle={layout.regular}
        onPress={this._hapus}
        accessoryLeft={<IconAll name='trash-2-outline'/>}
      />
    );
    this.setState({
      edit    : item,
      menuAct : menu
      
    });
    if (this.props.state.user.role == '3' || this.props.state.user.role == '1') {
      this.menuSheet.show();
    }
  }
    
  _modalBatal = () => {
    this.menuSheet.hide();
    this.setState({ isBatal : !this.state.isBatal });
  }

  _konfirmasi = () => {
    this.menuSheet.hide();
    this.setState({
      isAlert : true,
      paramsAlert : {
        title          : t('aTitleInfo'),
          message        : t('aCheckOut'),
          negativeLabel  : t('bNo'),
          positiveLabel  : t('bYes'),
          dualButton     : true,
          positiveAction : this._checkOut,
          action         : this._hideAlert
      },
      lNamaProduk : ''
    });
  }
  
  _checkOut = () => {
    this.setState({isProcess : true}, () => {
      request({
        'model'     : 'Sewa_model',
        'key'       : 'checkOutOwner',
        'table'     : '-',
        'where'     : {
          'properti_id' : this.state.edit.properti_id,
          'pemilik_id'  : this.state.edit.created_by,
          'gambar'      : this.state.gambar,
          'created_by'  : this.state.edit.sewa.user_id,
          'is_owner'    : true,
        }
      }).then((res) => {
        if (res.success) {
          this._modalBatal();
          this._onRefresh();
        } else {
          Toast.show(t('aError', {ercode : '001'}), Toast.SHORT)
        }
      }).catch((error) => {
        this.setState({isLoading : false, isRefresh : false, isProcess : false});
      });
    })
  }

  _hideAlert = () => {
    this.setState({isAlert : !this.state.isAlert});
  }

  _right = () => (
    <Button size='tiny' onPress={this._peraturanKos}>Peraturan Kos</Button>
  )
  
  _infoPenyewa = () => {
    this.menuSheet.hide();
    this.props.navigation.push('GoTo', {
      page : 'InfoPenyewa',
      params : {
        penyewa : this.state.edit?.sewa,
        action  : this._onAction
      }
    });
  }

  _manager = () => {
    this.menuSheet.hide();
    this.props.navigation.push('GoTo', {
      page : 'TambahManager',
      params : {
        properti_id : this.state.edit.properti_id,
        action      : this._onAction
      }
    });
  }

  _infoBersih = () => {
    this.menuSheet.hide();
    this.props.navigation.push('GoTo', {
      page : 'InfoBersih',
      params : {
        waktu_bersih : this.state.data[0].waktu_bersih,
        ganti_sprei  : this.state.data[0].ganti_sprei,
        properti_id  : this.state.data[0].properti_id,
        action       : this._onAction
      }
    });
  }

  _edit = () => {
    this.menuSheet.hide();
    if (this.state.edit?.kamar_id) {
      this._editKamar();
    } else {
      this._editProperti();
    }
  }

  _editProperti = () => {
    this.props.navigation.push('GoTo', {
      page : 'TambahProperti',
      params : {
        data   : this.state.data[0],
        action : this._onAction
      }
    });
  }

  _editKamar = () => {
    this.props.navigation.push('GoTo', {
      page : 'UbahKamar',
      params : {
        data   : this.state.edit,
        action : this._onAction
      }
    });
  }

  _hapus = () => {
    this.menuSheet.hide();
    if (this.state.edit?.kamar_id) {
      this._hapusKamar();
    } else {
      this._hapusProperty();
    }
  }

  _hapusProperty = () => {
    this.setState({isProcess : true}, () => {
      request({
        'model'     : 'Properti_model',
        'key'       : 'delete_properti',
        'table'     : '-',
        'where'     : {
          'properti_id' : this.state.edit.properti_id,
          'created_by'  : this.props.state.user.user_id
        }
      }).then((res) => {
        this._onRefresh();
      }).catch((error) => {
        this.setState({isLoading : false, isRefresh : false, isProcess : false});
      });
    })
  }

  _hapusKamar = () => {
    this.setState({isProcess : true}, () => {
      request({
        'model'     : 'Properti_model',
        'key'       : 'delete_kamar',
        'table'     : '-',
        'where'     : {
          'kamar_id'   : this.state.edit?.kamar_id,
          'created_by' : this.props.state.user.user_id
        }
      }).then((res) => {
        this._onRefresh();
      }).catch((error) => {
        this.setState({isLoading : false, isRefresh : false, isProcess : false});
      });
    })
  }

  openImg = () => {
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
        'key'               : 'all',
        'path'              : 'tagihan',
        'user_id'           : this.props.state.user.user_id,
        'session_upload_id' : this.state.session_upload_id,
        'image'             : response
      }).then((res) => {
        if (res.success) {
          this.setState({ gambar_link : res.preview, gambar : res.filename });
        }else {
          Toast.show(res.why, Toast.LONG);
        }
        this.setState({isLoadingImg : false});
      }).catch((error) => {
        Toast.show(t('aError', {ercode : error}));
        this.setState({isLoadingImg : false});
      });
    });

    ImagePicker.cleanSingle(response.path);
  }
  _tambah = () => {
    this.props.navigation.push('GoTo', {
      page : 'TambahProperti',
      params : {
        action : this._onAction
      }
    });
  }

  _peraturanKos = () => {
    this.props.navigation.push('GoTo', {
      page   : 'PeraturanKos',
      params : {
        properti_id : this.state.data[0].properti_id,
        action      : this._onAction
      }
    });
  }

  _onAction = () => {
    this._onRefresh();
    this.props.navigation.pop();
  }

  _onRefresh = () => {
    this.setState({
      isRefresh  : true
    }, () => {
      this._getData();
    });
  }

}

const mapStateToProps = state => ({state: state});
const mapDispatchToProps = dispatch => ({
  setReload: (data) => dispatch(setReload(data)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Properti);
