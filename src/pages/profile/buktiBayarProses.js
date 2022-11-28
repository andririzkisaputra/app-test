import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Container, Header, ListItem, Process } from '../../theme';
import { Layout, Text, Icon, Input, Select, SelectItem, BottomNavigation, Button, Spinner } from '@ui-kitten/components';
import { connect } from 'react-redux';
import t from '../../lang';
import { request, upload } from '../../bridge';
import { formatDate } from '../../func';
import layout from '../../theme/styles/layout';
import styles from '../../theme/styles/styles';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';

const BannerWidth = Dimensions.get('window').width - 32;
const BannerHeight = 130;

class BuktiBayarProses extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoadingImg : false,
      isProcess    : false,
      isPassword   : true,
      disabled     : true,
      rekening     : [],
      data         : [],
      imgAct       : [
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

  _getData = () => {
    request({
      'model' : 'Sewa_model',
      'key'   : 'getDataProses',
      'table' : '-',
      'where' : {
        pemilik_id : this.props.params.sewa?.pemilik_id
      }
    }).then((res) => {
      this.setState({
        data     : res.data,
        rekening : res.data.rekening,
      });
      this.setState({isLoading : false});
    }).catch((error) => {
      this.setState({isLoading : false});
    });
  }

  render() {
    return (
      <Container>
        <Header navigation={this.props.navigation} params={{
          center : t('pBuktiBayarProses'),
          isBack : true
        }}/>
        <Layout style={layout.container}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {
              (this.state.isLoading) ?
              (
                <View style={layout.spinner}>
                  <Spinner/>
                </View>
              ) : this._renderContainer()
            }
          </ScrollView>
        </Layout>

        <BottomNavigation appearance="noIndicator">
          <Button style={{margin : 10}} disabled={(!this.state.nama_pengirim || !this.state.value_rekening || !this.state.gambar_link ? true : false)} onPress={this._onSubmit}>{'Kirim Bukti'}</Button>
        </BottomNavigation>
        <ActionSheet
          ref={o => this.imgSheet = o}
          title={<View style={layout.actionSheetHeader}></View>}
          options={this.state.imgAct}
          styles={layout.actionSheet}
          cancelButtonIndex={0}
        />
        <Process visible={this.state.isProcess}/>
      </Container>
    )
  }

  _renderContainer = () => {
    return (
      <View style={styles.containerList}>
        <View style={[styles.containerHeader, {justifyContent: 'flex-start'}]}>
        {
          (this.state.data?.gambar_link) &&
          <Image style={{height: '100%', width: 100, resizeMode: "contain"}} source={{uri : this.state.data?.gambar_link}} />
        }
          <View style={{marginHorizontal: 20, justifyContent: 'space-around', height: 70}}>
            <Text style={layout.bold} category="p1">{this.state.data?.no_rekening}</Text>
            <Text style={layout.regular} category="p2">{this.state.data?.pemilik}</Text>
            <Text style={layout.regular} category="p2" appearance="hint">{this.state.data?.nama_bank}</Text>
          </View>
        </View>
        <Input
          accessoryRight={() =>
            <Icon style={{width: 35, color: '#8F9BB3'}} name='edit-2-outline'/>
          }
          style={styles.registerInput}
          textStyle={styles.loginTextInput}
          placeholder={'Nama Pengirim'}
          value={this.state.nama_pengirim}
          onChangeText={this.onChangePengirim}
          status={(this.state.errEmail) ? 'danger' : 'basic'}
        />
        <Select
          accessoryRight={() =>
            <Icon style={{width: 35, color: '#8F9BB3'}} name='menu-2-outline'/>
          }
          style={styles.registerInput}
          textStyle={styles.loginTextInput}
          value={this.state.value_rekening}
          placeholder={'Rekening'}
          onSelect={this.onChangeRekening}>
            {this.state.rekening.map(this._renderOption)}
        </Select>
        <Text category="c2" appearance="hint">{'Foto Bukti Bayar'}</Text>
        <View style={{flex: 1, alignItems: 'center'}}>
          <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 10, height: 150, width: BannerWidth, borderWidth: 2, borderRadius: 18, borderStyle: 'dashed',  borderColor: (this.state.errGambar ? 'red' : '#ebeef5')}} onPress={this.openImg}>
            {
              (this.state.isLoadingImg) ?
              (
                <Spinner/>
              ) : (
                this.state.gambar_link ?
                (
                  <Image
                    style={{ width: 150, height: 150, borderRadius: 18}}
                    source={{
                      uri: (this.state.gambar_link) ? this.state.gambar_link : 'https://novelringan.com/wp-content/uploads/2019/02/1549963589-noimage.jpg',
                    }}
                  />
                ) : (
                  <Icon style={{height: 80, color: '#8F9BB3'}} name='credit-card-outline'/>
                )
              )
            }
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  onChangePengirim = (text) => {
    this.setState({ nama_pengirim : text })
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
        'user_id'           : '0',
        'image'             : response
      }).then((res) => {
        if (res.success) {
          this.setState({ gambar_link : res.preview, gambar : res.filename });
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

  _renderOption = (title) => {
    return (
      <SelectItem title={title.nama_bank}/>
    )
  };

  _onSubmit = () => {
    this.setState({isProcess : true}, () =>{
      request({
        'model' : 'Sewa_model',
        'key'   : 'simpanPembayaran',
        'table' : '-',
        'data'  : {
          'sewa_id'       : this.props.params.sewa?.sewa_id,
          'nama_pengirim' : this.state.nama_pengirim,
          'gambar'        : this.state.gambar,
          'rekening_id'   : this.state.rekening_id,
        }
      }).then((res) => {
        if (this.props.params?.isSewa) {
          this.props.navigation.pop();
        } else {
          this.props.params.action();
        }
        this.setState({isProcess : false});
      }).catch((error) => {
        this.setState({isLoading : false});
      });
    })
  }

  onChangeRekening = (row) => {
    this.setState({
      value_rekening : this.state.rekening[row.row].nama_bank,
      rekening_id    : this.state.rekening[row.row].rekening_id,
      nomor_rekening : this.state.rekening[row.row].nomor_rekening,
    });
  };

}

const mapStateToProps = state => ({state: state});
const mapDispatchToProps = dispatch => ({

});
export default connect(mapStateToProps, mapDispatchToProps)(BuktiBayarProses);
