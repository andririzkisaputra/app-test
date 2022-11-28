import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity, Image, FlatList, BackHandler } from 'react-native';
import { Container, Header, ListItem, Calert, Button, Process } from '../../theme';
import { Layout, Text, Input, Icon, Select, SelectItem, BottomNavigation, CheckBox, Spinner } from '@ui-kitten/components';
import { connect } from 'react-redux';
import { request, upload } from '../../bridge';
import t from '../../lang';
import layout from '../../theme/styles/layout';
import styles from '../../theme/styles/styles';
import { formatCur, formatDate } from '../../func';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';
import Toast from 'react-native-simple-toast';
import RNDateTimePicker from '@react-native-community/datetimepicker';

const IconAll = (date) => {
  return (
    <Icon style={{width: 35, color: date.color}} name={date.name} />
  )
}

class TambahProperti extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading      : true,
      isParkirMobil  : false,
      isParkirMotor  : false,
      isCheck        : false,
      isAlert        : false,
      isTanggal      : false,
      isWaktu        : false,
      isSprei        : false,
      dataKamar      : [],
      paramsAlert    : [],
      fasilitas_umum : [],
      fasilitas      : [],
      dataChack      : [],
      gambar_link    : [],
      hapus_kamar    : [],
      nama_properti  : '',
      kota           : '',
      alamat         : '',
      jumlah_lantai  : '',
      value_umum     : '',
      tambahan_biaya : '',
      imgAct         : [
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

  UNSAFE_componentWillMount = () => {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));
  }

  handleBackButton = () => {
    if (this.props.navigation.isFocused()) {
      this.setState({
          isAlert : true,
          paramsAlert : {
            title          : t('aTitleInfo'),
            message        : t('aPeringatanKembali'),
            negativeLabel  : t('bNo'),
            positiveLabel  : t('bYes'),
            dualButton     : true,
            positiveAction : this._goBack,
            action         : this._hideAlert
        },
        lNamaProduk : ''
      });
      return true;
    }
  }

  _getData = () => {
    if (this.props.params.data) {
      request({
        'model' : 'properti_model',
        'key'   : 'get_add_needed',
        'table' : '-',
        'where' : {
          'properti_id' : this.props.params.data.properti_id
        },
      }).then((res) => {
        let data = [{
          master_fasilitas_umum_id : '0',
          fasilitas_umum           : 'Pilih Semua',
          check                    : false
        }];
        res.data.properti.fasilitas_umum.map((item, index) => {
          data.push({
            master_fasilitas_umum_id : item.master_fasilitas_umum_id,
            fasilitas_umum           : item.fasilitas_umum,
            check                    : item.check
          });
        })
        this.setState({
          nama_properti      : res.data.properti.nama_properti,
          fasilitas_umum     : data,
          lantai_id          : res.data.properti.lantai_id,
          isParkirMotor      : res.data.properti.isParkirMotor,
          isParkirMobil      : res.data.properti.isParkirMobil,
          parkir_motor       : (res.data.properti.harga_parkir_motor) ? formatCur({value:res.data.properti.harga_parkir_motor.split('.').join(''), input:true}) : '',
          parkir_mobil       : (res.data.properti.harga_parkir_mobil) ? formatCur({value:res.data.properti.harga_parkir_mobil.split('.').join(''), input:true}) : '',
          tambahan_biaya     : (res.data.properti.tambahan_biaya) ? formatCur({value:res.data.properti.tambahan_biaya.split('.').join(''), input:true}) : '',
          properti_id        : res.data.properti.properti_id,
          session_upload_id  : res.data.properti.session_upload_id,
          gambar_link        : res.data.properti.gambar_link,
          kota               : res.data.properti.kota,
          alamat             : res.data.properti.alamat,
          // bersih             : res.data.properti.waktu_pembersihan,
          // sprei              : res.data.properti.tanggal_ganti_sprei,
          jumlah_lantai      : res.data.properti.lantai_id.length.toString(),
          dataKamar          : res.data.properti.dataKamar,
          created_by         : res.data.properti.created_by,
          deposit            : (res.data.properti.deposit) ? formatCur({value:res.data.properti.deposit.split('.').join(''), input:true}) : '',
        });
        this.setState({isLoading : false});
      }).catch((error) => {
        this.setState({isLoading : false});
      });
    }else {
      request({
        'model' : 'properti_model',
        'key'   : 'get_add_needed',
        'table' : '-',
      }).then((res) => {
        let data = [{
          master_fasilitas_umum_id : '0',
          fasilitas_umum           : 'Pilih Semua',
          check                    : false
        }];
        res.data.fasilitas_umum.map((item, index) => {
          data.push({
            master_fasilitas_umum_id : item.master_fasilitas_umum_id,
            fasilitas_umum           : item.fasilitas_umum,
            check                    : item.check
          });
        })
        this.setState({
          fasilitas_umum    : data,
          session_upload_id : res.data.session_upload_properti
        });
        this.setState({isLoading : false});
      }).catch((error) => {
        this.setState({isLoading : false});
      });
    }
  }

  render() {
    return (
      <Container>
        <Header navigation={this.props.navigation} params={{
          center : t('pTambahProperti'),
          isAlert : this.handleBackButton,
          isBack : true
        }}/>
        <Layout style={[layout.container, styles.containerInner]}>
          <ScrollView showsVerticalScrollIndicator={false} style={styles.containerList}>
            {
              (this.state.isLoading) ?
              (
                <View style={layout.spinner}>
                  <Spinner/>
                </View>
              ) : this._renderContainer()
            }
          </ScrollView>
          <BottomNavigation appearance="noIndicator">
            <Button style={{marginVertical : 10}} onPress={this._onSubmit} disabled={this.state.isLoading ? true : false}>{t('bSubmit')}</Button>
          </BottomNavigation>
          <ActionSheet
            ref={o => this.imgSheet = o}
            title={<View style={layout.actionSheetHeader}></View>}
            options={this.state.imgAct}
            styles={layout.actionSheet}
            cancelButtonIndex={0}
          />
          <Calert visible={this.state.isAlert} params={this.state.paramsAlert}/>
        </Layout>
        {
          (this.state.isTanggal) &&
          <RNDateTimePicker minimumDate={new Date('2021-03-01')} maximumDate={new Date('2021-03-31')} value={new Date('2021-03-01')} onChange={this._onTanggal}/>
        }
        {
          (this.state.isWaktu) &&
          <RNDateTimePicker mode="time" timeZoneOffsetInSeconds={60} value={new Date()} onChange={this._onWaktu}/>
        }
        {
          (this.state.isSprei) &&
          <RNDateTimePicker mode="date" minimumDate={new Date('2021-03-01')} maximumDate={new Date('2021-03-31')} value={new Date('2021-03-01')} onChange={this._onTanggalSprei}/>
        }
        <Process visible={this.state.isProcess}/>
      </Container>
    )
  }

  _renderContainer = () => {
    return (
      <Layout>
        <Text category="c2" appearance="hint">{t('iGambarProperti')}</Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity style={[styles.imgList , {borderColor: (this.state.errGambar ? 'red' : '#ebeef5')}]} onPress={this.openImg} disabled={(this.props.state.user.role == '3') ? true : false}>
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
        <Input
          accessoryRight={() =>
            <IconAll color='#8F9BB3' name='edit-2-outline'/>
          }
          style={styles.registerInput}
          textStyle={styles.loginTextInput}
          placeholder={t('iNamaProperti')}
          value={this.state.nama_properti}
          onChangeText={this._onChangeNamaProperti}
          status={(this.state.errNamaProperti) ? 'danger' : 'basic'}
          disabled={(this.props.state.user.role == '3') ? true : false}
        />
        <Input
          accessoryRight={() =>
            <IconAll color='#8F9BB3' name='edit-2-outline'/>
          }
          style={styles.registerInput}
          textStyle={styles.loginTextInput}
          placeholder={t('iKota')}
          value={this.state.kota}
          onChangeText={this._onChangeKota}
          status={(this.state.errKota) ? 'danger' : 'basic'}
          disabled={(this.props.state.user.role == '3') ? true : false}
        />
        <Input
          accessoryRight={() =>
            <IconAll color='#8F9BB3' name='edit-2-outline'/>
          }
          multiline
          style={styles.registerInput}
          textStyle={styles.alamatInput}
          placeholder={t('iAlamat')}
          value={this.state.alamat}
          onChangeText={this._onChangeAlamat}
          status={(this.state.errAlamat) ? 'danger' : 'basic'}
          disabled={(this.props.state.user.role == '3') ? true : false}
        />
        <FlatList
          nestedScrollEnabled
          style={[styles.listFasilitas, {borderColor: (this.state.errFasilitas ? 'red' : '#ebeef5')}]}
          data={this.state.fasilitas_umum}
          renderItem={this._renderItemFasilitas}
          showsVerticalScrollIndicator={false}
        />
        {
          // <TouchableOpacity style={[styles.containerInputBersih, {borderColor: (this.state.errBersih ? 'red' : '#eef1f7')}]} onPress={this._onBersih}>
          //   <Text numberOfLines={1} style={[styles.loginTextInput, {paddingVertical: 10, marginLeft: 20, color: (this.state.bersih) ? '#000000' : '#909cb3'}]}>{(this.state.bersih) ? this.state.bersih : t('iBersih')}</Text>
          //   <IconAll color='#8F9BB3' name='menu-2-outline'/>
          // </TouchableOpacity>
          // <TouchableOpacity style={[styles.containerInputBersih, {borderColor: (this.state.errBersih ? 'red' : '#eef1f7')}]} onPress={this._onSprei}>
          //   <Text style={[styles.loginTextInput, {paddingVertical: 10, marginLeft: 20, color: (this.state.sprei) ? '#000000' : '#909cb3'}]}>{(this.state.sprei) ? this.state.sprei : t('iSprei')}</Text>
          //   <IconAll color='#8F9BB3' name='menu-2-outline'/>
          // </TouchableOpacity>
        }
        <Input
          accessoryRight={() =>
            <IconAll color='#8F9BB3' name='edit-2-outline'/>
          }
          style={styles.registerInput}
          textStyle={styles.loginTextInput}
          placeholder={t('iBiayaTambahan')}
          value={this.state.tambahan_biaya}
          onChangeText={this._onChangeBiayaTambahan}
          keyboardType={'numeric'}
          status={(this.state.errBiayaTambahan) ? 'danger' : 'basic'}
          disabled={(this.props.state.user.role == '3') ? true : false}
        />
        <Input
          accessoryRight={() =>
            <IconAll color='#8F9BB3' name='edit-2-outline'/>
          }
          style={styles.registerInput}
          textStyle={styles.loginTextInput}
          placeholder={t('iDeposit')}
          value={this.state.deposit}
          onChangeText={this._onChangeDeposit}
          keyboardType={'numeric'}
          status={(this.state.errDeposit) ? 'danger' : 'basic'}
          disabled={(this.props.state.user.role == '3') ? true : false}
        />
        {
          (this.state.isParkirMobil) &&
          <Input
            accessoryRight={() =>
              <IconAll color='#8F9BB3' name='edit-2-outline'/>
            }
            style={styles.registerInput}
            textStyle={styles.loginTextInput}
            placeholder={t('iHargaParkirMobil')}
            value={this.state.parkir_mobil}
            onChangeText={this._onChangeHargaParkirMobil}
            keyboardType={'numeric'}
            status={(this.state.errMobil) ? 'danger' : 'basic'}
            disabled={(this.props.state.user.role == '3') ? true : false}
          />
        }
        {
          (this.state.isParkirMotor) &&
          <Input
            accessoryRight={() =>
              <IconAll color='#8F9BB3' name='edit-2-outline'/>
            }
            style={styles.registerInput}
            textStyle={styles.loginTextInput}
            placeholder={t('iHargaParkirMotor')}
            value={this.state.parkir_motor}
            onChangeText={this._onChangeHargaParkirMotor}
            keyboardType={'numeric'}
            status={(this.state.errMotor) ? 'danger' : 'basic'}
            disabled={(this.props.state.user.role == '3') ? true : false}
          />
        }
        <Input
          accessoryRight={() =>
            <IconAll color='#8F9BB3' name='edit-2-outline'/>
          }
          style={styles.registerInput}
          textStyle={styles.loginTextInput}
          placeholder={t('iJumlahLantai')}
          value={this.state.jumlah_lantai}
          onChangeText={this._onChangeJumlahLantai}
          keyboardType={'numeric'}
          disabled={(this.state.dataKamar.length > 0 ? true : false)}
          status={(this.state.errLantai) ? 'danger' : 'basic'}
        />
        {
          (this.state.jumlah_lantai > 0) &&
          <TouchableOpacity style={{borderWidth: 1, borderRadius: 18, borderColor: (this.state.errKamar ? 'red' : '#eef1f7'), backgroundColor: '#f7f9fc', marginVertical: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}} onPress={this._tambahKamar}>
            <Text style={[styles.loginTextInput, {paddingVertical: 10, marginLeft: 20, color: (this.state.dataKamar.length > 0) ? '#000000' : '#909cb3'}]}>{(this.state.dataKamar.length > 0) ? t('iTotalKamar', {total : this.state.dataKamar.length}) : t('iKamar')}</Text>
            <IconAll color='#8F9BB3' name='menu-2-outline'/>
          </TouchableOpacity>
        }
      </Layout>
    )
  }
  _onBersih = () => {
    this.setState({isTanggal: !this.state.isTanggal, isWaktu : false})
  }

  _onSprei = () => {
    this.setState({isSprei: !this.state.isSprei})
  }

  _onTanggalSprei = (event, date) => {
    if (date) {
      this.setState({
        sprei   : 'Tanggal '+formatDate({date : date, format : 'DD'}),
        isSprei : false
      });
    } else {
      this.setState({
        isSprei : false
      });
    }
  }

  _onTanggal = (event, date) => {
    if (date) {
      this.setState({
        tanggal   : 'Tanggal '+formatDate({date : date, format : 'DD'}),
        isTanggal : !this.state.isTanggal,
        isWaktu   : !this.state.isWaktu,
      });
    } else {
      this.setState({
        isTanggal : false,
        isWaktu   : false,
      });
    }
  }

  _onWaktu = (event, timestamp) => {
    if (timestamp) {
      let time = ('0'+timestamp.getHours()).slice(-2)+':'+('0'+timestamp.getMinutes()).slice(-2);
      this.setState({
        bersih    : this.state.tanggal+', Jam '+time,
        isTanggal : false,
        isWaktu   : false
      });
    } else {
      this.setState({
        isTanggal : false,
        isWaktu   : false
      });
    }
  }

  _onSubmit = () => {
    let data = [];
    this.state.fasilitas_umum.map((item, index) => {
      if (item.master_fasilitas_umum_id != '0' && item.check) {
        data.push(item);
      }
    })
    this.setState({
      errGambar        : (this.state.gambar_link.length > 0 ? false : true),
      errNamaProperti  : (this.state.nama_properti ? false : true),
      errKota          : (this.state.kota ? false : true),
      errBiayaTambahan : (this.state.tambahan_biaya ? false : true),
      errAlamat        : (this.state.alamat ? false : true),
      errFasilitas     : (data.length > 0 ? false : true),
      // errBersih       : (this.state.bersih ? false : true),
      // errSprei        : (this.state.sprei ? false : true),
      errDeposit       : (this.state.deposit ? false : true),
      errMobil         : (this.state.isParkirMobil ? (this.state.parkir_mobil ? false : true) : false),
      errMotor         : (this.state.isParkirMotor ? (this.state.parkir_motor ? false : true) : false),
      errLantai        : (this.state.jumlah_lantai ? false : true),
      errKamar         : (this.state.dataKamar.length > 0 ? false : true),
    }, () => {
      if (
        !this.state.errGambar        &&
        !this.state.errNamaProperti  &&
        !this.state.errKota          &&
        !this.state.errAlamat        &&
        !this.state.errFasilitas     &&
        // !this.state.errBersih       &&
        // !this.state.errSprei        &&
        !this.state.errDeposit       &&
        !this.state.errMobil         &&
        !this.state.errMotor         &&
        !this.state.errLantai        &&
        !this.state.errBiayaTambahan &&
        !this.state.errKamar
      ) {
        if (this.state.properti_id) {
          let params = {
            'lantai_id'          : this.state.lantai_id,
            'properti_id'        : this.state.properti_id,
            'nama_properti'      : this.state.nama_properti,
            'session_upload_id'  : this.state.session_upload_id,
            'jumlah_lantai'      : this.state.jumlah_lantai,
            'fasilitas_umum'     : this.state.fasilitas_umum,
            'harga_parkir_mobil' : (this.state.isParkirMobil ? this.state.parkir_mobil.split('.').join('') : null),
            'harga_parkir_motor' : (this.state.isParkirMotor ? this.state.parkir_motor.split('.').join('') : null),
            'dataKamar'          : this.state.dataKamar,
            'kota'               : this.state.kota,
            'alamat'             : this.state.alamat,
            'tambahan_biaya'     : this.state.tambahan_biaya.split('.').join(''),
            // 'bersih'             : this.state.bersih,
            // 'sprei'              : this.state.sprei,
            'deposit'            : this.state.deposit.split('.').join(''),
            'created_by'         : (this.props.state.user.role == '3') ? this.state.created_by : this.props.state.user.user_id,
            'hapus_kamar'        : this.state.hapus_kamar
          }
          this._simpanProperti(params);
        }else {
          let params = {
            'nama_properti'      : this.state.nama_properti,
            'session_upload_id'  : this.state.session_upload_id,
            'jumlah_lantai'      : this.state.jumlah_lantai,
            'fasilitas_umum'     : data,
            'harga_parkir_mobil' : (this.state.isParkirMobil ? this.state.parkir_mobil.split('.').join('') : null),
            'harga_parkir_motor' : (this.state.isParkirMotor ? this.state.parkir_motor.split('.').join('') : null),
            'dataKamar'          : this.state.dataKamar,
            'kota'               : this.state.kota,
            'alamat'             : this.state.alamat,
            // 'bersih'             : this.state.bersih,
            'deposit'            : this.state.deposit.split('.').join(''),
            // 'sprei'              : this.state.sprei,
            'tambahan_biaya'     : this.state.tambahan_biaya.split('.').join(''),
            'created_by'         : this.props.state.user.user_id
          }
          this._simpanProperti(params);
        }
      }
    })
  }

  _simpanProperti = (params) => {
    this.setState({isProcess : true}, () => {
      request({
        'model' : 'properti_model',
        'key'   : 'simpan_properti',
        'table' : '-',
        'data'  : {
          properti : params
        },
      }).then((res) => {
        this.props.params.action();
        Toast.show(t('aSimpanProperti'), Toast.SHORT);
        this.setState({isProcess : false});
      }).catch((error) => {
        this.setState({isProcess : false});
      });
    })
  }

  _goBack = () => {
    this.props.params.action();
  }

  _hideAlert = () => {
    this.setState({isAlert : !this.state.isAlert});
  }
  // end proses

  // input
  _onChangeJumlahLantai = (text) => {
    this.setState({ jumlah_lantai : text });
  }
  _onChangeNamaProperti = (text) => {
    this.setState({ nama_properti : text });
  }
  _onChangeKota = (text) => {
    this.setState({ kota : text });
  }
  _onChangeAlamat = (text) => {
    this.setState({ alamat : text });
  }
  _onChangeHargaParkirMotor = (text) => {
    this.setState({ parkir_motor : formatCur({value:text.split('.').join(''), input:true}) });
  }
  _onChangeHargaParkirMobil = (text) => {
    this.setState({ parkir_mobil : formatCur({value:text.split('.').join(''), input:true}) });
  }
  _onChangeBiayaTambahan = (text) => {
    this.setState({ tambahan_biaya : formatCur({value:text.split('.').join(''), input:true}) });
  }
  _onChangeDeposit = (text) => {
    this.setState({ deposit : formatCur({value:text.split('.').join(''), input:true}) });
  }
  _onChangeFasilitas = (row) => {
    let data         = [];
    let parkir_mobil = 0;
    let parkir_motor = 0;
    row.map((item, index) => {
      data.push(this.state.fasilitas_umum[item.row].fasilitas_umum)
      if (this.state.fasilitas_umum[item.row].fasilitas_umum == 'Parkir Motor') {
        parkir_motor = parkir_motor+1;
      }
      if (this.state.fasilitas_umum[item.row].fasilitas_umum == 'Parkir Mobil') {
        parkir_mobil = parkir_mobil+1;
      }
    })

    if (parkir_motor == 1) {
      this.setState({ isParkirMotor : true});
    }else {
      this.setState({ isParkirMotor : false, parkir_motor : '' });
    }
    if (parkir_mobil == 1) {
      this.setState({ isParkirMobil : true});
    }else {
      this.setState({ isParkirMobil : false, parkir_mobil : '' });
    }
    this.setState({ fasilitas : row, value_umum : data.join(', ')});
  }

  _onCheck = (item, isCheck) => {
    let data = [];
    this.state.fasilitas_umum.map((value, key) => {
      if (value.master_fasilitas_umum_id == item.master_fasilitas_umum_id) {
        data.push({
          master_fasilitas_umum_id : value.master_fasilitas_umum_id,
          fasilitas_umum           : value.fasilitas_umum,
          check                    : !value.check
        });
      } else {
        if (item.master_fasilitas_umum_id == '0') {
          if (item.check) {
            data.push({
              master_fasilitas_umum_id : value.master_fasilitas_umum_id,
              fasilitas_umum           : value.fasilitas_umum,
              check                    : false
            });
          } else {
            data.push({
              master_fasilitas_umum_id : value.master_fasilitas_umum_id,
              fasilitas_umum           : value.fasilitas_umum,
              check                    : true
            });
          }
        } else {
          if (value.check) {
            data.push({
              master_fasilitas_umum_id : value.master_fasilitas_umum_id,
              fasilitas_umum           : value.fasilitas_umum,
              check                    : true
            });
          } else {
            data.push({
              master_fasilitas_umum_id : value.master_fasilitas_umum_id,
              fasilitas_umum           : value.fasilitas_umum,
              check                    : false
            });
          }
        }
      }
    })
    if (item.master_fasilitas_umum_id == '8' || item.master_fasilitas_umum_id == '0') {
      if (item.check) {
        this.setState({
          isParkirMotor  : false,
          parkir_motor   : '',
        });
      } else {
        this.setState({
          isParkirMotor  : true,
          parkir_motor   : '',
        });
      }
    }
    if ((item.master_fasilitas_umum_id == '9') || (item.master_fasilitas_umum_id == '0')) {
      if (item.check) {
        this.setState({
          isParkirMobil  : false,
          parkir_mobil   : '',
        });
      } else {
        this.setState({
          isParkirMobil  : true,
          parkir_mobil   : '',
        });
      }
    }
    this.setState({ fasilitas_umum : data });
  }
  // end input

  // render
  _renderHeader = () => {
    return(
      <TouchableOpacity style={styles.itemFasilitas} onPress={() => this._onCheck(null, true)}>
        <IconAll color={(this.state.isCheck) ? '#60b8d6' : '#8F9BB3'} name={(this.state.isCheck) ? 'checkmark-square-outline' : 'square-outline'}/>
        <Text>{'Pilih Semua'}</Text>
      </TouchableOpacity>
    )
  }

  _renderItemFasilitas = ({item, index}) => {
    return(
      <TouchableOpacity style={styles.itemFasilitas} onPress={() => this._onCheck(item, false)} disabled={(this.props.state.user.role == '3') ? true : false}>
        <IconAll color={(item.check) ? '#60b8d6' : '#8F9BB3'} name={(item.check) ? 'checkmark-square-outline' : 'square-outline'}/>
        <Text>{item.fasilitas_umum}</Text>
      </TouchableOpacity>
    )
  }

  _renderOption = (title) => (
    <SelectItem title={title.fasilitas_umum}/>
  );

  _renderCheckbox = () => {
    return (
      <View style={{borderWidth: 1, maxHeight: 140, borderRadius: 18, paddingLeft: 15, paddingTop: 5}}>
        <TouchableOpacity>
        {
          this.state.fasilitas_umum.map((item, index) => {
            return (<Text>Test</Text>)
          })
        }
        </TouchableOpacity>
      </View>
    )
  }

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
        'path'              : 'properti',
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
        'table' : 'properti',
        'where' : {
          'file_name'         : item,
          'session_upload_id' : this.state.session_upload_id,
          'user_id'           : this.props.state.user.user_id
        },
      });
    }, 0);
  }
  // end ActionSheet

  // page
  _tambahKamar = () => {
    this.props.navigation.push('GoTo', {
      page   : 'Kamar',
      params : {
        jumlah_lantai : this.state.jumlah_lantai,
        data          : (this.state.dataKamar) ? this.state.dataKamar : [],
        hapus_kamar   : (this.state.hapus_kamar) ? this.state.hapus_kamar : [],
        action        : this._onAction
      }
    });
  }
  // end page

  // proses
  _onAction = (params, hapus_kamar) => {
    this.setState({ dataKamar : params, hapus_kamar : hapus_kamar });
    this.props.navigation.pop();
  }
  // end proses

}

const mapStateToProps = state => ({state: state});
const mapDispatchToProps = dispatch => ({

});
export default connect(mapStateToProps, mapDispatchToProps)(TambahProperti);
