import React, { Component } from 'react';
import { View, ScrollView, RefreshControl, Image, TouchableOpacity, FlatList, Dimensions, Modal as ModalReact } from 'react-native';
import { Container, Header, ListItem, Process } from '../../theme';
import { Card, Layout, Text, Spinner, Icon, Calendar, Modal, Select, SelectItem, BottomNavigation, Button, Input, CheckBox, Radio, RadioGroup } from '@ui-kitten/components';
import { connect } from 'react-redux';
import t from '../../lang';
import { request } from '../../bridge';
import { formatDate, formatCur } from '../../func';
import { setReload } from '../../root/redux/actions';
import layout from '../../theme/styles/layout';
import styles from '../../theme/styles/styles';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const BannerWidth  = Dimensions.get('window').width-32;
const BannerHeight = Dimensions.get('window').height/1.5;

class Sewa extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading      : true,
      isProcess      : false,
      isOpsiTanggal  : false,
      isDeposit      : false,
      isKapasitas    : false,
      isPeraturan    : false,
      isSewa         : false,
      isNamaPenghuni : false,
      tanggal_now    : new Date(),
      nama_penghuni  : '',
      kamar          : '',
      kamar_id       : '',
      set_kamar      : '',
      kapasitas      : '',
      peraturan      : '',
      penghuni       : '',
      setDeposit     : '',
      data_lantai    : [],
      data_kamar     : [],
      rincian        : [],
      data           : [],
      dataAct        : [],
      data_parkir    : []
    }
  }

  componentDidMount = () => {
    this._getData()
  }

  _getData = () => {
    this.setState({isProcess : true}, () => {
      request({
        'model'     : 'Sewa_model',
        'key'       : 'afterProcess',
        'table'     : '-',
        'where'     : {
          'sewa_id'    : this.props.params.sewa_id,
          'created_by' : this.props.state.user.user_id,
        }
      }).then((res) => {
        this.setState({
          data             : res.data,
          data_kamar       : res.data.data_kamar,
          data_lantai      : res.data.lantai,
          tanggal_now      : formatDate({date : this.state.tanggal_now, format : 'YYYY-MM-DD'}),
          deposit          : (res.data.deposit) ? formatCur({value:res.data.deposit.split('.').join(''), input:true}) : '',
          harga_kamar      : (res.data.harga_sewa) ? formatCur({value:res.data.harga_sewa_f.split('.').join(''), input:true}) : '',
          set_kamar        : (res.data.harga_sewa) ? formatCur({value:res.data.harga_sewa_f.split('.').join(''), input:true}) : '',
          value_lantai     : res.data?.value_lantai,
          value_tipe_kamar : res.data?.value_tipe_kamar,
          value_lama_sewa  : res.data?.value_lama_sewa,
          data_parkir      : res.data?.data_parkir,
          kapasitas        : res.data?.kapasitas-1,
          penghuni         : res.data?.penghuni,
          nama_penghuni    : res.data?.penghuni,
          isRefresh        : false,
          isDeposit        : false,
          isKamar          : false,
          isKapasitas      : false,
          isLoading        : false,
          isProcess        : false
        });
        this._setRincian(res);
      }).catch((error) => {
        this.setState({isLoading : false, isRefresh : false, isProcess : false});
      });
    })
  }

  _renderRician = () => {
    return this.state.rincian.map((item, index) => {
      if (item?.isRadius) {
        return (
          <>
            <View style={{borderWidth: 0.5, width: '100%', borderColor: '#e3e3e3'}}/>
            <View style={[styles.row, {marginVertical: 5}]} key={index}>
              <Text style={layout.semiBold} category="s1">{item.field}</Text>
              <Text style={layout.semiBold} category="s1">{item.value}</Text>
            </View>
          </>
        )
      }

      if (!item.isHide) {
        return (
          <View style={[styles.row, {marginVertical: 5}]} key={index}>
            <Text style={layout.regular} category="s1">{item.field}</Text>
            <Text style={layout.regular} category="s1">{item.value}</Text>
          </View>
        )
      }
    });
  }

  _setRincian = (item) => {
    this.setState({
      rincian : [
        {
          field : 'Total Harga',
          value : (item.data.harga_sewa) ? item.data.harga_sewa_f : '-'
        },
        {
          field  : 'Total Parkir Motor',
          value  : (item.data?.is_parkir == '1' || item.data?.is_parkir == '3') ? item.data.harga_parkir_motor_f : '-',
          isHide : (item.data.harga_parkir_motor) ? false : true
        },
        {
          field  : 'Total Parkir Mobil',
          value  : (item.data?.is_parkir == '2' || item.data?.is_parkir == '3') ? item.data.harga_parkir_mobil_f : '-',
          isHide : (item.data.harga_parkir_mobil) ? false : true
        },
        {
          field  : 'Tambahan Biaya',
          value  : (item.data.kapasitas > '1') ? item.data.tambahan_biaya_f : '-',
          isHide : (item.data.kapasitas > '1') ? false : true
        },
        {
          field  : 'Deposit',
          value  : (item.data.deposit != '0') ? formatCur({value:item.data.deposit.split('.').join(''), input:false}) : '-',
          isHide : (item.data.deposit != '0') ? false : true
        },
        {
          field    : 'Total Bayar',
          value    : (item.data.total_bayar) ? item.data.total_bayar_f : '-',
          isRadius : true
        },
      ]
    });
  }

  render() {
    return (
      <Container>
        <Header navigation={this.props.navigation} params={{
          center : t('pProsesSewa'),
          isBack : true
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
          {
            (this.state.data.kamar_id) &&
              <View style={{marginHorizontal: 20}}>
              <View style={{borderWidth: 0.4, width: '100%', borderColor: '#e3e3e3'}}/>
                {this._renderRician()}
              </View>
          }
        </Layout>
        <BottomNavigation appearance="noIndicator">
          <Button style={{marginVertical : 10, marginHorizontal: 10}} disabled={(!this.state.data.value_tipe_kamar || !this.state.data.kamar_id || (this.state.data.kapasitas == '2' && !this.state.data.penghuni)) ? true : false} onPress={() => this._pageKetentuanSewa()}>{'Sewa'}</Button>
        </BottomNavigation>
        <ActionSheet
          ref={o => this._renderSheet = o}
          title={<View style={layout.actionSheetHeader}></View>}
          options={this.state.dataAct}
          styles={layout.actionSheet}
          cancelButtonIndex={0}
        />
        <Modal
          backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
          onBackdropPress={this._renderModelDeposit}
          visible={this.state.isDeposit}>
            {this._renderDeposit()}
        </Modal>
        <Modal
          backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
          onBackdropPress={this._renderModelHargaKamar}
          visible={this.state.isKamar}>
            {this._renderHargaKamar()}
        </Modal>
        <Modal
          backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
          onBackdropPress={this._renderModelKapasitas}
          visible={this.state.isKapasitas}>
            {this._renderKapasitas()}
        </Modal>
        <ModalReact
          onBackdropPress={this._modelSewa}
          transparent={true}
          visible={this.state.isSewa}>
            {this._renderSewa()}
        </ModalReact>
        <Modal
          backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
          onBackdropPress={this._modelPenghuni}
          visible={this.state.isNamaPenghuni}>
            {this._renderItemPenghuni()}
        </Modal>
        <DateTimePickerModal
          isVisible={this.state.isOpsiTanggal}
          minimumDate={new Date()}
          date={new Date(this.state.data?.tanggal_sewa ?? this.state.tanggal_now)}
          mode="date"
          onCancel={this._modalHide}
          onConfirm={(item) => this._cTanggal(item)}
        />
        <Process visible={this.state.isProcess}/>
      </Container>
    )
  }

  _modalHide = () => {
    this.setState({ isOpsiTanggal : false });
  }

  _setTanggal = () => {
    this.setState({
      isOpsiTanggal : !this.state.isOpsiTanggal
    });
  }

  _cTanggal = (date) => {
    let newData = this.state.data;
    newData.tanggal_sewa = formatDate({date : date, format : 'YYYY-MM-DD'});
    this.setState({isProcess : true, isOpsiTanggal : false}, () => {
      request({
        'model'     : 'Sewa_model',
        'key'       : 'setTanggal',
        'table'     : '-',
        'where'     : {
          'sewa_id'      : this.state.data.sewa_id,
          'tanggal_sewa' : newData.tanggal_sewa,
        }
      }).then((res) => {
        this._getData();
      }).catch((error) => {
        this.setState({isLoading : false, isRefresh : false, isProcess : false});
      });
    })
  }

  _renderContainer = () => {
    return (
      <Layout style={styles.containerInner}>
        <View style={{marginTop: 5}}>
          <View style={{flexDirection: 'row', alignItems: 'center', marginVertical: 10}}>
            <Image style={styles.iconSewaKosan} source={{uri : this.state.data.properti.gambar_link}} />
            <Text style={layout.bold}>{this.state.data.properti.nama_properti}</Text>
          </View>
          <View style={{borderWidth: 0.4, width: '100%', borderColor: '#e3e3e3'}}/>
          <View style={{flexDirection: 'row', alignItems: 'center', marginVertical: 10, justifyContent: 'space-between'}}>
            {/* <View>
              <Text style={[layout.regular, layout.semiBold]} category='c2'>Kapasitas</Text>
              <Text style={layout.regular} category='c2'>{t('trKapasitas', {jumlah : this.state.kapasitas})}</Text>
            </View> */}
            <View>
              <Text style={[layout.regular, layout.semiBold]} category='c2'>Kapasitas</Text>
              <RadioGroup
                style={{flexDirection: 'row', size: 5}}
                selectedIndex={this.state.kapasitas}
                onChange={index => this._setSelectedKapasitas(index)}>
                <Radio>1 Orang</Radio>
                <Radio>2 Orang</Radio>
              </RadioGroup>
              </View>
            <Icon style={{width: 20, height: 20, color: '#6e6e6e'}} name="people-outline"/>
          </View>
          {
            (this.state.kapasitas == '1') &&
            <View>
              <View style={{borderWidth: 0.4, width: '100%', borderColor: '#e3e3e3'}}/>
              <TouchableOpacity onPress={this._modelPenghuni} style={{flexDirection: 'row', alignItems: 'center', marginVertical: 10, justifyContent: 'space-between'}}>
                <View>
                  <Text style={[layout.regular, layout.semiBold]} category='c2'>Penghuni</Text>
                  <Text style={layout.regular} category='c2'>{(this.state.penghuni) ? this.state.penghuni : t('iPenghuni')}</Text>
                </View>
                <Icon style={{width: 20, height: 20, color: '#6e6e6e'}} name="calendar-outline"/>
              </TouchableOpacity>
            </View>

          }
          <View style={{borderWidth: 0.4, width: '100%', borderColor: '#e3e3e3'}}/>
          <TouchableOpacity onPress={this._setTanggal} style={{flexDirection: 'row', alignItems: 'center', marginVertical: 10, justifyContent: 'space-between'}}>
            <View>
              <Text style={[layout.regular, layout.semiBold]} category='c2'>Tanggal Sewa</Text>
              <Text style={layout.regular} category='c2'>{(this.state.data.tanggal_sewa) ? this.state.data.tanggal_sewa : this.state.tanggal_now}</Text>
            </View>
            <Icon style={{width: 20, height: 20, color: '#6e6e6e'}} name="calendar-outline"/>
          </TouchableOpacity>
          {/* <View style={{borderWidth: 0.4, width: '100%', borderColor: '#e3e3e3'}}/>
          <TouchableOpacity onPress={this._renderLamaSewa} style={{flexDirection: 'row', alignItems: 'center', marginVertical: 10, justifyContent: 'space-between'}}>
            <View>
              <Text style={[layout.regular, layout.semiBold]} category='c2'>Lama Sewa</Text>
              <Text style={layout.regular} category='c2'>{(this.state.value_lama_sewa) ? this.state.value_lama_sewa : 'Pilih Lama Sewa'}</Text>
            </View>
            <Icon style={{width: 20, height: 20, color: '#6e6e6e'}} name="calendar-outline"/>
          </TouchableOpacity> */}
          {
            // <View style={{borderWidth: 0.4, width: '100%', borderColor: '#e3e3e3'}}/>
            // <TouchableOpacity onPress={this._renderItemLantai} style={{flexDirection: 'row', alignItems: 'center', marginVertical: 10, justifyContent: 'space-between'}}>
            //   <View>
            //     <Text style={[layout.regular, layout.semiBold]} category='c2'>Lantai</Text>
            //     <Text style={layout.regular} category='c2'>{(this.state.value_lantai) ? this.state.value_lantai : 'Pilih Lantai'}</Text>
            //   </View>
            //   <Icon style={{width: 20, height: 20, color: '#6e6e6e'}} name="archive-outline"/>
            // </TouchableOpacity>
          }
          <View style={{borderWidth: 0.4, width: '100%', borderColor: '#e3e3e3'}}/>
          <TouchableOpacity onPress={this._renderItemTipeKamar} style={{flexDirection: 'row', alignItems: 'center', marginVertical: 10, justifyContent: 'space-between'}}>
            <View>
              <Text style={[layout.regular, layout.semiBold]} category='c2'>Tipe Kamar</Text>
              <Text style={layout.regular} category='c2'>{(this.state.value_tipe_kamar) ? this.state.value_tipe_kamar : 'Pilih Tipe Kamar'}</Text>
            </View>
            <Icon style={{width: 20, height: 20, color: '#6e6e6e'}} name="layout-outline"/>
          </TouchableOpacity>
          {
            (this.state?.data_kamar?.length > 0) &&
            <>
              <View style={{borderWidth: 0.4, width: '100%', borderColor: '#e3e3e3'}}/>
              <TouchableOpacity onPress={this._renderModelDeposit} style={{flexDirection: 'row', alignItems: 'center', marginVertical: 10, justifyContent: 'space-between'}}>
                <View>
                  <Text style={[layout.regular, layout.semiBold]} category='c2'>Deposit</Text>
                  <Text style={layout.regular} category='c2'>{(this.state.deposit != '0') ? this.state.deposit : '-'}</Text>
                </View>
                <Icon style={{width: 20, height: 20, color: '#6e6e6e'}} name="credit-card-outline"/>
              </TouchableOpacity>
            </>
          }
          {
            (this.state?.data_parkir?.length > 0) &&
            <>
              <View style={{borderWidth: 0.4, width: '100%', borderColor: '#e3e3e3'}}/>
              <TouchableOpacity onPress={this._renderItemParkir} style={{flexDirection: 'row', alignItems: 'center', marginVertical: 10, justifyContent: 'space-between'}}>
                <View>
                  <Text style={[layout.regular, layout.semiBold]} category='c2'>Layanan Parkir</Text>
                  <Text style={layout.regular} category='c2'>{(this.state.data.is_parkir == '0') ? 'Pilih Parkir' : this.state.data.value_parkir}</Text>
                </View>
                <Icon style={{width: 20, height: 20, color: '#6e6e6e'}} name="car-outline"/>
              </TouchableOpacity>
            </>
          }
          {
            (this.state.data.kamar_id) &&
            <>
              <View style={{borderWidth: 0.4, width: '100%', borderColor: '#e3e3e3'}}/>
              <TouchableOpacity onPress={this._renderModelHargaKamar} style={{flexDirection: 'row', alignItems: 'center', marginVertical: 10, justifyContent: 'space-between'}}>
                <View>
                  <Text style={[layout.regular, layout.semiBold]} category='c2'>Harga Kamar</Text>
                  <Text style={layout.regular} category='c2'>{(this.state.harga_kamar) ? this.state.harga_kamar : '-'}</Text>
                </View>
                <Icon style={{width: 20, height: 20, color: '#6e6e6e'}} name="shopping-bag-outline"/>
              </TouchableOpacity>
            </>
          }
          {
            (this.state?.data_kamar?.length > 0) &&
            <>
              <View style={{borderWidth: 0.4, width: '100%', borderColor: '#e3e3e3'}}/>
              <View style={{ marginVertical: 10}}>
                <Text style={[layout.regular, layout.semiBold]} category='c2'>Kamar</Text>
                <FlatList
                  data={this.state.data_kamar}
                  renderItem={this._renderItem}
                />
              </View>
            </>
          }
        </View>

      </Layout>
    )
  }

  _setSelectedKapasitas = (index) => {
    this.setState({isProcess : true, kapasitas : index}, () => {
      request({
        'model'     : 'Sewa_model',
        'key'       : 'setKapasitas',
        'table'     : '-',
        'data'      : {
          'kapasitas' : index+1
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

  _renderModelHargaKamar = () => {
    this.setState({ 
      isKamar   : !this.state.isKamar,
      set_kamar : this.state.harga_kamar
    });
  }

  _renderModelDeposit = () => {
    this.setState({ 
      isDeposit  : !this.state.isDeposit,
      setDeposit : this.state.deposit
    });
  }

  _renderModelKapasitas = () => {
    this.setState({ isKapasitas: !this.state.isKapasitas });
  }

  _renderItemLantai = () => {
    this._renderSheet.show();
    let dataAct = [
      <Text status='danger'>{t('bClose')}</Text>
    ];
    this.state.data.lantai.map((item, index) => {
      dataAct.push(
        <ListItem
          title={item.value_lantai}
          descriptionStyle={layout.regular}
          onPress={() => this._setLantai(item.lantai_id, item.value_lantai)}
        />
      )
    });

    this.setState({ dataAct : dataAct });
  }

  _modelPenghuni = () => {
    this.setState({isNamaPenghuni : !this.state.isNamaPenghuni});
  }

  _renderItemPenghuni = () => {
    return (
      <Layout style={{width : BannerWidth, borderRadius: 5}}>
        <View style={{paddingHorizontal: 20, paddingVertical: 25}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 10}}>
            <Text style={[layout.regular, layout.bold]}>Penghuni</Text>
            <TouchableOpacity onPress={this._modelPenghuni}>
              <Icon style={{color : '#000000'}} name='close-outline'/>
            </TouchableOpacity>
          </View>
          <Input
            accessoryRight={() =>
              <Icon style={{color : '#8F9BB3'}} name='edit-2-outline'/>
            }
            size='small'
            style={styles.registerInput}
            textStyle={styles.loginTextInput}
            placeholder={t('iPenghuni')}
            value={this.state.nama_penghuni}
            onChangeText={this._onChangePenghuni}
            status={(this.state.errPenghuni) ? 'danger' : 'basic'}
          />
          <Button style={{width:'40%', alignSelf: 'flex-end'}} size='small' onPress={this._onSubmitPenghuni}>Simpan</Button>
        </View>
      </Layout>
    )
  }

  _onChangePenghuni = (text) => {
    this.setState({nama_penghuni: text})
  }
  
  _onSubmitPenghuni = () => {
    this.setState({
      errPenghuni : (this.state.nama_penghuni ? false : true)
    }, () => {
      if (!this.state.errPenghuni) {
          this.setState({isProcess : true}, () => {
            request({
              'model'     : 'Sewa_model',
              'key'       : 'setPenghuni',
              'table'     : '-',
              'data'      : {
                'penghuni' : this.state.nama_penghuni
              },
              'where'     : {
                'sewa_id' : this.state.data.sewa_id
              }
            }).then((res) => {
              this._modelPenghuni();
              this._getData();
            }).catch((error) => {
              this.setState({isLoading : false, isRefresh : false, isProcess : false});
            });
          });
        }
    })
  }
  // _renderItemPenghuni = () => {
  //   this._renderSheet.show();
  //   let dataAct = [
  //     <Text status='danger'>{t('bClose')}</Text>
  //   ];
  //   this.state.data.data_penghuni.map((item, index) => {
  //     dataAct.push(
  //       <ListItem
  //         title={item}
  //         descriptionStyle={layout.regular}
  //         onPress={() => this._setPenghuni(index)}
  //       />
  //     )
  //   });

  //   this.setState({ dataAct : dataAct });
  // }

  _renderItemTipeKamar = () => {
    this._renderSheet.show();
    let dataAct = [
      <Text status='danger'>{t('bClose')}</Text>
    ];
    this.state.data.tipe_kamar.map((item, index) => {
      dataAct.push(
        <ListItem
          title={item.tipe_kamar}
          descriptionStyle={layout.regular}
          onPress={() => this._setTipeKamar(item.tipe_kamar_id, item.tipe_kamar)}
        />
      )
    });

    this.setState({ dataAct : dataAct });
  }

  _renderLamaSewa = () => {
    this._renderSheet.show();
    let dataAct = [
      <Text status='danger'>{t('bClose')}</Text>
    ];
    this.state.data.data_lama_sewa.map((item, index) => {
      dataAct.push(
        <ListItem
          title={item.value}
          descriptionStyle={layout.regular}
          onPress={() => this._setLamaSewa(item)}
        />
      )
    });

    this.setState({ dataAct : dataAct });
  }

  _renderItemParkir = () => {
    this._renderSheet.show();
    let dataAct = [
      <Text status='danger'>{t('bClose')}</Text>
    ];
    this.state.data_parkir.map((item, index) => {
      dataAct.push(
        <ListItem
          title={item.value_parkir}
          descriptionStyle={layout.regular}
          onPress={() => this._setParkir(item.is_parkir)}
        />
      )
    });

    this.setState({ dataAct : dataAct });
  }

  _renderItem = ({item, index}) => {
    if (item.isSelect) {
      this.setState({harga : item.harga});
    }
    if (!item.isActive) {
      return (
        <View opacity={(item.isActive) ? 0.5 : 1}>
          <TouchableOpacity disabled={item.isActive} style={{paddingVertical: 10, paddingHorizontal: 0}} onPress={() => this._pilihKamar(item)}>
            <View style={styles.containerInfo}>
              {
                (item.gambar_link) &&
                <Image style={styles.listItemImgSewa} source={{uri : item.gambar_link}}/>
              }
              <View style={{flex: 1}}>
                <Text numberOfLines={1} style={[layout.regular, layout.bold, {marginVertical: 2}]} category='p2'>{t('aNomorKamar', {nomor_kamar : item.nomor_kamar})}</Text>
                <Text numberOfLines={1} style={[layout.regular, {marginVertical: 2}]} category='p2'>{item?.lantai_f}</Text>
                <Text numberOfLines={1} style={[layout.regular, {marginVertical: 2}]} category='p2'>{item.harga_f}</Text>
                <Text numberOfLines={1} style={[layout.regular, {marginVertical: 2}]} category='p2'>{(item.isActive) ? 'Tidak Tersedia' : 'Tersedia'}</Text>
                {
                  (item.isSelect) &&
                  <View style={{position: 'absolute', top: 0, right: 0}}>
                    <Icon style={{color : '#60b8d6'}} name={'checkmark-square-outline'}/>
                  </View>
                }
              </View>
  
            </View>
          </TouchableOpacity>
        </View>
      )        
    }
  }

  _renderDeposit = () => {
    return (
      <Card disabled={true} style={{width: BannerWidth}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={layout.bold}>Deposit</Text>
          <TouchableOpacity onPress={this._renderModelDeposit}>
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
          value={this.state.setDeposit}
          onChangeText={this._onChangeDeposit}
          status={(this.state.errDeposit) ? 'danger' : 'basic'}
          keyboardType={'numeric'}
        />
        <Button style={{width:'40%', alignSelf: 'flex-end'}} size='small' onPress={this._onDeposit}>Simpan</Button>
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
          placeholder={t('iDeposit')}
          value={this.state.set_kamar}
          onChangeText={this._onChangeHargaKamar}
          status={(this.state.errHargaKamar) ? 'danger' : 'basic'}
          keyboardType={'numeric'}
        />
        <Button style={{width:'40%', alignSelf: 'flex-end'}} size='small' onPress={this._onHargaSewa}>Simpan</Button>
      </Card>
    )
  }

  _renderKapasitas = () => {
    return (
      <Card disabled={true} style={{width: BannerWidth}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={layout.bold}>Kapasitas</Text>
          <TouchableOpacity onPress={this._renderModelKapasitas}>
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
          placeholder={t('iKapasitas')}
          value={this.state.penghuni}
          onChangeText={this._onChangeKapasitas}
          status={(this.state.errPenghini) ? 'danger' : 'basic'}
          keyboardType={'numeric'}
          caption={t('aMaxOrang')}
        />
        <Button style={{width:'40%', alignSelf: 'flex-end'}} size='small' onPress={this._onKapasitas}>Simpan</Button>
      </Card>
    )
  }

  _renderSewa = () => {
    return (
      <ScrollView disabled={true} style={{height: BannerHeight, flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={layout.bold}>Peraturan Kos</Text>
          <TouchableOpacity onPress={this._modelSewa}>
            <Icon style={{color : '#000'}} name='close-outline'/>
          </TouchableOpacity>
        </View>
          <Text style={[layout.regular, {margin: 10}]}>
            {this.state.data?.properti?.peraturan}
          </Text>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <CheckBox
            checked={this.state.isPeraturan}
            onChange={() => this.setState({isPeraturan: !this.state.isPeraturan})}>
            Setuju
          </CheckBox>
          <Button style={{width:'40%', marginTop: 10}} size='small' onPress={this._prosesSewa} disabled={!this.state.isPeraturan}>Sewa</Button>
        </View>
      </ScrollView>
    )
  }

  _renderOption = (title) => (
    <SelectItem title={title.value_lantai}/>
  );

  _onChangeDeposit = (text) => {
    this.setState({ setDeposit : formatCur({value:text.split('.').join(''), input:true}) })
  }

  _onChangeHargaKamar = (text) => {
    // if (text.split('.').join('') >= this.state.harga) {
    //   this.setState({ set_kamar : formatCur({value:this.state.harga, input:true}) })
    // } else {
    //   this.setState({ set_kamar : formatCur({value:text.split('.').join(''), input:true}) })
    // }
    this.setState({ set_kamar : formatCur({value:text.split('.').join(''), input:true}) })
  }

  _onChangeKapasitas = (text) => {
    if (text <= '2' && text != '0') {
      this.setState({ penghuni : text })
    } else {
      this.setState({ penghuni : '1' })
    }
  }

  _onDeposit = (data) => {
    // this.setState({
    //   errDeposit : (this.state.setDeposit && this.state.setDeposit != '0' ? false : true)
    // }, () => {
      // if (!this.state.errDeposit) {
        this.setState({isProcess : true}, () => {
          request({
            'model'     : 'Sewa_model',
            'key'       : 'setDeposit',
            'table'     : '-',
            'data'      : {
              'deposit' : this.state.setDeposit.split('.').join('')
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
      // }
    // })
  }

  _onHargaSewa = () => {
    // this.setState({
    //   errHargaKamar : (this.state.set_kamar && this.state.set_kamar != '0' ? false : true)
    // }, () => {
    //   if (!this.state.errHargaKamar) {
        this.setState({isProcess : true}, () => {
          request({
            'model'     : 'Sewa_model',
            'key'       : 'setHargaKamar',
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
    //   }
    // })
  }

  _onKapasitas = (data) => {
    this.setState({
      errPenghini : (this.state.penghuni && this.state.penghuni != '0' ? false : true)
    }, () => {
      if (!this.state.errPenghini) {
        this.setState({isProcess : true}, () => {
          request({
            'model'     : 'Sewa_model',
            'key'       : 'setKapasitas',
            'table'     : '-',
            'data'      : {
              'kapasitas' : this.state.penghuni
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
    })
  }

  _pilihKamar = (data) => {
    let newData    = this.state.data;
    let data_kamar = [];
    this.setState({isProcess : true}, () => {
      request({
        'model'     : 'Sewa_model',
        'key'       : 'setKamar',
        'table'     : '-',
        'where'     : {
          'sewa_id'    : this.state.data.sewa_id,
          'kamar_id'   : data.kamar_id,
        }
      }).then((res) => {
        this._getData();
      }).catch((error) => {
        this.setState({isLoading : false, isRefresh : false, isProcess : false});
      });
    })
  }

  _modelSewa = () => {
    this.setState({ isSewa: !this.state.isSewa });
  }

  _pageKetentuanSewa = () => {
    this.props.navigation.push('GoTo', {
      page    : 'PeraturanSewa',
      params  : {
        peraturan : this.state.data?.properti?.peraturan,
        action : this._onAction
      }
    });
  }

  _onAction = (isPeraturan) => {
    if (isPeraturan) {
      this.props.navigation.pop();
      this._prosesSewa();
    } else {
      this.props.navigation.pop();
    }
  }

  _prosesSewa = () => {
    let params = [];
    params     = {
      'sewa_id'            : this.state.data.sewa_id,
      'pemilik_id'         : this.state.data.properti.created_by,
      'total_harga'        : this.state.data.total_bayar,
      'harga_sewa'         : this.state.data.harga_sewa,      
      'tanggal_sewa'       : this.state.data.tanggal_sewa,
      'is_parkir'          : this.state.data.is_parkir,
      'kapasitas'          : this.state.data.kapasitas,
      'kamar_id'           : this.state.data.kamar_id,
      'created_by'         : this.props.state.user.user_id,
    }
    this.setState({isSewa : false, isProcess : true}, () => {
      request({
        'model'     : 'Sewa_model',
        'key'       : 'setTagihan',
        'table'     : '-',
        'data'      : {
          'tagihan' : params,
        }
      }).then((res) => {
        this.setState({isProcess : false}, () =>{
          if (res.success) {
            this.props.navigation.replace('GoTo', {
              page : 'Pembayaran',
              params : {
                tagihan_id : res.data
              }
            });
          } else {
            this.props.navigation.pop();
          }
        })
        // this.props.params.action();
      }).catch((error) => {
        this.setState({isLoading : false, isRefresh : false, isProcess : false});
      });
    })
  }

  // _setLantai = (lantai_id, value_lantai) => {
  //   this._renderSheet.hide();
  //   this.setState({
  //     lantai       : lantai_id,
  //     value_lantai : value_lantai
  //   }, () => {
  //     request({
  //       'model'   : 'Sewa_model',
  //       'key'     : 'setLantai',
  //       'table'   : '-',
  //       'data'    : {
  //         'lantai_id' : lantai_id,
  //       },
  //       'where' : {
  //         'sewa_id' : this.state.data.sewa_id,
  //       }
  //     }).then((res) => {
  //       if (res.success) {
  //         this._getData();
  //       }
  //     }).catch((error) => {
  //       this.setState({isLoading : false, isRefresh : false, isProcess : false});
  //     });
  //   });
  // }
  
  _setPenghuni = (index) => {
    this._renderSheet.hide();
    request({
      'model'   : 'Sewa_model',
      'key'     : 'setPenghuni',
      'table'   : '-',
      'data'    : {
        'penghuni' : index.toString(),
      },
      'where' : {
        'sewa_id' : this.state.data.sewa_id,
      }
    }).then((res) => {
      if (res.success) {
        this._getData();
      }
    }).catch((error) => {
      this.setState({isLoading : false, isRefresh : false, isProcess : false});
    });
  }

  _setLamaSewa = (item) => {
    this._renderSheet.hide();
    request({
      'model'   : 'Sewa_model',
      'key'     : 'setLamaSewa',
      'table'   : '-',
      'data'    : {
        'lama_sewa' : item.id.toString(),
      },
      'where' : {
        'sewa_id' : this.state.data.sewa_id,
      }
    }).then((res) => {
      if (res.success) {
        this._getData();
      }
    }).catch((error) => {
      this.setState({isLoading : false, isRefresh : false, isProcess : false});
    });
  }

  _setParkir = (index) => {
    this._renderSheet.hide();
    request({
      'model'   : 'Sewa_model',
      'key'     : 'setParkir',
      'table'   : '-',
      'data'    : {
        'parkir' : index.toString(),
      },
      'where' : {
        'sewa_id' : this.state.data.sewa_id,
      }
    }).then((res) => {
      if (res.success) {
        this._getData();
      }
    }).catch((error) => {
      this.setState({isLoading : false, isRefresh : false, isProcess : false});
    });
  }

  _setTipeKamar = (tipe_kamar_id, value_tipe_kamar) => {
    this._renderSheet.hide();
    this.setState({
      tipe_kamar_id    : tipe_kamar_id,
      value_tipe_kamar : value_tipe_kamar
    }, () => {
      request({
        'model'   : 'Sewa_model',
        'key'     : 'setTipeKamar',
        'table'   : '-',
        'data'    : {
          'tipe_kamar_id' : tipe_kamar_id,
        },
        'where' : {
          'sewa_id' : this.state.data.sewa_id,
        }
      }).then((res) => {
        if (res.success) {
          this._getData();
        }
      }).catch((error) => {
        this.setState({isLoading : false, isRefresh : false, isProcess : false});
      });
    });
  }

  // _getKamar = (lantai_id, isSelect = false) => {
  //   this.setState({isProcess : true}, () => {
  //     request({
  //       'model'     : 'Sewa_model',
  //       'key'       : 'getKamar',
  //       'table'     : '-',
  //       'where'     : {
  //         'sewa_id'    : this.state.data.sewa_id,
  //         'lantai_id'  : lantai_id,
  //         'created_by' : this.props.state.user.user_id,
  //         'isSelect'   : isSelect,
  //       }
  //     }).then((res) => {
  //       this.setState({
  //         data_kamar  : res.data,
  //         isRefresh   : false,
  //         isLoading   : false,
  //         isProcess   : false
  //       });
  //     }).catch((error) => {
  //       this.setState({isLoading : false, isRefresh : false, isProcess : false});
  //     });
  //   })
  // }

  _onRefresh = () => {
    this.setState({isRefresh : true}, () => {
      this._getData()
    })
  }

}

const mapStateToProps = state => ({state: state});
const mapDispatchToProps = dispatch => ({
  setReload: (data) => dispatch(setReload(data)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Sewa);
