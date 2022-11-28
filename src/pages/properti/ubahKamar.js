import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import { Container, Header, ListItem, Button } from '../../theme';
import { Layout, Text, Icon, Input, Select, SelectItem, BottomNavigation, Spinner } from '@ui-kitten/components';
import { connect } from 'react-redux';
import t from '../../lang';
import layout from '../../theme/styles/layout';
import { request, upload } from '../../bridge';
import { formatCur } from '../../func';
import styles from '../../theme/styles/styles';
import Toast from 'react-native-simple-toast';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';

const IconAll = (data) => {
  return (
    <Icon style={{width: 35, color: data.color}} name={data.name} />
  )
}

class UbahKamar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isProcess       : false,
      gambar_link     : [],
      fasilitas_kamar : [],
      fasilitas       : [],
      jumlah_lantai   : [],
      data_kamar      : [],
      tipe_kamar      : [],
      master_status   : ['Perbaikan', 'Tersedia'],
      data_tipe_kamar : [],
      value_kamar     : '',
      value_lantai    : '',
      value_status    : '',
      nama_properti   : '',
      lantai          : '',
      nomor_kamar     : '',
      harga_kamar     : '',
      session_upload_id : '',
      imgAct            : [
        <Text status='danger'>{t('bClose')}</Text>,
        <ListItem
          title={t('aKamera')}
          description={t('aSubKamera')}
          descriptionStyle={layout.regular}
          onPress={this._camera}
          accessoryLeft={<IconAll color='#8F9BB3' name='camera-outline'/>}
        />,
        <ListItem
          title={t('aGaleri')}
          description={t('aGaleriSub')}
          descriptionStyle={layout.regular}
          onPress={this._gallery}
          accessoryLeft={<IconAll color='#8F9BB3' name='image-outline'/>}
        />
      ]
    }

  }

  componentDidMount = () => {
    this._getData();
  }

  _getData = () => {
    request({
      'model' : 'properti_model',
      'key'   : 'get_add_needed',
      'table' : '-',
    }).then((res) => {
      let data = [{
        master_fasilitas_kamar_id : '0',
        fasilitas_kamar           : 'Pilih Semua',
        check                     : false
      }];
      this.props.params.data.fasilitas_kamar.map((item, index) => {
        data.push({
          master_fasilitas_kamar_id : item.master_fasilitas_kamar_id,
          fasilitas_kamar           : item.fasilitas_kamar,
          check                     : item.check
        });
      })
      this.setState({
        session_upload_id : this.props.params.data.session_upload_id,
        nomor_kamar       : this.props.params.data.nomor_kamar,
        harga_kamar       : (this.props.params.data.harga) ? formatCur({value:this.props.params.data.harga.split('.').join(''), input:true}) : '',
        gambar_link       : this.props.params.data.gambar_link,
        value_kamar       : this.props.params.data.tipe_kamar,
        value_lantai      : this.props.params.data.value_lantai,
        lantai            : this.props.params.data.lantai,
        tipe_kamar        : this.props.params.data.tipe_kamar_id,
        // data_kamar        : this.props.params.data.data_kamar,
        kamar_id          : this.props.params.data.kamar_id,
        status            : this.props.params.data.status,
        value_status      : this.state.master_status[this.props.params.data.status],
        data_tipe_kamar   : res.data.data_tipe_kamar,
        fasilitas_kamar   : data,
        isLoading         : false
      });
      for (var i = 1; i <= this.props.params.data.jumlah_lantai; i++) {
        this.setState({ jumlah_lantai : [...this.state.jumlah_lantai, 'Lantai '+i]});
      }
    }).catch((error) => {
      this.setState({isLoading : false});
    });
  }

  render() {
    return (
      <Container>
        <Header navigation={this.props.navigation} params={{
          center : t('pUbahKamar'),
          isBack : true
        }}/>
        <Layout style={[layout.container, styles.containerInner]}>
          <ScrollView showsVerticalScrollIndicator={false} style={styles.containerList}>
          <Text category="c2" appearance="hint">{t('iGambarKamar')}</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity style={{ marginVertical: 10, width: 90, padding: 30, borderWidth: 2, borderRadius: 18, borderStyle: 'dashed',  borderColor: (this.state.errGambar ? 'red' : '#ebeef5')}} onPress={this.openImg} disabled={(this.props.state.user.role == '3') ? true : false}>
              {
                (this.state.isLoadingImg) ?
                (
                  <Spinner status='basic'/>
                ) : (
                  <IconAll color='#60b8d6' name='plus-outline' />
                )
              }
            </TouchableOpacity>
            <FlatList
              horizontal
              data={this.state.gambar_link}
              renderItem={this._renderItem}
              showsHorizontalScrollIndicator={false}
            />
          </View>
          <Select
            accessoryRight={() =>
              <IconAll color='#8F9BB3' name='menu-2-outline'/>
            }
            style={styles.registerInput}
            textStyle={styles.loginTextInput}
            value={this.state.value_status}
            placeholder={t('iStatus')}
            status={(this.state.errLantai) ? 'danger' : 'basic'}
            onSelect={this._onChangeStatus}
            disabled={(this.props.state.user.role == '3') ? true : false}>
            {this.state.master_status.map(this._renderOption)}
          </Select>
          <Select
            accessoryRight={() =>
              <IconAll color='#8F9BB3' name='menu-2-outline'/>
            }
            style={styles.registerInput}
            textStyle={styles.loginTextInput}
            value={this.state.value_kamar}
            placeholder={t('iTipeKamar')}
            status={(this.state.errTipeKamar) ? 'danger' : 'basic'}
            onSelect={this._onChangeTipeKamar}
            disabled={(this.props.state.user.role == '3') ? true : false}>
            {this.state.data_tipe_kamar.map(this._renderOptionTipeKamar)}
          </Select>
          <Select
            accessoryRight={() =>
              <IconAll color='#8F9BB3' name='menu-2-outline'/>
            }
            style={styles.registerInput}
            textStyle={styles.loginTextInput}
            value={this.state.value_lantai}
            placeholder={t('iLantai')}
            status={(this.state.errLantai) ? 'danger' : 'basic'}
            onSelect={this._onChangeLantai}
            disabled={(this.props.state.user.role == '3') ? true : false}>
            {this.state.jumlah_lantai.map(this._renderOption)}
          </Select>
          <Input
            accessoryRight={() =>
              <IconAll color='#8F9BB3' name='edit-2-outline'/>
            }
            style={styles.registerInput}
            textStyle={styles.loginTextInput}
            placeholder={t('iNomorKamar')}
            value={this.state.nomor_kamar}
            onChangeText={this._onChangeNomorKamar}
            status={(this.state.errNomorKamar) ? 'danger' : 'basic'}
            keyboardType={'numeric'}
            disabled={(this.props.state.user.role == '3') ? true : false}
          />
          <FlatList
            nestedScrollEnabled
            style={[styles.listFasilitas, {borderColor: (this.state.errFasilitas ? 'red' : '#ebeef5')}]}
            data={this.state.fasilitas_kamar}
            renderItem={this._renderItemFasilitas}
            showsVerticalScrollIndicator={false}
          />
          <Input
            accessoryRight={() =>
              <IconAll color='#8F9BB3' name='edit-2-outline'/>
            }
            style={styles.registerInput}
            textStyle={styles.loginTextInput}
            placeholder={t('iHargaKamar')}
            value={this.state.harga_kamar}
            onChangeText={this._onChangeHargaKamar}
            keyboardtipe={'numeric'}
            status={(this.state.errHargaKamar) ? 'danger' : 'basic'}
            disabled={(this.props.state.user.role == '3') ? true : false}
          />
          </ScrollView>
          <BottomNavigation appearance="noIndicator">
            <Button style={{marginVertical : 10}} onPress={this._onSubmit} disabled={(this.props.state.user.role == '3') ? true : false}>{t('bSubmit')}</Button>
          </BottomNavigation>
          <ActionSheet
            ref={o => this.imgSheet = o}
            title={<View style={layout.actionSheetHeader}></View>}
            options={this.state.imgAct}
            styles={layout.actionSheet}
            cancelButtonIndex={0}
          />
        </Layout>
      </Container>
    )
  }
  // proses
  _onSubmit = () => {
    let data           = [];
    let nama_fasilitas = [];
    this.state.fasilitas_kamar.map((item, index) => {
      if (item.master_fasilitas_kamar_id != '0' && item.check) {
        data.push({
          master_fasilitas_kamar_id : item.master_fasilitas_kamar_id,
          kamar_id                  : this.state.kamar_id,
          created_by                : this.props.state.user.user_id,
        });
      }
    });
    this.setState({
      errGambar      : (this.state.gambar_link.length > 0 ? false : true),
      errTipeKamar   : (this.state.value_kamar ? false : true),
      errLantai      : (this.state.value_lantai ? false : true),
      errNomorKamar  : (this.state.nomor_kamar ? false : true),
      errFasilitas   : (data.length > 0 ? false : true),
      errHargaKamar  : (this.state.harga_kamar ? false : true),
    }, () => {
      if (
        !this.state.errTipeKamar &&
        !this.state.errLantai &&
        !this.state.errNomorKamar &&
        !this.state.errHargaKamar &&
        !this.state.errFasilitas &&
        !this.state.errGambar
      ) {
        let params = {
          'properti_id'       : this.props.params.data.properti_id,
          'session_upload_id' : this.state.session_upload_id,
          'lantai'            : this.state.lantai,
          'harga_kamar'       : this.state.harga_kamar.split('.').join(''),
          'gambar_link'       : this.state.gambar_link,
          'fasilitas_kamar'   : data,
          'tipe_kamar'        : this.state.tipe_kamar,
          'value_kamar'       : this.state.value_kamar,
          'nomor_kamar'       : this.state.nomor_kamar,
          'value_lantai'      : this.state.value_lantai,
          'status'            : this.state.status.toString(),
          'kamar_id'          : this.state.kamar_id,
          'created_by'        : this.props.state.user.user_id,
        }
        this.setState({isProcess : true}, () => {
          request({
            'model'     : 'Properti_model',
            'key'       : 'ubah_kamar',
            'table'     : '-',
            'data'      : {
              'kamar' : params,
            }
          }).then((res) => {
            Toast.show(t('aUbahKamar'), Toast.SHORT);
            this.props.params.action();
          }).catch((error) => {
            this.setState({isLoading : false, isRefresh : false, isProcess : false});
          });
        })
      }

    });
  }
  // end proses

  // input
  _onChangeTipeKamar = (select) => {
    this.setState({ tipe_kamar : this.state.data_tipe_kamar[select.row].tipe_kamar_id, value_kamar : this.state.data_tipe_kamar[select.row].tipe_kamar });
  }

  _onChangeLantai = (select) => {
    this.setState({ lantai : select.row+1, value_lantai : this.state.jumlah_lantai[select.row] });
  }

  _onChangeStatus = (select) => {
    this.setState({ status : select.row, value_status : this.state.master_status[select.row] });
  }

  _onChangeNomorKamar = (text) => {
    this.setState({ nomor_kamar : text });
  }

  _onChangeHargaKamar = (text) => {
    this.setState({ harga_kamar : formatCur({value:text.split('.').join(''), input:true}) });
  }

  _onChangeFasilitas = (select) => {
    let data = [];
    select.map((item, index) => {
      data.push(this.state.fasilitas_kamar[item.row].fasilitas_kamar)
    })
    this.setState({ fasilitas : select, value_kamar : data.join(', ')});
  }

  _onCheck = (item, isCheck) => {
    let data = [];
    this.state.fasilitas_kamar.map((value, key) => {
      if (value.master_fasilitas_kamar_id == item.master_fasilitas_kamar_id) {
        data.push({
          master_fasilitas_kamar_id : value.master_fasilitas_kamar_id,
          fasilitas_kamar           : value.fasilitas_kamar,
          check                     : !value.check
        });
      } else {
        if (item.master_fasilitas_kamar_id == '0') {
          if (item.check) {
            data.push({
              master_fasilitas_kamar_id : value.master_fasilitas_kamar_id,
              fasilitas_kamar           : value.fasilitas_kamar,
              check                     : false
            });
          } else {
            data.push({
              master_fasilitas_kamar_id : value.master_fasilitas_kamar_id,
              fasilitas_kamar           : value.fasilitas_kamar,
              check                     : true
            });
          }
        } else {
          if (value.check) {
            data.push({
              master_fasilitas_kamar_id : value.master_fasilitas_kamar_id,
              fasilitas_kamar           : value.fasilitas_kamar,
              check                     : true
            });
          } else {
            data.push({
              master_fasilitas_kamar_id : value.master_fasilitas_kamar_id,
              fasilitas_kamar           : value.fasilitas_kamar,
              check                     : false
            });
          }
        }
      }
    })
    this.setState({ fasilitas_kamar : data });
  }
  // end input

  // render

  _renderItemFasilitas = ({item, index}) => {
    return(
      <TouchableOpacity style={styles.itemFasilitas} onPress={() => this._onCheck(item, false)} disabled={(this.props.state.user.role == '3') ? true : false}>
        <IconAll color={(item.check) ? '#60b8d6' : '#8F9BB3'} name={(item.check) ? 'checkmark-square-outline' : 'square-outline'}/>
        <Text>{item.fasilitas_kamar}</Text>
      </TouchableOpacity>
    )
  }

  _renderOption = (title) => (
    <SelectItem title={title.fasilitas_kamar}/>
  );

  _renderOptionTipeKamar = (title) => (
    <SelectItem title={title.tipe_kamar}/>
  );

  _renderOption = (title) => (
    <SelectItem title={title}/>
  );

  _renderItem = ({item, index}) => {
    return(
      <TouchableOpacity style={styles.imgRemoveIconContainer} onPress={() => { this._removeImg(item, index) }} disabled={(this.props.state.user.role == '3') ? true : false}>
        <Image
          style={{ width: 90, height: 90, borderRadius: 18, marginLeft: 10}}
          source={{
            uri: item,
          }}
        />
      </TouchableOpacity>
    )
  }
  // end render

  // ActionSheet
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
        'path'              : 'kamar',
        'user_id'           : this.props.state.user.user_id,
        'session_upload_id' : this.state.session_upload_id,
        'image'             : response
      }).then((res) => {
        if (res.success) {
          this.setState({ gambar_link: [...this.state.gambar_link, res.preview] })
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

  _removeImg = (item, index) => {
    var listImgOld = [...this.state.gambar_link];
    listImgOld.splice(index, 1);
    this.setState({gambar_link: listImgOld});

    this.timerHandle = setTimeout(() => {
      request({
        'key'   : 'removeImg',
        'table' : 'produk',
        'where' : {
          'file_name'         : item,
          'session_upload_id' : this.state.session_upload_id,
          'user_id'           : this.props.state.user.user_id
        },
      });
    }, 0);
  }
  // end ActionSheet

}

const mapStateToProps = state => ({state: state});
const mapDispatchToProps = dispatch => ({

});
export default connect(mapStateToProps, mapDispatchToProps)(UbahKamar);
