import React, { Component } from 'react';
import { View, Alert, ScrollView, Dimensions, TouchableOpacity, FlatList, RefreshControl, PermissionsAndroid } from 'react-native';
import { Layout, Icon, Text, Card, Spinner, Avatar, Modal, Input, Button } from '@ui-kitten/components';
import { Container, Header, Process } from '../../theme';
import t from '../../lang';
import { request } from '../../bridge';
import { formatCur } from '../../func';
import layout from '../../theme/styles/layout';
import styles from '../../theme/styles/styles';
import Toast from 'react-native-simple-toast';
import ActionButton from 'react-native-action-button';
import RNFetchBlob from 'react-native-fetch-blob';
import { connect } from 'react-redux';

const BannerWidth = Dimensions.get('window').width - 32;
const BannerHeight = Dimensions.get('window').height/3.5;
class TagihanDetail extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isMotor      : false,
      isMobil      : false,
      isTambahan   : false,
      isKamar      : false,
      isDeposit    : false,
      isProcess    : false,
      isLoading    : true,
      set_motor    : '',
      set_mobil    : '',
      set_tambahan : '',
      set_kamar    : '',
      set_deposit  : '',
      data         : [],
    }
  }

  componentDidMount = () => {
    this.timerHandle = setTimeout(() => {
      this.get_data()
    }, 0);
  }

  componentWillUnmount = () => {
    if (this.timerHandle) {
      clearTimeout(this.timerHandle);
      this.timerHandle = 0;
    }
  }

  get_data = () => {
    this.setState({isProcess : true}, () => {
      request({
        'model'     : 'Sewa_model',
        'key'       : 'detailTagihan',
        'table'     : '-',
        'where'     : {
          'tagihan_id'  : this.props.params.sewa.tagihan_id
        }
      }).then((res) => {
        this.setState({
          data       : res.data,
          isMotor    : false,
          isMobil    : false,
          isTambahan : false,
          isKamar    : false,
          isDeposit  : false,
          isLoading  : false,
          isProcess  : false,
          isRefresh  : false
        })
      }).catch((error) => {
        Toast.show(t('aError', {ercode : '302'}), Toast.SHORT)
        this._catch();
      });
    })
  }

  render() {
    return (
      <Container>
        <Header navigation={this.props.navigation} params={{
          center : t('pDetailTagihan'),
          isBack : true
        }}/>
        <Layout style={[layout.containerList, {flex: 1}]} level={'3'}>
          {
            (this.state.isLoading) ?
            (
              <View style={layout.spinner}>
                <Spinner/>
              </View>
            ) : this._renderContainer()
          }
          <ActionButton onPress={() => this._print()} buttonColor={layout.btnFloating} renderIcon={() => <Icon style={{width: 20, height : 20, color: '#fff'}} name="download-outline" />}/>
        </Layout>
        <Modal
          backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
          onBackdropPress={this._renderModelHargaMotor}
          visible={this.state.isMotor}>
            {this._renderHargaMotor()}
        </Modal>
        <Modal
          backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
          onBackdropPress={this._renderModelHargaMobil}
          visible={this.state.isMobil}>
            {this._renderHargaMobil()}
        </Modal>
        <Modal
          backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
          onBackdropPress={this._renderModelHargaTambahan}
          visible={this.state.isTambahan}>
            {this._renderHargaTambahan()}
        </Modal>
        <Modal
          backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
          onBackdropPress={this._renderModelHargaKamar}
          visible={this.state.isKamar}>
            {this._renderHargaKamar()}
        </Modal>
        <Modal
          backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
          onBackdropPress={this._renderModelHargaDeposit}
          visible={this.state.isDeposit}>
            {this._renderHargaDeposit()}
        </Modal>
        <Process visible={this.state.isProcess}/>
      </Container>
    )
  }

  _renderContainer = () => {
    return (
      <ScrollView
        refreshControl={
           <RefreshControl refreshing={this.state.isRefresh} onRefresh={this._onRefresh} />
        }>
        <View style={styles.containerInner}>
          <View>
            {
              (!this.props.params.isPenjual && this.state.data.status_pesanan != '10') && (
                <View style={[layout.container, styles.shadow]}>
                  <TouchableOpacity style={[styles.rowCenter, {paddingBottom : 4}]} disabled={(this.state.data.no_rekening) ? false : true} onPress={() => { Clipboard.setString(this.state.data.no_rekening); Toast.show(t('aInfoCopy', {type : 'Nomor rekening'}), Toast.SHORT); }}>
                    <View style={layout.container}>
                      <Text style={layout.bold} category="s2">{t('trBayarPakai')}</Text>
                      <Text style={layout.regular} category="s2">{this.state.data.pembayaran?.nama_bank+' '+this.state.data.pembayaran?.no_rekening}</Text>
                    </View>
                    <Avatar style={styles.avatarImg2} shape='square' source={{uri : this.state.data.pembayaran?.gambar}}/>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.buttonBayar}>
                    <Text category="p2" style={[layout.danger, styles.marginTop7]}>{t('bInfoBayar')}</Text>
                  </TouchableOpacity>
                </View>
              )
            }
            <View style={styles.rowCenter}>
              <View style={[layout.container, styles.shadow]}>
                <View style={[styles.headerTagihan, { paddingVertical : 4, marginBottom : 0 }]}>
                  <Text category='p1' style={layout.bold}>{t('trTagihan')}</Text>
                  <Text numberOfLines={1} category='c1' style={{color : ((this.state.data.status_tagihan == '2') ? '#60B8D6' : ((this.state.data.status_tagihan != '2') ? '#ff2929' : '#a1a1a1'))}}>{this.state.data.status_tagihan_f}</Text>
                </View>
                <View style={styles.bottomList}>
                  <Text category='p2' appearance='hint' style={layout.regular}>{t('trKodeTagihan')}</Text>
                  <Text category='p2' style={[layout.regular, styles.paddingVertical2]}>{this.state.data.kode_tagihan}</Text>
                </View>
                {
                  (this.state.data?.tanggal_bayar) && 
                  <View>
                    <View style={styles.listTagihan}>
                      <Text category='p2' appearance='hint' style={layout.regular}>{'Tanggal Pembayaran'}</Text>
                      <Text category='p2' style={[layout.regular, styles.paddingVertical2]}>{this.state.data.tanggal_bayar}</Text>
                    </View>
                    <View style={styles.listTagihan}>
                      <Text category='p2' appearance='hint' style={layout.regular}>{'Priode Sewa'}</Text>
                      <Text category='p2' style={[layout.regular, styles.paddingVertical2]}>{this.state.data.tanggal_sewa_f+' - '+this.state.data.tanggal_selesai_sewa_f}</Text>
                    </View>
                  </View>                 
                }
                <TouchableOpacity onPress={(this.state.data.is_parkir != '2' && this.props.state.user.role != '3' && this.state.data.status_tagihan == '0') ? this._renderModelHargaMotor : null} style={styles.listTagihan}>
                  <Text appearance='hint' category='p2' style={layout.regular}>{t('trParkirMotor')}</Text>
                  <Text category='p2' style={[layout.regular, styles.paddingVertical2]}>{this.state.data.harga_parkir_motor_f}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={(this.state.data.is_parkir != '1' && this.props.state.user.role != '3' && this.state.data.status_tagihan == '0') ? this._renderModelHargaMobil : null} style={styles.listTagihan}>
                  <Text appearance='hint' category='p2' style={layout.regular}>{t('trParkirMobil')}</Text>
                  <Text category='p2' style={[layout.regular, styles.paddingVertical2]}>{this.state.data.harga_parkir_mobil_f}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={(this.state.data.kapasitas > '1' && this.props.state.user.role != '3' && this.state.data.status_tagihan == '0') ? this._renderModelHargaTambahan : null} style={styles.listTagihan}>
                  <Text appearance='hint' category='p2' style={layout.regular}>{'Tambahan Biaya'}</Text>
                  <Text category='p2' style={[layout.regular, styles.paddingVertical2]}>{this.state.data.tambahan_biaya_f}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={(this.props.state.user.role != '3' && this.state.data.status_tagihan == '0') ? this._renderModelHargaKamar : null} style={styles.listTagihan}>
                  <Text appearance='hint' category='p2' style={layout.regular}>{t('trTotalSewa')}</Text>
                  <Text category='p2' style={[layout.regular, styles.paddingVertical2]}>{this.state.data.total_harga_sewa_f}</Text>
                </TouchableOpacity>
                {
                  (this.state.data.deposit) &&
                  <View onPress={(this.props.state.user.role != '3' && this.state.data.status_tagihan == '0') ? this._renderModelHargaDeposit : null} style={styles.listTagihan}>
                    <Text appearance='hint' category='p2' style={layout.regular}>{'Deposit'}</Text>
                    <Text category='p2' style={[layout.regular, styles.paddingVertical2]}>{this.state.data.deposit_f}</Text>
                  </View>
                }
                {
                  (this.state.data.refund) &&
                  <View style={styles.listTagihan}>
                    <Text appearance='hint' category='p2' style={layout.regular}>{'Refund'}</Text>
                    <Text category='p2' style={[layout.regular, styles.paddingVertical2]}>{this.state.data.refund_f}</Text>
                  </View>
                }
                <View style={[styles.bottomList, { paddingVertical : 4 }]}>
                  <Text category='p1' style={layout.bold}>{t('trTotalBayar')}</Text>
                  <View style={{flexDirection:'row', alignItems:'center'}}>
                    <Text category='p1'>{this.state.data.total_harga_f}</Text>
                  </View>
                </View>
                {/* <TouchableOpacity style={{ paddingVertical : 5, alignItems: 'flex-end'}}>
                  <Icon style={styles.iconFilter} name="printer-outline"/>
                </TouchableOpacity> */}
              </View>
            </View>
          </View>

        </View>
      </ScrollView>
    )
  }

  _renderHargaMotor = () => {
    return (
      <Card disabled={true} style={{width: BannerWidth}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={layout.bold}>Harga Parkir Motor</Text>
          <TouchableOpacity onPress={this._renderModelHargaMotor}>
            <Icon style={{color : '#000'}} name='close-outline'/>
          </TouchableOpacity>
        </View>
        <Input
          accessoryRight={() =>
            <Icon style={{color : '#8F9BB3'}} name='edit-2-outline'/>
          }
          size='small'
          style={styles.registerInput}
          textStyle={styles.loginTextInput}
          placeholder={t('iHargaParkirMotor')}
          value={this.state.set_motor}
          onChangeText={this._onChangeHargaMotor}
          status={(this.state.errHargaKamar) ? 'danger' : 'basic'}
          keyboardType={'numeric'}
        />
        <Button style={{width:'40%', alignSelf: 'flex-end'}} size='small' onPress={this._onHargaMotor}>Simpan</Button>
      </Card>
    )
  }

  _renderHargaMobil = () => {
    return (
      <Card disabled={true} style={{width: BannerWidth}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={layout.bold}>Harga Parkir Mobil</Text>
          <TouchableOpacity onPress={this._renderModelHargaMobil}>
            <Icon style={{color : '#000'}} name='close-outline'/>
          </TouchableOpacity>
        </View>
        <Input
          accessoryRight={() =>
            <Icon style={{color : '#8F9BB3'}} name='edit-2-outline'/>
          }
          size='small'
          style={styles.registerInput}
          textStyle={styles.loginTextInput}
          placeholder={t('iHargaParkirMobil')}
          value={this.state.set_mobil}
          onChangeText={this._onChangeHargaMobil}
          keyboardType={'numeric'}
        />
        <Button style={{width:'40%', alignSelf: 'flex-end'}} size='small' onPress={this._onHargaMobil}>Simpan</Button>
      </Card>
    )
  }

  _renderHargaTambahan = () => {
    return (
      <Card disabled={true} style={{width: BannerWidth}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={layout.bold}>Harga Tambahan</Text>
          <TouchableOpacity onPress={this._renderModelHargaTambahan}>
            <Icon style={{color : '#000'}} name='close-outline'/>
          </TouchableOpacity>
        </View>
        <Input
          accessoryRight={() =>
            <Icon style={{color : '#8F9BB3'}} name='edit-2-outline'/>
          }
          size='small'
          style={styles.registerInput}
          textStyle={styles.loginTextInput}
          placeholder={t('iBiayaTambahan')}
          value={this.state.set_tambahan}
          onChangeText={this._onChangeHargaTambahan}
          keyboardType={'numeric'}
        />
        <Button style={{width:'40%', alignSelf: 'flex-end'}} size='small' onPress={this._onHargaTambahan}>Simpan</Button>
      </Card>
    )
  }

  _renderHargaKamar = () => {
    return (
      <Card disabled={true} style={{width: BannerWidth}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={layout.bold}>Harga Kamar</Text>
          <TouchableOpacity onPress={this._renderModelHargaKamar}>
            <Icon style={{color : '#000'}} name='close-outline'/>
          </TouchableOpacity>
        </View>
        <Input
          accessoryRight={() =>
            <Icon style={{color : '#8F9BB3'}} name='edit-2-outline'/>
          }
          size='small'
          style={styles.registerInput}
          textStyle={styles.loginTextInput}
          placeholder={t('iHargaSewa')}
          value={this.state.set_kamar}
          onChangeText={this._onChangeHargaKamar}
          status={(this.state.errHargaKamar) ? 'danger' : 'basic'}
          keyboardType={'numeric'}
        />
        <Button style={{width:'40%', alignSelf: 'flex-end'}} size='small' onPress={this._onHargaSewa}>Simpan</Button>
      </Card>
    )
  }

  _renderHargaDeposit = () => {
    return (
      <Card disabled={true} style={{width: BannerWidth}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={layout.bold}>Deposit</Text>
          <TouchableOpacity onPress={this._renderModelHargaDeposit}>
            <Icon style={{color : '#000'}} name='close-outline'/>
          </TouchableOpacity>
        </View>
        <Input
          accessoryRight={() =>
            <Icon style={{color : '#8F9BB3'}} name='edit-2-outline'/>
          }
          size='small'
          style={styles.registerInput}
          textStyle={styles.loginTextInput}
          placeholder={t('iDeposit')}
          value={this.state.set_deposit}
          onChangeText={this._onChangeHargaDeposit}
          keyboardType={'numeric'}
        />
        <Button style={{width:'40%', alignSelf: 'flex-end'}} size='small' onPress={this._onHargaDeposit}>Simpan</Button>
      </Card>
    )
  }

  _onHargaMotor = () => {
    this.setState({isProcess : true}, () => {
      request({
        'model'     : 'Sewa_model',
        'key'       : 'setHargaMotor',
        'table'     : '-',
        'data'      : {
          'harga_parkir_motor' : this.state.set_motor.split('.').join('')
        },
        'where'     : {
          'sewa_id' : this.state.data.sewa_id
        }
      }).then((res) => {
        this.get_data();
      }).catch((error) => {
        this.setState({isLoading : false, isRefresh : false, isProcess : false});
      });
    })
  }

  _onHargaMobil = () => {
    this.setState({isProcess : true}, () => {
      request({
        'model'     : 'Sewa_model',
        'key'       : 'setHargaMobil',
        'table'     : '-',
        'data'      : {
          'harga_parkir_mobil' : this.state.set_mobil.split('.').join('')
        },
        'where'     : {
          'sewa_id' : this.state.data.sewa_id
        }
      }).then((res) => {
        this.get_data();
      }).catch((error) => {
        this.setState({isLoading : false, isRefresh : false, isProcess : false});
      });
    })
  }

  _onHargaTambahan = () => {
    this.setState({isProcess : true}, () => {
      request({
        'model'     : 'Sewa_model',
        'key'       : 'setHargaTambahan',
        'table'     : '-',
        'data'      : {
          'tambahan_biaya' : this.state.set_tambahan.split('.').join('')
        },
        'where'     : {
          'sewa_id' : this.state.data.sewa_id
        }
      }).then((res) => {
        this.get_data();
      }).catch((error) => {
        this.setState({isLoading : false, isRefresh : false, isProcess : false});
      });
    })
  }

  _onHargaSewa = () => {
    this.setState({isProcess : true}, () => {
      request({
        'model'     : 'Sewa_model',
        'key'       : 'setHargaSewa',
        'table'     : '-',
        'data'      : {
          'harga_kamar' : this.state.set_kamar.split('.').join('')
        },
        'where'     : {
          'sewa_id' : this.state.data.sewa_id
        }
      }).then((res) => {
        this.get_data();
      }).catch((error) => {
        this.setState({isLoading : false, isRefresh : false, isProcess : false});
      });
    })
  }

  _onHargaDeposit = () => {
    this.setState({isProcess : true}, () => {
      request({
        'model'     : 'Sewa_model',
        'key'       : 'setHargaDeposit',
        'table'     : '-',
        'data'      : {
          'deposit' : this.state.set_deposit.split('.').join('')
        },
        'where'     : {
          'sewa_id' : this.state.data.sewa_id
        }
      }).then((res) => {
        this.get_data();
      }).catch((error) => {
        this.setState({isLoading : false, isRefresh : false, isProcess : false});
      });
    })
  }

  _renderModelHargaMotor = () => {
    this.setState({ 
      isMotor   : !this.state.isMotor,
      set_motor : formatCur({value:this.state.data.harga_parkir_motor.split('.').join(''), input:true})
    });
  }
  
  _renderModelHargaMobil = () => {
    this.setState({ 
      isMobil   : !this.state.isMobil,
      set_mobil : formatCur({value:this.state.data.harga_parkir_mobil.split('.').join(''), input:true})
    });
  }

  _renderModelHargaTambahan = () => {
    this.setState({ 
      isTambahan   : !this.state.isTambahan,
      set_tambahan : formatCur({value:this.state.data.tambahan_biaya.split('.').join(''), input:true})
    });
  }

  _renderModelHargaKamar = () => {
    this.setState({ 
      isKamar   : !this.state.isKamar,
      set_kamar : formatCur({value:this.state.data.harga_sewa.split('.').join(''), input:true})
    });
  }

  _renderModelHargaDeposit = () => {
    this.setState({ 
      isDeposit   : !this.state.isDeposit,
      set_deposit : formatCur({value:this.state.data.deposit.split('.').join(''), input:true})
    });
  }

  _print = async () => {
    let fileName = 'Tagihan '+this.state.data.kode_tagihan;
    if (Platform.OS === "android") {
      const permissionGranted = await this.fRequestAndroidPermission(); 
      if (!permissionGranted) {
        console.log("access was refused")
        return; 
      }
    }

    request({
      'model'     : 'all_model',
      'key'       : 'get_pdf_tagihan',
      'table'     : '-',
      'where'     : {
        'data'     : this.state.data,
        'fileName' : fileName+'.pdf',
        'user_id'  : this.props.params.sewa.pemilik_id,
        'created_by' : this.props.params.sewa.created_by,
      },
    }).then((res) => {
      let dirs = RNFetchBlob.fs.dirs;
      RNFetchBlob.config({
        trusty    : true,
        overwrite : true,
        addAndroidDownloads : {
          useDownloadManager : true,
          notification : false,
          path : dirs.DownloadDir+'/Kostzy/Tagihan/'+fileName+'.pdf'
        }
      }).fetch('GET', res.data, {
      }).then((res) => {
        Toast.show('Tagihan Berhasil di Download', Toast.SHORT)
      })

    }).catch((error) => {
      this.setState({isLoading : false, isRefresh : false});
    });
  }

  fRequestAndroidPermission = async () => {
    // Refer to https://reactnative.dev/docs/permissionsandroid for further details on permsissions 
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "Permintaan Izin",
          message: "Koszy membutuhkan akses ke penyimpanan Anda sehingga Anda dapat menyimpan file ke perangkat Anda.",
          buttonNeutral: "Tanya lagi nanti",
          buttonNegative: "Batal",
          buttonPositive: "Izinkan"
        }
      );
      
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("permission is granted");
        return true; 
      } else {
        console.log("permission denied");
        return false; 
      }
    } catch (err) {
      console.error("fRequestAndroidPermission error:", err);
      return false; 
    }
  };

  _bayar = () => {
    this.props.navigation.push('GoTo', {
      page    : 'Pembayaran',
      params  : {
        transaksi_id  : this.state.data.transaksi_id,
        action        : this._onAction,
        actReload     : this._onRefresh
      }
    });
  }

  _renderModelHargaMobil = () => {
    this.setState({ 
      isMobil   : !this.state.isMobil,
      set_mobil : formatCur({value:this.state.data.harga_parkir_mobil.split('.').join(''), input:true})
    });
  }

  _onChangeHargaMotor = (text) => {
    this.setState({ set_motor : formatCur({value:text.split('.').join(''), input:true}) })
  }

  _onChangeHargaMobil = (text) => {
    this.setState({ set_mobil : formatCur({value:text.split('.').join(''), input:true}) })
  }
 
  _onChangeHargaTambahan = (text) => {
    this.setState({ set_tambahan : formatCur({value:text.split('.').join(''), input:true}) })
  }
  
  _onChangeHargaKamar = (text) => {
    this.setState({ set_kamar : formatCur({value:text.split('.').join(''), input:true}) })
  }

  _onChangeHargaDeposit = (text) => {
    this.setState({ set_deposit : formatCur({value:text.split('.').join(''), input:true}) })
  }

  _onAction = () => {
    this.props.navigation.pop();
    this._onRefresh();
  }

  _onRefresh = () => {
    this.setState({
      isRefresh : true
    }, () => {
      this.get_data();
    })
  }

}


const mapStateToProps = state => ({state: state});
const mapDispatchToProps = dispatch => ({

});
export default connect(mapStateToProps, mapDispatchToProps)(TagihanDetail);