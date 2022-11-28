import React, { Component } from 'react';
import { View, ScrollView, RefreshControl, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { Container, Header, ListItem, Process } from '../../theme';
import { Layout, Text, Spinner, Icon, Card, Modal, Input, SelectItem, BottomNavigation, Button } from '@ui-kitten/components';
import { connect } from 'react-redux';
import t from '../../lang';
import { request } from '../../bridge';
import { formatDate, formatCur } from '../../func';
import { setReload } from '../../root/redux/actions';
import layout from '../../theme/styles/layout';
import styles from '../../theme/styles/styles';
import { StackActions  } from '@react-navigation/native';

const BannerWidth = Dimensions.get('window').width - 32;
const BannerHeight = Dimensions.get('window').height/3.5;

class Pembayaran extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading     : true,
      isProcess     : false,
      isKamar       : false,
      isMotor       : false,
      isMobil       : false,
      isTambahan    : false,
      isDeposit     : false,
      set_kamar     : '',
      set_motor     : '',
      set_mobil     : '',
      set_deposit   : '',
      data          : [],
    }
  }

  componentDidMount = () => {
    this._getData()
  }

  _getData = () => {
    this.setState({isProcess : true}, () => {
      request({
        'model'     : 'Sewa_model',
        'key'       : 'getTagihan',
        'table'     : '-',
        'where'     : {
          'tagihan_id' : this.props.params.tagihan_id,
        }
      }).then((res) => {
        this.setState({
          data       : res.data,
          isRefresh  : false,
          isLoading  : false,
          isKamar    : false,
          isMotor    : false,
          isMobil    : false,
          isTambahan : false,
          isDeposit  : false,
          isProcess  : false
        });
      }).catch((error) => {
        this.setState({isLoading : false, isRefresh : false, isProcess : false});
      });
    })
  }

  render() {
    return (
      <Container>
        <Header navigation={this.props.navigation} params={{
          center : t('pPembayaran'),
          isBack : false
        }}/>
        <Layout style={layout.container}>
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={this.state.isLoading ? layout.container : null}
            refreshControl={
               <RefreshControl refreshing={this.state.isRefresh} onRefresh={this._onRefresh} />
            }>
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
            <Button style={{marginVertical : 10, marginLeft: 10, marginRight:5}} onPress={this._onDetailClick}>{'Detail Sewa'}</Button>
            <Button style={{marginVertical : 10, marginRight: 10, marginLeft: 5}} onPress={this._onBayarClick}>{'Bayar'}</Button>
          </BottomNavigation>
        </Layout>
        <Modal
          backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
          onBackdropPress={this._renderModelHargaKamar}
          visible={this.state.isKamar}>
            {this._renderHargaKamar()}
        </Modal>
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
      <View style={styles.containerInner}>
        <View style={[styles.containerHeader, {borderRadius: 5, justifyContent: 'flex-start'}]}>
          {
            (this.state.data?.pembayaran?.gambar_link) &&
            <Image style={{height: '100%', width: 100, resizeMode: "contain"}} source={{uri : this.state.data?.pembayaran?.gambar_link}} />
          }
          <View style={{marginHorizontal: 20, justifyContent: 'space-around', height: 70}}>
            <Text style={layout.bold} category="p1">{this.state.data?.pembayaran?.no_rekening}</Text>
            <Text style={layout.regular} category="p2">{this.state.data?.pembayaran?.pemilik}</Text>
            <Text style={layout.regular} category="p2" appearance="hint">{this.state.data?.pembayaran?.nama_bank}</Text>
          </View>
        </View>
        <View style={[styles.containerHeader, {borderRadius: 5}]}>
          <View style={{height: BannerHeight, justifyContent: 'space-around'}}>
            <TouchableOpacity onPress={this._renderModelHargaKamar}>
              <Text style={layout.regular} category="p1" appearance="hint">{'Harga Sewa'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={(this.state.data?.is_parkir == '1' || this.state.data?.is_parkir == '3') ? this._renderModelHargaMotor : () => ''}>
              <Text style={layout.regular} category="p1" appearance="hint">{'Harga Parkir Motor'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={(this.state.data?.is_parkir == '2' || this.state.data?.is_parkir == '3') ? this._renderModelHargaMobil : () => ''}>
              <Text style={layout.regular} category="p1" appearance="hint">{'Harga Parkir Mobil'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={(this.state.data?.kapasitas == '2') ? this._renderModelHargaTambahan : () => ''}>
              <Text style={layout.regular} category="p1" appearance="hint">{'Tambahan Biaya'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this._renderModelHargaDeposit}>
              <Text style={layout.regular} category="p1" appearance="hint">{'Deposit'}</Text>
            </TouchableOpacity>
            <View style={{borderWidth: 0, width: '100%', borderColor: '#e3e3e3'}}/>
            <Text style={layout.regular} category="p1" appearance="hint">{'Total Bayar'}</Text>
          </View>
          <View style={{height: BannerHeight, justifyContent: 'space-around'}}>
            <TouchableOpacity onPress={this._renderModelHargaKamar}>
              <Text style={layout.semiBold} category="p1">{this.state.data?.harga_sewa_f}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={(this.state.data?.is_parkir == '1' || this.state.data?.is_parkir == '3') ? this._renderModelHargaMotor : () => ''}>
              <Text style={layout.semiBold} category="p1">{this.state.data?.harga_parkir_motor_f}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={(this.state.data?.is_parkir == '2' || this.state.data?.is_parkir == '3') ? this._renderModelHargaMobil : () => ''}>
              <Text style={layout.semiBold} category="p1">{this.state.data?.harga_parkir_mobil_f}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={(this.state.data?.kapasitas == '2') ? this._renderModelHargaTambahan : () => ''}>
              <Text style={layout.semiBold} category="p1">{this.state.data?.tambahan_biaya_f}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this._renderModelHargaDeposit}>
              <Text style={layout.semiBold} category="p1">{this.state.data?.deposit_f}</Text>
            </TouchableOpacity>
            <View style={{borderWidth: 0.5, width: '100%', borderColor: '#e3e3e3'}}/>
            <Text style={layout.semiBold} category="p1">{this.state.data?.total_harga_f}</Text>
          </View>
        </View>
      </View>
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

  _renderModelHargaKamar = () => {
    this.setState({ 
      isKamar   : !this.state.isKamar,
      set_kamar : formatCur({value:this.state.data.harga_sewa.split('.').join(''), input:true})
    });
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

  _renderModelHargaDeposit = () => {
    this.setState({ 
      isDeposit   : !this.state.isDeposit,
      set_deposit : formatCur({value:this.state.data.deposit.split('.').join(''), input:true})
    });
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
        this._getData();
      }).catch((error) => {
        this.setState({isLoading : false, isRefresh : false, isProcess : false});
      });
    })
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
        this._getData();
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
        this._getData();
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
        this._getData();
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
        this._getData();
      }).catch((error) => {
        this.setState({isLoading : false, isRefresh : false, isProcess : false});
      });
    })
  }

  _onChangeHargaKamar = (text) => {
    this.setState({ set_kamar : formatCur({value:text.split('.').join(''), input:true}) })
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

  _onChangeHargaDeposit = (text) => {
    this.setState({ set_deposit : formatCur({value:text.split('.').join(''), input:true}) })
  }

  _onDetailClick = () => {
    this.props.navigation.replace('GoTo', {
      page : 'KamarKu'
    });
  }

  _onBayarClick = () => {
    this.props.setReload({key : 'home', value : true});
    this.props.state.reload.home;
    this.props.navigation.replace('GoTo', {
      page : 'BuktiBayarProses',
      params : {
        sewa    : this.state.data,
        isSewa  : true
      }
    });
  }

}

const mapStateToProps = state => ({state: state});
const mapDispatchToProps = dispatch => ({
  setReload: (data) => dispatch(setReload(data)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Pembayaran);
