import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Container, Header, Process, ListItem } from '../../theme';
import { Layout, Text, Input, Button, Icon, Select, SelectItem, Datepicker, Spinner } from '@ui-kitten/components';
import { connect } from 'react-redux';
import { request, upload } from '../../bridge';
import { formatDate, validator } from '../../func';
import layout from '../../theme/styles/layout';
import styles from '../../theme/styles/styles';
import t from '../../lang';
import Toast from 'react-native-simple-toast';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const IconAll = (name) => {
  return (
    <Icon style={{width: 35, color: '#8F9BB3'}} name={name.name} />
  )
}

class Register extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoadingImg        : false,
      isProcess           : false,
      isPassword          : true,
      disabled            : true,
      isOpsiTanggal       : false,
      role                : '',
      nama                : '',
      phoneNumber         : '',
      email               : '',
      password            : '',
      birthday            : '',
      alamat              : '',
      gender              : '',
      pekerjaan           : '',
      nama_darurat_satu   : '',
      notelp_darurat_satu : '',
      nama_darurat_dua    : '',
      notelp_darurat_dua  : '',
      bank                : '',
      no_rekening         : '',
      nama_pemilik        : '',
      gambar              : [],
      gambar_link         : [],
      data_rekening       : [],
      gambar_edit         : '',
      gambar_name         : '',
      page                : 1,
      data_gender         : [
        {
          id   : '1',
          nama : 'Laki-laki',
        },
        {
          id   : '2',
          nama : 'Perempuan',
        }
      ],
      data_role           : [
        {
          id   : '1',
          nama :'Owner',
        },
        {
          id   : '2',
          nama :'Anak Kos',
        },
        {
          id   : '3',
          nama : 'Penjaga Kos',
        }
      ],
      imgAct        : [
        <Text status='danger'>{t('bClose')}</Text>,
        <ListItem
          title={t('aKamera')}
          description={t('aSubKamera')}
          descriptionStyle={layout.regular}
          onPress={this._camera}
          accessoryLeft={<IconAll name='camera-outline'/>}
        />,
        <ListItem
          title={t('aGaleri')}
          description={t('aGaleriSub')}
          descriptionStyle={layout.regular}
          onPress={this._gallery}
          accessoryLeft={<IconAll name='image-outline'/>}
        />
      ],

    }
  }

  componentDidMount = () => {
    this._getData();
  }

  _getData = () => {
    request({
      'model' : 'Auth_model',
      'key'   : 'session_upload_id',
      'table' : '-',
    }).then((res) => {
      let data = res.data;
      this.setState({
        data_rekening     : data.data_rekening,
        session_upload_id : data.session_upload_id,
        gambar            : data.gambar,
        gambar_link       : data.gambar_link,
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
          center : t('pRegister'),
          isBack : true
        }}/>
        <Layout style={[layout.container, styles.containerInner]}>
          <ScrollView showsVerticalScrollIndicator={false} style={styles.pinContainer}>
          <Text category="h6" style={layout.bold}>Daftarkan akun mu</Text>
          <Text>Dapatkan pengalaman lebih seru bersama KosTzy</Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10, marginVertical: 10, alignItems: 'center'}}>
            <Text style={[styles.pageRegister, (this.state.page == 1) ? {backgroundColor: '#3366ff', color: '#ffffff'} : {backgroundColor: '#f7f9fc', color: '#8F9BB3'}]}>1</Text>
            <View style={{borderWidth: 1, height: 2, width: '30%', borderColor: '#ebeef5'}}/>
            <Text style={[styles.pageRegister, (this.state.page == 2) ? {backgroundColor: '#3366ff', color: '#ffffff'} : {backgroundColor: '#f7f9fc', color: '#8F9BB3'}]}>2</Text>
            <View style={{borderWidth: 1, height: 2, width: '30%', borderColor: '#ebeef5'}}/>
            <Text style={[styles.pageRegister, (this.state.page == 3) ? {backgroundColor: '#3366ff', color: '#ffffff'} : {backgroundColor: '#f7f9fc', color: '#8F9BB3'}]}>3</Text>
          </View>
          {
            (this.state.page == 1) &&
            <>
              <Input
                accessoryRight={() =>
                  <IconAll name='edit-2-outline'/>
                }
                style={styles.registerInput}
                textStyle={styles.loginTextInput}
                placeholder={t('iNama')}
                value={this.state.nama}
                onChangeText={this.onChangeNama}
                status={(this.state.errNama) ? 'danger' : 'basic'}
              />
              <Input
                accessoryRight={() =>
                  <IconAll name='edit-2-outline'/>
                }
                style={styles.registerInput}
                textStyle={styles.loginTextInput}
                placeholder={t('iEmail')}
                value={this.state.email}
                onChangeText={this.onChangeEmail}
                status={(this.state.errEmail) ? 'danger' : 'basic'}
              />
              <Input
                accessoryRight={() =>
                  <IconAll name='book-outline'/>
                }
                accessoryLeft={() =>
                  <View style={styles.loginCodeCountryContainer}>
                   <Image style={styles.loginImgCountry} source={{uri : "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Flag_of_Indonesia.svg/255px-Flag_of_Indonesia.svg.png"}}/>
                   <Text style={styles.loginTextCountry}>+62</Text>
                  </View>
                }
                style={styles.registerInput}
                textStyle={styles.loginTextInput}
                placeholder={t('iPhoneNumber')}
                value={this.state.phoneNumber}
                onChangeText={this.onChangePhoneNumber}
                keyboardType={'phone-pad'}
                status={(this.state.errPhoneNumber) ? 'danger' : 'basic'}
              />
              {/* <Input
                accessoryRight={() =>
                  <IconAll name='edit-2-outline'/>
                }
                style={styles.registerInput}
                textStyle={styles.loginTextInput}
                placeholder={t('iNamaBank')}
                value={this.state.bank}
                onChangeText={this.onChangeBank}
                status={(this.state.errBank) ? 'danger' : 'basic'}
              /> */}
              <Select
                accessoryRight={() =>
                  <IconAll name='menu-2-outline'/>
                }
                style={styles.registerInput}
                textStyle={styles.loginTextInput}
                value={this.state.bank}
                placeholder={t('iNamaBank')}
                status={(this.state.errBank) ? 'danger' : 'basic'}
                onSelect={this.onChangeRekening}>
                  {this.state.data_rekening.map(this._renderOptionRekening)}
              </Select>
              <Input
                accessoryRight={() =>
                  <IconAll name='edit-2-outline'/>
                }
                style={styles.registerInput}
                textStyle={styles.loginTextInput}
                placeholder={t('iPemilikBank')}
                value={this.state.nama_pemilik}
                onChangeText={this.onChangePemilikBank}
                status={(this.state.errNamaPemilik) ? 'danger' : 'basic'}
              />
              <Input
                accessoryRight={() =>
                  <IconAll name='edit-2-outline'/>
                }
                style={styles.registerInput}
                textStyle={styles.loginTextInput}
                placeholder={t('iNoRek')}
                value={this.state.no_rekening}
                onChangeText={this.onChangeNoRek}
                keyboardType={'phone-pad'}
                status={(this.state.errNoRek) ? 'danger' : 'basic'}
              />
              {/* <Datepicker
                accessoryRight={() =>
                  <IconAll name='calendar-outline'/>
                }
                min={new Date('1930')}
                max={new Date()}
                style={styles.registerInput}
                placeholder={t('iTanggalLahir')}
                date={this.state.birthday}
                onSelect={this.onChangeBirthday}
                status={(this.state.errBirthday) ? 'danger' : 'basic'}
              /> */}
              <TouchableOpacity style={{borderWidth: 1, borderRadius: 18, borderColor: (this.state.errKamar ? 'red' : '#eef1f7'), backgroundColor: '#f7f9fc', marginVertical: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}} onPress={this._setTanggal}>
                <Text style={[styles.loginTextInput, {paddingVertical: 10, marginLeft: 20, color: (this.state.birthday) ? '#000000' : '#909cb3'}]}>{(this.state.birthday) ? this.state.birthday : t('iTanggalLahir')}</Text>
                <IconAll color='#8F9BB3' name='calendar-outline'/>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={this.state?.isOpsiTanggal}
                minimumDate={new Date('1930')}
                maximumDate={new Date()}
                date={new Date((this.state.birthday) ? this.state.birthday : '2000')}
                mode="date"
                onCancel={this._modalHide}
                onConfirm={(item) => this.onChangeBirthday(item)}
              />
              <Select
                accessoryRight={() =>
                  <IconAll name='menu-2-outline'/>
                }
                style={styles.registerInput}
                textStyle={styles.loginTextInput}
                value={this.state.gender.nama}
                placeholder={t('iGender')}
                status={(this.state.errGender) ? 'danger' : 'basic'}
                onSelect={this.onChangeGender}>
                  {this.state.data_gender.map(this._renderOption)}
              </Select>
              <Select
                accessoryRight={() =>
                  <IconAll name='menu-2-outline'/>
                }
                style={styles.registerInput}
                textStyle={styles.loginTextInput}
                value={this.state.role.nama}
                placeholder={t('iStatusUser')}
                status={(this.state.errRole) ? 'danger' : 'basic'}
                onSelect={this.onChangeRole}>
                  {this.state.data_role.map(this._renderOption)}
              </Select>
            </>
          }
          {
            (this.state.page == 2) &&
            <>
              <Text category="c2" appearance="hint">{t('iGambarKtp')}</Text>
              <View style={{flexDirection: 'row'}}>
                {
                  (this.state.isLoadingImg && this.state.gambar_edit?.index == 0) ?
                  (
                    <TouchableOpacity style={[styles.containerImg, {borderColor: (this.state.errGambarKTP ? 'red' : '#ebeef5')}]} onPress={() => this.openImg(this.state?.gambar[0], 0)}>
                      <Spinner/>
                    </TouchableOpacity>
                  ) :
                  (
                    <TouchableOpacity style={[styles.containerImg, {borderColor: (this.state.errGambarKTP ? 'red' : '#ebeef5')}]} onPress={() => this.openImg(this.state?.gambar[0], 0)}>
                      {
                        (!this.state?.gambar_link[0]) ?
                        (
                          <Text category="c2" appearance="hint">KTP</Text>
                        ) :
                        (
                          <Image
                            style={{ width: 100, height: 100, borderRadius: 18}}
                            source={{
                              uri: this.state?.gambar_link[0],
                            }}
                          />
                        )
                      }
                    </TouchableOpacity>
                  )
                }
                {
                  (this.state.isLoadingImg && this.state.gambar_edit?.index == 1) ?
                  (
                    <TouchableOpacity style={[styles.containerImg, {borderColor: (this.state.errGambarSelfie ? 'red' : '#ebeef5')}]} onPress={() => this.openImg(this.state?.gambar[1], 1)}>
                      <Spinner/>
                    </TouchableOpacity>
                  ) :
                  (
                    <TouchableOpacity style={[styles.containerImg, {borderColor: (this.state.errGambarSelfie ? 'red' : '#ebeef5')}]} onPress={() => this.openImg(this.state?.gambar[1], 1)}>
                    {
                      (!this.state?.gambar_link[1]) ?
                      (
                        <Text category="c2" appearance="hint">Selfie KTP</Text>
                      ) :
                      (
                        <Image
                          style={{ width: 100, height: 100, borderRadius: 18}}
                          source={{
                            uri: this.state?.gambar_link[1],
                          }}
                        />
                      )
                    }
                    </TouchableOpacity>
                  )
                }
              </View>
              <Input
                accessoryRight={() =>
                  <IconAll name='edit-2-outline'/>
                }
                style={styles.registerInput}
                textStyle={styles.alamatInput}
                placeholder={t('iAlamat')}
                value={this.state.alamat}
                onChangeText={this.onChangeAlamat}
                multiline={true}
                status={(this.state.errAlamat) ? 'danger' : 'basic'}
              />
              <Input
                accessoryRight={() =>
                  <IconAll name='edit-2-outline'/>
                }
                style={styles.registerInput}
                textStyle={styles.loginTextInput}
                placeholder={t('iPekerjaan')}
                value={this.state.pekerjaan}
                onChangeText={this.onChangePekerjaan}
                status={(this.state.errPekerjaan) ? 'danger' : 'basic'}
              />
            </>
          }
          {
            (this.state.page == 3) &&
            <>
              <Input
                accessoryRight={() =>
                  <IconAll name='edit-2-outline'/>
                }
                style={styles.registerInput}
                textStyle={styles.loginTextInput}
                placeholder={t('iNamaKontakSatu')}
                value={this.state.nama_darurat_satu}
                onChangeText={this.onChangeNamaKontakSatu}
                status={(this.state.errNamaDaruratSatu) ? 'danger' : 'basic'}
              />
              <Input
                accessoryLeft={() =>
                  <View style={styles.loginCodeCountryContainer}>
                   <Image style={styles.loginImgCountry} source={{uri : "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Flag_of_Indonesia.svg/255px-Flag_of_Indonesia.svg.png"}}/>
                   <Text style={styles.loginTextCountry}>+62</Text>
                  </View>
                }
                accessoryRight={() =>
                  <IconAll name='book-outline'/>
                }
                style={styles.registerInput}
                textStyle={styles.loginTextInput}
                placeholder={t('iNotelpKontakSatu')}
                value={this.state.notelp_darutat_satu}
                onChangeText={this.onChangeNotelKontakSatu}
                keyboardType={'phone-pad'}
                status={(this.state.errNotelpDaruratSatu) ? 'danger' : 'basic'}
              />
              <Input
                accessoryRight={() =>
                  <IconAll name='edit-2-outline'/>
                }
                style={styles.registerInput}
                textStyle={styles.loginTextInput}
                placeholder={t('iNamaKontakDua')}
                value={this.state.nama_darurat_dua}
                onChangeText={this.onChangeNamaKontakDua}
                status={(this.state.errNamaDaruratDua) ? 'danger' : 'basic'}
              />
              <Input
                accessoryLeft={() =>
                  <View style={styles.loginCodeCountryContainer}>
                   <Image style={styles.loginImgCountry} source={{uri : "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Flag_of_Indonesia.svg/255px-Flag_of_Indonesia.svg.png"}}/>
                   <Text style={styles.loginTextCountry}>+62</Text>
                  </View>
                }
                accessoryRight={() =>
                  <IconAll name='book-outline'/>
                }
                style={styles.registerInput}
                textStyle={styles.loginTextInput}
                placeholder={t('iNotelpKontakDua')}
                value={this.state.notelp_darutat_dua}
                onChangeText={this.onChangeNotelKontakDua}
                keyboardType={'phone-pad'}
                status={(this.state.errNotelpDaruratDua) ? 'danger' : 'basic'}
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
                style={styles.registerInput}
                textStyle={styles.loginTextInput}
                placeholder={t('iPassword')}
                value={this.state.password}
                onChangeText={this.onChangePassword}
                secureTextEntry={this.state.isPassword}
                status={(this.state.errPassword) ? 'danger' : 'basic'}
              />
            </>
          }
          <Button style={{marginTop: 15, marginBottom: 10}} status="info" onPress={(this.state.page != 3) ? this._next : this._prosesRegister}>{(this.state.page != 3) ? t('bBerikutnya') : t('bDaftar')}</Button>
          {
            (this.state.page != 1) &&
            <TouchableOpacity activeOpacity={0.9} onPress={this._kembali} style={styles.loginHeader}>
              <Text style={styles.loginText} status="info">Kembali</Text>
            </TouchableOpacity>
          }
          </ScrollView>
        </Layout>
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

  _setTanggal = () => {
    this.setState({
      isOpsiTanggal : !this.state.isOpsiTanggal
    });
  }

  _modalHide = () => {
    this.setState({ isOpsiTanggal : false });
  }

  _renderOption = (title) => (
      <SelectItem title={title.nama}/>
  );

  _next = () => {
    if (this.state?.page == 1) {
      this.setState({
        errNama        : (this.state.nama) ? false : true,
        errEmail       : (validator({ type : 'email', value : this.state.email })) ? false : true,
        errNoRek       : (this.state.no_rekening) ? false : true,
        errBank        : (this.state.bank) ? false : true,
        errNamaPemilik : (this.state.nama_pemilik) ? false : true,
        errPhoneNumber : (this.state.phoneNumber.length > 8) ? false : true,
        errBirthday    : (this.state.birthday) ? false : true,
        errGender      : (this.state.gender) ? false : true,
        errRole        : (this.state.role) ? false : true,
      }, () => {
        if (
          !this.state.errNama &&
          !this.state.errEmail &&
          !this.state.errPhoneNumber &&
          !this.state.errBirthday &&
          !this.state.errGender &&
          !this.state.errNoRek &&
          !this.state.errBank
        ) {
          this.setState({page : this.state.page+1});
        }
      });
    }else {
      this.setState({
        errGambarKTP    : (this.state.gambar[0]) ? false : true,
        errGambarSelfie : (this.state.gambar[1]) ? false : true,
        errAlamat       : (this.state.alamat) ? false : true,
        errPekerjaan    : (this.state.pekerjaan) ? false : true,
      }, () => {
        if (
          !this.state.errGambarKTP    &&
          !this.state.errGambarSelfie &&
          !this.state.errAlamat       &&
          !this.state.errPekerjaan
        ) {
          this.setState({page : this.state.page+1});
        }
      });
    }
  }

  _kembali = () => {
    this.setState({page : this.state.page-1});
  }

  openImg = (file_name, index) => {
    this.setState({
      gambar_edit : {
        index     : index,
        file_name : file_name
      }

    }, () => {
      this.imgSheet.show();
    })
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
        'user_id'           : '0',
        'session_upload_id' : this.state.session_upload_id,
        'file_name'         : this.state.gambar_edit.file_name,
        'image'             : response
      }).then((res) => {
        let gambar_link = [];
        let gambar      = [];
        if (res.success) {
          for (var i = 0; i < 2; i++) {
            if (i == this.state.gambar_edit.index) {
              gambar_link.push(res.preview);
              gambar.push(res.filename);
            } else {
              if (this.state.gambar[i]) {
                gambar_link.push(this.state.gambar_link[i]);
                gambar.push(this.state.gambar[i]);
              } else {
                gambar_link.push('');
                gambar.push('');
              }
            }
          }
          this.setState({ gambar_link : gambar_link, gambar : gambar });
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

  onChangeRekening = (item) => {
    this.setState({
      bank : this.state.data_rekening[item.row]?.nama_bank
    });
  }

  _renderOptionRekening = (title) => (
    <SelectItem title={title.nama_bank}/>
  );

  _onPassword = () => {
    this.setState({ isPassword : !this.state.isPassword });
  }

  onChangeNama = (text) => {
    this.setState({ nama : text });
  }

  onChangePassword = (text) => {
    this.setState({ password : text });
  }

  onChangeEmail = (text) => {
    this.setState({ email : text });
  }

  onChangeBank = (text) => {
    this.setState({ bank : text });
  }

  onChangePemilikBank = (text) => {
    this.setState({ nama_pemilik : text });
  }

  onChangeNoRek = (text) => {
    this.setState({ no_rekening : text });
  }

  onChangePhoneNumber = (text) => {
    this.setState({ phoneNumber : text });
  }

  onChangeBirthday = (text) => {
    this.setState({
      birthday : formatDate({date : text, format : 'YYYY-MM-DD'}),
      isOpsiTanggal : false
    });
  }

  onChangeAlamat = (text) => {
    this.setState({ alamat : text });
  }

  onChangeRole = (item) => {
    this.setState({
      role : this.state.data_role[item.row]
    });
  }

  onChangeGender = (item) => {
    this.setState({
      gender : this.state.data_gender[item.row]
    });
  }

  onChangePekerjaan = (text) => {
    this.setState({ pekerjaan : text });
  }

  onChangeNamaKontakSatu = (text) => {
    this.setState({ nama_darurat_satu : text });
  }

  onChangeNotelKontakSatu = (text) => {
    this.setState({ notelp_darurat_satu : text });
  }

  onChangeNamaKontakDua = (text) => {
    this.setState({ nama_darurat_dua : text });
  }

  onChangeNotelKontakDua = (text) => {
    this.setState({ notelp_darurat_dua : text });
  }

  _prosesRegister = () => {
    this.setState({
      errNamaDaruratSatu   : (this.state.nama_darurat_satu) ? false : true,
      errNotelpDaruratSatu : (this.state.notelp_darurat_satu.length > 8) ? false : true,
      errNamaDaruratDua    : (this.state.nama_darurat_dua) ? false : true,
      errNotelpDaruratDua  : (this.state.notelp_darurat_dua.length > 8) ? false : true,
      errPassword          : (this.state.password) ? false : true,
    }, () => {
      if (
        !this.state.errNamaDaruratSatu &&
        !this.state.errNotelpDaruratSatu &&
        !this.state.errNamaDaruratDua &&
        !this.state.errNotelpDaruratDua &&
        !this.state.errPassword
      ) {
        this._register();
      }
    })
  }

  _register = () => {
    this.setState({isProcess : true}, () => {
      request({
        'model'         : 'auth_model',
        'key'           : 'register',
        'table'         : '-',
        'data'         : {
          'nama'                : this.state.nama,
          'notelp'              : this.state.phoneNumber,
          'email'               : this.state.email,
          'birthday'            : this.state.birthday,
          'alamat'              : this.state.alamat,
          'gender'              : this.state.gender.id,
          'role'                : this.state.role.id,
          'pekerjaan'           : this.state.pekerjaan,
          'nama_darurat_satu'   : this.state.nama_darurat_satu,
          'notelp_darurat_satu' : this.state.notelp_darurat_satu,
          'nama_darurat_dua'    : this.state.nama_darurat_dua,
          'notelp_darurat_dua'  : this.state.notelp_darurat_dua,
          'password'            : this.state.password,
          'session_upload_id'   : this.state.session_upload_id,
          'gambar'              : this.state.gambar,
          'no_rekening'         : this.state.no_rekening,
          'nama_pemilik'        : this.state.nama_pemilik,
          'bank'                : this.state.bank,
        }
      }).then((res) => {
        if (res.success) {
          this.props.params.action(res.data);
        }else {
          Toast.show(res.message, Toast.LONG);
        }
        this.setState({isProcess : false});
      }).catch((error) => {
        this.setState({isProcess : false});
      });
    })
  }

}

const mapStateToProps = state => ({state: state});
const mapDispatchToProps = dispatch => ({

});
export default connect(mapStateToProps, mapDispatchToProps)(Register);
