import React, { Component } from 'react';
import { View, Dimensions, RefreshControl, ScrollView, FlatList, TouchableOpacity, Image, SafeAreaView} from 'react-native';
import { Container, Header, Calert, Process } from '../../theme';
import { RangeCalendar, Layout, Text, Spinner, Icon, Button, BottomNavigation, ListItem, Modal, Input, Datepicker, Card } from '@ui-kitten/components';
import { connect } from 'react-redux';
import t from '../../lang';
import { request, upload } from '../../bridge';
import { formatDate, formatCur } from '../../func';
import { setReload } from '../../root/redux/actions';
import layout from '../../theme/styles/layout';
import styles from '../../theme/styles/styles';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const BannerWidth = Dimensions.get('window').width - 32;
const BannerHeight = Dimensions.get('window').height - 32;

class DetailSewa extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isProcess          : true,
      isAlert            : false,
      isDeposit          : false,
      isOpsiTanggalIn    : false,
      isOpsiTanggalOut   : false,
      isLoadingImg       : false,
      isBatal            : false,
      isBatalOwner       : false,
      isPengembalianDana : false,
      isTerimaKonfirmasi : false,
      isLoading          : true,
      tanggal_now        : new Date(),
      kamar              : '',
      gambar_link        : '',
      catatan            : '',
      setDeposit         : '',
      deposit            : '0',
      data               : [],
      paramsAlert        : [],
      menuAct            : [],
      imgAct             : [
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
    this.setState({isProcess : true}, () => {
      request({
        'model'     : 'Sewa_model',
        'key'       : 'detailSewa',
        'table'     : '-',
        'where'     : {
          'sewa_id' : this.props.params.sewa_id,
        }
      }).then((res) => {
        this.setState({
          data          : res.data,
          range         : {
            'startDate' : new Date(res.data.sewa?.tanggal_sewa),
            'endDate'   : new Date(res.data.sewa?.tanggal_selesai_sewa)
          },
          note          : res.data?.sewa?.note,
          tanggal_out   : (new Date(res.data?.sewa?.tanggal_sewa) <= new Date()) ? new Date() : new Date(res.data?.sewa?.tanggal_sewa),
          deposit       : formatCur({value: res.data?.sewa?.deposit, input: true}),
          isRefresh     : false,
          isLoading     : false,
          isLoadingMini : false,
          isProcess     : false
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
          center : t('pDetailSewa'),
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
            ((this.state.data.sewa?.status_sewa == '1' || this.state.data?.sewa?.status_sewa == '8') && this.props.state.user.role == '1') &&
            <BottomNavigation appearance="noIndicator">
              <Button style={{marginVertical : 10, marginLeft: 10, marginRight:5}} status="danger" onPress={this._onBatalSewaOwner}>{'Batalkan'}</Button>
            </BottomNavigation>
          }
          {
            (this.state.data.sewa?.status_sewa == '2' && this.props.state.user.role == '1') &&
            <BottomNavigation appearance="noIndicator">
              <Button style={{marginVertical : 10, marginLeft: 10, marginRight:5}} status="danger" onPress={this._modalBatal}>{'Batalkan'}</Button>
              <Button style={{marginVertical : 10, marginRight: 10, marginLeft: 5}} onPress={this._onTerima}>{'Terima'}</Button>
            </BottomNavigation>
          }
          {
            (this.state.data.sewa?.status_sewa == '1' && this.state.data?.sewa?.isSewa == 0 && this.props.state.user.role == '2') &&
            <View style={{marginVertical: 10}}>
              <BottomNavigation appearance="noIndicator">
                <Button style={{marginVertical : 10, marginLeft: 10, marginRight:5 }} status="danger" onPress={this._onBatalSewa} accessoryLeft={(style) => <Icon {...style } name="close-outline"/>}>Batal</Button>
                <Button style={{marginVertical : 10, marginRight: 10, marginLeft: 5 }} onPress={this._onProsesBayar} accessoryLeft={(style) => <Icon {...style } name="credit-card-outline"/>}>Bayar</Button>
              </BottomNavigation>
            </View>
          }
          {
            ((this.state.data?.sewa?.status_sewa == '1' || this.state.data.sewa?.status_sewa == '8') && this.state.data?.sewa?.isSewa > 0 && this.props.state.user.role == '2') &&
            <BottomNavigation appearance="noIndicator">
              <Button style={{marginVertical : 10, marginLeft: 10, marginRight:5}} status="danger" onPress={this._onBatalSewa} accessoryLeft={(style) => <Icon {...style } name="log-out-outline"/>}>Batal</Button>
              <Button style={{marginVertical : 10, marginRight: 10, marginLeft: 5}} onPress={this._onProsesBayar} accessoryLeft={(style) => <Icon {...style } name="credit-card-outline"/>}>Bayar</Button>
            </BottomNavigation>
          }
          {
            (this.state.data?.sewa?.status_sewa == '3' && this.state.data?.sewa?.isSewa > 0 && this.props.state.user.role == '2') &&
            <BottomNavigation appearance="noIndicator">
              <Button style={{marginVertical : 10, marginLeft: 10, marginRight:5}} status="danger" onPress={this._konfirmasi} accessoryLeft={(style) => <Icon {...style } name="log-out-outline"/>}>Check Out</Button>
            </BottomNavigation>
          }
          {
            ((this.state.data?.sewa?.status_sewa == '1' || this.state.data?.sewa?.status_sewa == '4') && this.state.data?.sewa?.isCheckOut > 0 && this.props.state.user.role == '1') &&
            <BottomNavigation appearance="noIndicator">
              <Button style={{marginVertical : 10, marginLeft: 10, marginRight:5}} status="danger" onPress={this._onBatalCheckOut}>{'Batalkan'}</Button>
              <Button style={{marginVertical : 10, marginRight: 10, marginLeft: 5}} onPress={this._modalTerimaKonfirmasi}>{'Terima'}</Button>
            </BottomNavigation>
          }
          {
            (this.state.data?.sewa?.status_sewa == '3' && this.props.state.user.role == '1') &&
            <BottomNavigation appearance="noIndicator">
              <Button style={{marginVertical : 10, marginLeft: 10, marginRight:5}} status="danger" onPress={this._modalBatalOwner} accessoryLeft={(style) => <Icon {...style } name="log-out-outline"/>}>Check Out</Button>
            </BottomNavigation>
          }
          {
            (!this.state.data.sewa?.gambar_pengembalian && this.props.state.user.role == '1' && (this.state.data.sewa?.status_sewa == '5' || this.state.data.sewa?.status_sewa == '6') && this.state.data.sewa?.status_tagihan == '2') &&
            <BottomNavigation appearance="noIndicator">
              <Button style={{marginVertical : 10, marginLeft: 10, marginRight:5}} status="danger" onPress={this._modalPengembalianDana} accessoryLeft={(style) => <Icon {...style } name="log-out-outline"/>}>Pengembalian Dana</Button>
            </BottomNavigation>
          }
        </Layout>
        <ActionSheet
          ref={o => this.actionSheet = o}
          title={<View style={layout.actionSheetHeader}></View>}
          options={this.state.menuAct}
          styles={layout.actionSheet}
          cancelButtonIndex={0}
        />
        <ActionSheet
          ref={o => this.imgSheet = o}
          title={<View style={layout.actionSheetHeader}></View>}
          options={this.state.imgAct}
          styles={layout.actionSheet}
          cancelButtonIndex={0}
        />
        <Calert visible={this.state.isAlert} params={this.state.paramsAlert}/>
        {/* <Modal
          backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
          onBackdropPress={this._modalHide}
          visible={this.state.isOpsiTanggal}>
          {this._renderTanggal()}
        </Modal> */}
        <Modal
          backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
          onBackdropPress={this._modalHide}
          visible={this.state.isOpsiTanggal}>
          {this._renderTanggal()}
        </Modal>
        <Modal
          backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
          onBackdropPress={this._modalDeposit}
          visible={this.state.isDeposit}>
          {this._renderDeposit()}
        </Modal>
        <Modal
          backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
          onBackdropPress={this._modalBatal}
          visible={this.state.isBatal}>
          {this._renderBatal()}
        </Modal>
        <Modal
          backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
          onBackdropPress={this._modalBatalOwner}
          visible={this.state.isBatalOwner}>
            {this._renderBatalOwner()}
        </Modal>
        <Modal
          backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
          onBackdropPress={this._modalPengembalianDana}
          visible={this.state.isPengembalianDana}>
          {this._renderPengembalianDana()}
        </Modal>
        <Modal
          backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
          onBackdropPress={this._modalTerimaKonfirmasi}
          visible={this.state.isTerimaKonfirmasi}>
          {this._renderTerimaKonfirmasi()}
        </Modal>
        <Process visible={this.state.isProcess}/>
      </Container>
    )
  }

  _renderContainer = () => {
    return (
      <View>
      {
        (this.state.data?.histori_sewa[0]?.created_on_f) &&
        <>
          <View style={styles.containerInner}>
            {
              // <View style={{marginVertical: 5}}>
              //   <Text style={layout.bold} category="c2">Status Pesanan</Text>
              //   <Text style={{color: 'red', marginVertical: 3}} category="c2">Pesanan dibatalkan, alasan pembatalan : pembayaran tidak diterima sampai batas waktu yang ditentukan</Text>
              // </View>
              // <Layout style={{height : 1}} level="3"/>
            }
            <TouchableOpacity style={{marginVertical: 5}} onPress={this._history}>
              <Text style={layout.bold} category="c2">Histori Sewa</Text>
              <View style={{flexDirection: 'row', marginVertical: 3, justifyContent: 'space-between'}}>
                <Text appearance="hint" category="c2">{this.state.data?.histori_sewa[0]?.created_on_f}</Text>
                <Icon style={[styles.buttonFilter, styles.textBasic, {height : 20}]} name="chevron-right-outline"/>
              </View>
            </TouchableOpacity>
          </View>
          <Layout style={{height : 8}} level="3"/>
        </>
      }
        <View style={styles.containerInner}>
          {
            (this.state.data?.sewa?.kode_tagihan) &&
            <>
              <View style={{marginVertical: 5}}>
                <TouchableOpacity onPress={() => this._tagihanDetail()} style={styles.rowCenter}>
                  <View style={layout.container}>
                    <Text style={layout.bold} category="c2">{'Informasi Tagihan'}</Text>
                    <Text style={{marginVertical: 3}} category="c2">{this.state.data?.sewa?.kode_tagihan}</Text>
                  </View>
                  <Icon style={styles.iconUser} name="chevron-right-outline"/>
                </TouchableOpacity>
              </View>
              <Layout style={{height : 1}} level="3"/>
            </>
          }
          <TouchableOpacity style={{marginVertical: 5}} onPress={() => this._detailProfile()}>
            <Text style={layout.bold} category="c2">Nama Anak Kos</Text>
            <Text style={{marginVertical: 3}} category="c2">{(this.state.data?.sewa?.kapasitas == '2') ? this.state.data?.user?.nama+', '+this.state.data?.sewa?.penghuni : this.state.data?.user?.nama}</Text>
          </TouchableOpacity>
          <Layout style={{height : 1}} level="3"/>
          {/* <TouchableOpacity style={{marginVertical: 5}} onPress={(this.props.state.user.role != '3' && (this.state.data?.sewa?.status_sewa == '1')) ? this._modalHide : null}>
            <Text style={layout.bold} category="c2">Info Tanggal</Text>
            <Text style={{marginVertical: 3}} category="c2">{t('dInfoTanggal', {mulai: this.state.data?.sewa?.mulai, selesai: this.state.data?.sewa?.selesai})}</Text>
          </TouchableOpacity> */}
          <TouchableOpacity style={{marginVertical: 5}} onPress={(this.props.state.user.role != '3' && (this.state.data?.sewa?.status_sewa == '1')) ? this._modalHideIn : null}>
            <Text style={layout.bold} category="c2">Mulai Sewa</Text>
            <Text style={{marginVertical: 3}} category="c2">{this.state.data?.sewa?.mulai}</Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={this.state?.isOpsiTanggalIn}
            minimumDate={new Date()}
            maximumDate={new Date(this.state.data?.sewa?.tanggal_selesai_sewa)}
            date={new Date(this.state.data?.sewa?.tanggal_sewa)}
            mode="date"
            onCancel={this._modalHideIn}
            onConfirm={(item) => this._setRangeIn(item)}
          />
          <Layout style={{height : 1}} level="3"/>
          <TouchableOpacity style={{marginVertical: 5}} onPress={(this.props.state.user.role != '3' && (this.state.data?.sewa?.status_sewa == '1')) ? this._modalHideOut : null}>
            <Text style={layout.bold} category="c2">Selesai Sewa</Text>
            <Text style={{marginVertical: 3}} category="c2">{this.state.data?.sewa?.selesai}</Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={this.state?.isOpsiTanggalOut}
            minimumDate={new Date(this.state.data?.sewa?.tanggal_sewa)}
            date={new Date(this.state.data?.sewa?.tanggal_selesai_sewa)}
            mode="date"
            onCancel={this._modalHideOut}
            onConfirm={(item) => this._setRangeOut(item)}
          />
          {
            (this.state.data?.sewa?.selesai) &&
            <>
              <Layout style={{height : 1}} level="3"/>
              <View style={{marginVertical: 5}}>
                <Text style={layout.bold} category="c2">Priode Sewa</Text>
                <Text style={{marginVertical: 3}} category="c2">{this.state.data?.sewa?.priode}</Text>
              </View>
            </>
          }
          <Layout style={{height : 1}} level="3"/>
          <TouchableOpacity style={{marginVertical: 5}} onPress={((this.props.state.user.role != '3') && (this.state.data?.sewa?.status_sewa == '1')) ? this._modalDeposit : null}>
            <Text style={layout.bold} category="c2">Deposit</Text>
            <Text style={{marginVertical: 3}} category="c2">{(this.state.data?.sewa?.deposit_f) ? this.state.data?.sewa?.deposit_f : '-'}</Text>
          </TouchableOpacity>
          {
            (this.state.note) &&
            <Layout>
              <Layout style={{height : 1}} level="3"/>
              <View style={{marginVertical: 5}}>
                <Text style={layout.bold} category="c2">Catatan</Text>
                <Text style={{marginVertical: 3}} category="c2">{this.state.note}</Text>
              </View>
            </Layout>
          }
          {
          // <Layout style={{height : 1}} level="3"/>
          // <View style={{marginVertical: 5}}>
          //   <Text style={layout.bold} category="c2">Alamat Anak Kos</Text>
          //   <Text style={{marginVertical: 3}} category="c2">{this.state.data?.user?.alamat}</Text>
          // </View>
          // <Layout style={{height : 1}} level="3"/>
          // <View style={{marginVertical: 5}}>
          //   <Text style={layout.bold} category="c2">Hubungi ke</Text>
          //   <Text category="c2">{this.state.data?.user?.notelp}</Text>
          // </View>
          }
        </View>
        <Layout style={{height : 8}} level="3"/>
        <View style={styles.containerInner}>
          {
          // <View style={{marginVertical: 5}}>
          //   <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          //     <View style={{flexDirection: 'row', alignItems: 'center'}}>
          //       <Image style={styles.iconSewaKosan} source={{uri : this.state.data?.properti?.gambar_link}} />
          //       <Text style={layout.bold} category="c2">{this.state.data?.properti?.nama_properti}</Text>
          //     </View>
          //     <Text style={{color : ((this.state.data?.sewa?.status_sewa == '3') ? '#60B8D6' : ((this.state.data?.sewa?.status_sewa != '3') ? '#ff2929' : '#a1a1a1'))}} category='c2'>{this.state.data?.sewa?.status_sewa_f}</Text>
          //   </View>
          // </View>
          }
          <Layout style={{height : 1}} level="3"/>
          <View style={{paddingVertical: 10, paddingHorizontal: 0}}>
            <TouchableOpacity style={styles.containerInfo} onPress={(this.props.state.user.role != '2') ? this._infoPenyewa : ((this.state.data?.sewa?.status_sewa == '1' || this.state.data?.sewa?.status_sewa == '8') ? this._gantiKamar : null)}>
              {
                (this.state.data?.properti?.gambar_link) &&
                <Image style={styles.listItemImgSewa} source={{uri : this.state.data?.properti?.gambar_link}}/>
              }
              <View style={{flex: 1}}>
                <Text numberOfLines={2} style={[layout.regular, layout.semiBold, {marginVertical: 2}]} category='p2'>{this.state.data?.properti?.nomor_kamar+' - '+this.state.data?.sewa?.tipe_kamar}</Text>
                <Text numberOfLines={1} style={[layout.regular, {marginVertical: 2}]} category='p2'>{this.state.data?.sewa?.harga_sewa_f}</Text>
              </View>

            </TouchableOpacity>
          </View>
        </View>
        {
          (this.state.data.sewa.gambar_link) &&
          <>
            <Layout style={{height : 8}} level="3"/>
            <View style={styles.containerInner}>
              <View style={{marginVertical: 10}}>
                <Text style={layout.bold} category="c2">Bukti Bayar</Text>
              </View>
              <TouchableOpacity style={{ alignItems: 'center', marginBottom: 15, width: BannerWidth, borderWidth: 2, borderRadius: 18, borderStyle: 'dashed',  borderColor: (this.state.errGambar ? 'red' : '#ebeef5')}} onPress={() => this._zoom(this.state.data.sewa.gambar)}>
                <Image
                  style={{ width: 150, height: 150, borderRadius: 18}}
                  source={{
                    uri: this.state.data.sewa.gambar_link
                  }}
                />
              </TouchableOpacity>
            </View>
          </>
        }
        {
          (this.state.data.sewa?.gambar_link_dana) &&
          <>
            <Layout style={{height : 8}} level="3"/>
            <View style={styles.containerInner}>
              <View style={{marginVertical: 10}}>
                <Text style={layout.bold} category="c2">Bukti Pengembalian Dana</Text>
              </View>
              <TouchableOpacity style={{ alignItems: 'center', marginBottom: 15, width: BannerWidth, borderWidth: 2, borderRadius: 18, borderStyle: 'dashed',  borderColor: (this.state.errGambar ? 'red' : '#ebeef5')}} onPress={() => this._zoom(this.state.data.sewa.gambar_dana)}>
                <Image
                  style={{ width: 150, height: 150, borderRadius: 18}}
                  source={{
                    uri: this.state.data.sewa.gambar_link_dana
                  }}
                />
              </TouchableOpacity>
            </View>
          </>
        }
      </View>
    )
  }

  _gantiKamar = () => {
    this.props.navigation.push('GoTo', {
      page : 'GantiKamar',
      params : {
        penyewa : this.state.data?.sewa,
        action  : this._onAction
      }
    });
  }

  _infoPenyewa = () => {
    this.props.navigation.push('GoTo', {
      page : 'InfoPenyewa',
      params : {
        penyewa : this.state.data?.sewa,
        action  : this._onAction
      }
    });
  }
  
  _history = () => {
    let menu = [<Text status="danger">{t('bClose')}</Text>];
    this.state.data?.histori_sewa.map((val, id) => {
      menu.push(
        <ListItem
          disabled
          title={val.status_f}
          description={val.created_on_f}
          descriptionStyle={layout.regular}
          accessoryLeft={() => <Icon style={[{width : 20, height : 20}, (id == 0 ? {color : '#60B8D6'} : {color: '#c4c4c4'})]} name="checkmark-circle-2-outline"/>}
        />
      );
    });
    this.setState({ menuAct : menu}, () => {
      this.actionSheet.show();
    })
  }

  _renderDeposit = () => {
    return (
      <Card disabled={true} style={{width: BannerWidth}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={layout.bold}>Deposit</Text>
          <TouchableOpacity onPress={this._modalDeposit}>
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
          placeholder={t('iDeposit1')}
          value={this.state.setDeposit}
          onChangeText={this._onChange}
          status={(this.state.errDeposit) ? 'danger' : 'basic'}
          keyboardType={'numeric'}
        />
        <Button style={{width:'40%', alignSelf: 'flex-end'}} size='small' onPress={this._onDeposit}>Simpan</Button>
      </Card>
    )
  }
  
  _onChange = (text) => {
    this.setState({ setDeposit : formatCur({value:text.split('.').join(''), input:true}) })
  }

  _onDeposit = (data) => {
    this.setState({
      errDeposit : (this.state.setDeposit && this.state.setDeposit != '0' ? false : true)
    }, () => {
      if (!this.state.errDeposit) {
        this.setState({isProcess : true}, () => {
          request({
            'model'     : 'Sewa_model',
            'key'       : 'setHargaDeposit',
            'table'     : '-',
            'data'      : {
              'deposit' : this.state.setDeposit.split('.').join('')
            },
            'where'     : {
              'sewa_id' : this.state.data?.sewa?.sewa_id
            }
          }).then((res) => {
            this._modalDeposit();
            this._getData();
          }).catch((error) => {
            this.setState({isLoading : false, isRefresh : false, isProcess : false});
          });
        })
      }
    })
  }
  
  // _renderTanggal = () => {
  //   return (
  //     <Layout level='3' >
  //       <Calendar
  //         min={(this.state.tanggal_now) ? new Date(this.state.tanggal_now) : new Date(new Date().setDate(new Date().getDate()))}
  //         max={new Date(new Date().setFullYear(new Date().getFullYear() + 100))}
  //         date={(this.state.data?.sewa?.tanggal_sewa) ? new Date(this.state.data?.sewa?.tanggal_sewa) : new Date(this.state.tanggal_now)}
  //         onSelect={(date) => this._cTanggal(date)}
  //       />
  //     </Layout>
  //   )
  // }

  _renderTanggal = () => {
    return (
      <Layout level='3' >
        <RangeCalendar
          min={(this.state.tanggal_now) ? new Date(this.state.tanggal_now) : new Date(new Date().setDate(new Date().getDate()))}
          max={new Date(new Date().setFullYear(new Date().getFullYear() + 100))}
          range={this.state.range}
          onSelect={nextRange => this._setRange(nextRange)}
        />
      </Layout>
    )
  }

  _renderBatalOwner = () => {
    return (
      <Layout style={{maxHeight: BannerHeight, width: BannerWidth, padding: 20, borderRadius: 5}} level='3'>
        <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <Text style={layout.semiBold}>Upload Bukti Pengembalian Dana</Text>
        </View>
        <View style={[styles.containerHeader, {borderRadius: 5, justifyContent: 'flex-start', backgroundColor: '#fff', marginTop: 20}]}>
          {
            (this.state.data?.user?.gambar_link) &&
            <Image style={styles.iconAvatarProfileImg} source={{uri : this.state.data?.user?.gambar_link}} />
          }
          <View style={{marginHorizontal: 20, justifyContent: 'space-around', height: 70}}>
            <Text style={layout.bold} category="p1">{this.state.data?.user?.no_rekening}</Text>
            <Text style={layout.regular} category="p2">{this.state.data?.user?.nama_pemilik}</Text>
            <Text style={layout.regular} category="p2" appearance="hint">{this.state.data?.user?.bank}</Text>
          </View>
        </View>
        <Input
          accessoryRight={() =>
            <Icon style={{color : '#8F9BB3'}} name='edit-2-outline'/>
          }
          size='small'
          style={styles.registerInput}
          textStyle={styles.loginTextInput}
          placeholder={t('iDeposit')}
          value={this.state.deposit}
          onChangeText={this._onChangeDeposit}
          status={(this.state.errPenghuni) ? 'danger' : 'basic'}
        />
        <Datepicker
          accessoryRight={() =>
            <Icon style={{color : '#8F9BB3'}} name='calendar-outline'/>
          }
          min={this.state.tanggal_out}
          style={styles.registerInput}
          placeholder={t('iTanggalLahir')}
          date={this.state.tanggal_out}
          onSelect={this._onChangeTanggal}
          status={(this.state.errTanggal) ? 'danger' : 'basic'}
        />
        <Input
          accessoryRight={() =>
            <Icon style={{color : '#8F9BB3'}} name='edit-2-outline'/>
          }
          style={styles.registerInput}
          textStyle={styles.loginTextInput}
          placeholder={'Catatan'}
          value={this.state.catatan}
          onChangeText={this._onChangeCatatan}
          status={(this.state.errCatatan) ? 'danger' : 'basic'}
          multiline={true}
        />
        <TouchableOpacity onPress={this.openImg} style={{borderStyle: 'dashed', borderColor: '#b5b5b5', borderWidth: 1, borderRadius: 5, justifyContent: 'center', alignItems: 'center', height: 130, marginVertical: 10}}>
          {
            (this.state.isLoadingImg) ?
            (
              <Spinner/>
            ) : (this.state.gambar_link) ?
                <Image
                  style={{ width: 150, height: 130, borderRadius: 18}}
                  source={{
                    uri: (this.state.gambar_link) ? this.state.gambar_link : 'https://novelringan.com/wp-content/uploads/2019/02/1549963589-noimage.jpg',
                  }}
                />
              :
                <Icon style={[styles.buttonFilter, styles.textBasic, {height : 50}]} name="camera-outline"/>
          }
        </TouchableOpacity>
        <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
          <Button size='small' style={{marginHorizontal: 5}} status='basic' onPress={this._modalBatalOwner}>Kembali</Button>
          <Button size='small' status='danger' onPress={this._checkOutOwner}>Proses</Button>
        </View>
        </ScrollView>
      </Layout>
    )
  }

  _renderPengembalianDana = () => {
    return (
      <Layout style={{maxHeight: BannerHeight, width: BannerWidth, padding: 20, borderRadius: 5}} level='3'>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            <Text style={layout.semiBold}>Upload Bukti Pengembalian Dana</Text>
          </View>
          <View style={[styles.containerHeader, {borderRadius: 5, justifyContent: 'flex-start', backgroundColor: '#fff', marginTop: 20}]}>
            {
              (this.state.data?.user?.gambar_link) &&
              <Image style={styles.iconAvatarProfileImg} source={{uri : this.state.data?.user?.gambar_link}} />
            }
            <View style={{marginHorizontal: 20, justifyContent: 'space-around', height: 70}}>
              <Text style={layout.bold} category="p1">{this.state.data?.user?.no_rekening}</Text>
              <Text style={layout.regular} category="p2">{this.state.data?.user?.nama_pemilik}</Text>
              <Text style={layout.regular} category="p2" appearance="hint">{this.state.data?.user?.bank}</Text>
            </View>
          </View>
          <Input
            accessoryRight={() =>
              <Icon style={{color : '#8F9BB3'}} name='edit-2-outline'/>
            }
            size='small'
            style={styles.registerInput}
            textStyle={styles.loginTextInput}
            placeholder={t('iDeposit')}
            value={this.state.deposit}
            onChangeText={this._onChangeDeposit}
            status={(this.state.errPenghuni) ? 'danger' : 'basic'}
          />
          <Input
            accessoryRight={() =>
              <Icon style={{color : '#8F9BB3'}} name='edit-2-outline'/>
            }
            style={styles.registerInput}
            textStyle={styles.loginTextInput}
            placeholder={'Catatan'}
            value={this.state.catatan}
            onChangeText={this._onChangeCatatan}
            returnKeyType={"done"}
            status={(this.state.errCatatan) ? 'danger' : 'basic'}
            multiline={true}
          />
          <TouchableOpacity onPress={this.openImg} style={{borderStyle: 'dashed', borderColor: '#b5b5b5', borderWidth: 1, borderRadius: 5, justifyContent: 'center', alignItems: 'center', height: 130, marginVertical: 10}}>
            {
              (this.state.isLoadingImg) ?
              (
                <Spinner/>
              ) : (this.state.gambar_link) ?
                  <Image
                    style={{ width: 150, height: 130, borderRadius: 18}}
                    source={{
                      uri: (this.state.gambar_link) ? this.state.gambar_link : 'https://novelringan.com/wp-content/uploads/2019/02/1549963589-noimage.jpg',
                    }}
                  />
                :
                  <Icon style={[styles.buttonFilter, styles.textBasic, {height : 50}]} name="camera-outline"/>
            }
          </TouchableOpacity>
          <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
            <Button size='small' style={{marginHorizontal: 5}} status='basic' onPress={this._modalPengembalianDana}>Kembali</Button>
            <Button size='small' status='danger' onPress={this._setPengembalianDana}>Proses</Button>
          </View>
        </ScrollView>
      </Layout>
    )
  }

  _renderTerimaKonfirmasi = () => {
    return (
      <Layout style={{maxHeight: BannerHeight, width: BannerWidth, padding: 20, borderRadius: 5}} level='3'>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            <Text style={layout.semiBold}>Upload Bukti Pengembalian Dana</Text>
          </View>
          <View style={[styles.containerHeader, {borderRadius: 5, justifyContent: 'flex-start', backgroundColor: '#fff', marginTop: 20}]}>
            {
              (this.state.data?.user?.gambar_link) &&
              <Image style={styles.iconAvatarProfileImg} source={{uri : this.state.data?.user?.gambar_link}} />
            }
            <View style={{marginHorizontal: 20, justifyContent: 'space-around', height: 70}}>
              <Text style={layout.bold} category="p1">{this.state.data?.user?.no_rekening}</Text>
              <Text style={layout.regular} category="p2">{this.state.data?.user?.nama_pemilik}</Text>
              <Text style={layout.regular} category="p2" appearance="hint">{this.state.data?.user?.bank}</Text>
            </View>
          </View>
          <Input
            accessoryRight={() =>
              <Icon style={{color : '#8F9BB3'}} name='edit-2-outline'/>
            }
            size='small'
            style={styles.registerInput}
            textStyle={styles.loginTextInput}
            placeholder={t('iDeposit')}
            value={this.state.deposit}
            onChangeText={this._onChangeDeposit}
            status={(this.state.errPenghuni) ? 'danger' : 'basic'}
          />
          <Datepicker
            accessoryRight={() =>
              <Icon style={{color : '#8F9BB3'}} name='calendar-outline'/>
            }
            min={new Date(this.state.data?.sewa?.tanggal_sewa)}
            style={styles.registerInput}
            placeholder={t('iTanggalLahir')}
            date={this.state.tanggal_out}
            onSelect={this._onChangeTanggal}
            status={(this.state.errTanggal) ? 'danger' : 'basic'}
          />
          <Input
            accessoryRight={() =>
              <Icon style={{color : '#8F9BB3'}} name='edit-2-outline'/>
            }
            style={styles.registerInput}
            textStyle={styles.loginTextInput}
            placeholder={'Catatan'}
            value={this.state.catatan}
            onChangeText={this._onChangeCatatan}
            returnKeyType={"done"}
            status={(this.state.errCatatan) ? 'danger' : 'basic'}
            multiline={true}
          />
          <TouchableOpacity onPress={this.openImg} style={{borderStyle: 'dashed', borderColor: '#b5b5b5', borderWidth: 1, borderRadius: 5, justifyContent: 'center', alignItems: 'center', height: 130, marginVertical: 10}}>
            {
              (this.state.isLoadingImg) ?
              (
                <Spinner/>
              ) : (this.state.gambar_link) ?
                  <Image
                    style={{ width: 150, height: 130, borderRadius: 18}}
                    source={{
                      uri: (this.state.gambar_link) ? this.state.gambar_link : 'https://novelringan.com/wp-content/uploads/2019/02/1549963589-noimage.jpg',
                    }}
                  />
                :
                  <Icon style={[styles.buttonFilter, styles.textBasic, {height : 50}]} name="camera-outline"/>
            }
          </TouchableOpacity>
          <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
            <Button size='small' style={{marginHorizontal: 5}} status='basic' onPress={this._modalTerimaKonfirmasi}>Kembali</Button>
            <Button size='small' status='danger' onPress={this._onTerimaChackOut}>Proses</Button>
          </View>
        </ScrollView>
      </Layout>
    )
  }

  _renderBatal = () => {
    return (
      <Layout style={{maxHeight: BannerHeight, width: BannerWidth, padding: 20, borderRadius: 5}} level='3'>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            <Text style={layout.semiBold}>Upload Bukti Pengembalian Dana</Text>
          </View>
          <View style={[styles.containerHeader, {borderRadius: 5, justifyContent: 'flex-start', backgroundColor: '#fff', marginTop: 20}]}>
            {
              (this.state.data?.user?.gambar_link) &&
              <Image style={styles.iconAvatarProfileImg} source={{uri : this.state.data?.user?.gambar_link}} />
            }
            <View style={{marginHorizontal: 20, justifyContent: 'space-around', height: 70}}>
              <Text style={layout.bold} category="p1">{this.state.data?.user?.no_rekening}</Text>
              <Text style={layout.regular} category="p2">{this.state.data?.user?.nama_pemilik}</Text>
              <Text style={layout.regular} category="p2" appearance="hint">{this.state.data?.user?.bank}</Text>
            </View>
          </View>
          <Input
            accessoryRight={() =>
              <Icon style={{color : '#8F9BB3'}} name='edit-2-outline'/>
            }
            size='small'
            style={styles.registerInput}
            textStyle={styles.loginTextInput}
            placeholder={t('iDeposit')}
            value={this.state.deposit}
            onChangeText={this._onChangeDeposit}
            status={(this.state.errPenghuni) ? 'danger' : 'basic'}
            keyboardType={'numeric'}
          />
          <Input
            accessoryRight={() =>
              <Icon style={{color : '#8F9BB3'}} name='edit-2-outline'/>
            }
            style={styles.registerInput}
            textStyle={styles.loginTextInput}
            placeholder={'Catatan'}
            value={this.state.catatan}
            onChangeText={this._onChangeCatatan}
            returnKeyType={"done"}
            status={(this.state.errCatatan) ? 'danger' : 'basic'}
            multiline={true}
          />
          <TouchableOpacity onPress={this.openImg} style={{borderStyle: 'dashed', borderColor: '#b5b5b5', borderWidth: 1, borderRadius: 5, justifyContent: 'center', alignItems: 'center', height: 130, marginVertical: 10}}>
            {
              (this.state.isLoadingImg) ?
              (
                <Spinner/>
              ) : (this.state.gambar_link) ?
                  <Image
                    style={{ width: 150, height: 130, borderRadius: 18}}
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
            <Button size='small' status='danger' onPress={this._onBatal}>Proses</Button>
          </View>
        </ScrollView>
      </Layout>
    )
  }

  _onChangeTanggal = (text) => {
    this.setState({ tanggal_out : text })
  }

  _onChangeDeposit = (text) => {
    this.setState({deposit: formatCur({value: text.split('.').join(''), input: true})})
  }
  
  _onChangeCatatan = (text) => {
    this.setState({ catatan : text })
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

  _setRangeIn = (nextRange) => {
    this.setState({isProcess : true, isLoading : true}, () => {
      request({
        'model'     : 'Sewa_model',
        'key'       : 'updateTanggal',
        'table'     : '-',
        'data'      : {
          'tanggal_sewa'         : formatDate({date : nextRange, format : 'YYYY-MM-DD'}),
          'tanggal_selesai_sewa' : formatDate({date : this.state.data?.sewa?.tanggal_selesai_sewa, format : 'YYYY-MM-DD'}),
          'harga_sewa'           : this.state.data?.sewa?.harga_sewa
        },
        'where'     : {
          'sewa'    : this.state.data?.sewa,
        }
      }).then((res) => {
        this._getData();
        this.setState({
          isOpsiTanggalIn : false
        });
      }).catch((error) => {
        this.setState({isLoading : false, isRefresh : false, isProcess : false});
      });
    })
  }

  _setRangeOut = (nextRange) => {
    this.setState({isProcess : true, isLoading : true}, () => {
      request({
        'model'     : 'Sewa_model',
        'key'       : 'updateTanggal',
        'table'     : '-',
        'data'      : {
          'tanggal_sewa'         : formatDate({date : this.state.data?.sewa?.tanggal_sewa, format : 'YYYY-MM-DD'}),
          'tanggal_selesai_sewa' : formatDate({date : nextRange, format : 'YYYY-MM-DD'}),
          'harga_sewa'           : this.state.data?.sewa?.harga_sewa
        },
        'where'     : {
          'sewa'    : this.state.data?.sewa,
        }
      }).then((res) => {
        // console.warn(res);
        this._getData();
        this.setState({
          isOpsiTanggalOut : false
        });
      }).catch((error) => {
        this.setState({isLoading : false, isRefresh : false, isProcess : false});
      });
    })
  }

  // _setRange = (nextRange) => {
  //   this.setState({ 
  //     range : nextRange,
  //   });
  //   if (nextRange.endDate) {
  //     this.setState({isProcess : true, isLoading : true}, () => {
  //       request({
  //         'model'     : 'Sewa_model',
  //         'key'       : 'updateTanggal',
  //         'table'     : '-',
  //         'data'      : {
  //           'tanggal_sewa'         : formatDate({date : nextRange?.startDate, format : 'YYYY-MM-DD'}),
  //           'tanggal_selesai_sewa' : formatDate({date : nextRange?.endDate, format : 'YYYY-MM-DD'}),
  //           'harga_sewa'           : this.state.data?.sewa?.harga_sewa
  //         },
  //         'where'     : {
  //           'sewa'    : this.state.data?.sewa,
  //         }
  //       }).then((res) => {
  //         // console.warn(res);
  //         this._getData();
  //         this.setState({
  //           isOpsiTanggal : !this.state.isOpsiTanggal
  //         });
  //       }).catch((error) => {
  //         this.setState({isLoading : false, isRefresh : false, isProcess : false});
  //       });
  //     })    
  //   }
  // }

  _renderHeader = () => {
    return (
      <View>
        <Layout style={styles.containerFilter}>
          <Icon style={[styles.buttonFilter, styles.textBasic, {height : 20}]} name="funnel-outline"/>
          <Layout style={styles.borderFilter} level="4"/>
          <FlatList
            data={this.state.menuSort}
            horizontal
            contentContainerStyle={styles.containerFilterList}
            showsHorizontalScrollIndicator={false}
            renderItem={({item, index}) => this._renderMenuSort(item, index)}
            ref={ref => this._filterList = ref}
            onContentSizeChange={() => {
              this.timerHandle = setTimeout(() => {
                if (this.state.filter.status_pesanan == this.state.indexSort && this.state.menuSort) {
                  this._filterList?.scrollToIndex({index : this.state.indexSort, animated : true})
                }
              }, 500);
            }}
          />
        </Layout>

        {
          (this.state.isLoadingMini) &&
          (
            <View style={layout.spinner}><Spinner /></View>
          )
        }
      </View>
    )
  }
  
  _cTanggal = (date) => {
    let newData          = this.state.data;
    newData.tanggal_sewa = formatDate({date : date, format : 'YYYY-MM-DD'});
    this.setState({isProcess : true}, () => {
      request({
        'model'     : 'Sewa_model',
        'key'       : 'updateTanggal',
        'table'     : '-',
        'where'     : {
          'sewa_id'      : this.state.data?.sewa?.sewa_id,
          'tanggal_sewa' : newData.tanggal_sewa,
        }
      }).then((res) => {
        this._getData();
        this.setState({
          isOpsiTanggal : !this.state.isOpsiTanggal
        });
      }).catch((error) => {
        this.setState({isLoading : false, isRefresh : false, isProcess : false});
      });
    })
  }
  
  _modalHideIn = () => {
    this.setState({ isOpsiTanggalIn : !this.state.isOpsiTanggalIn });
  }
  
  _modalHideOut = () => {
    this.setState({ isOpsiTanggalOut : !this.state.isOpsiTanggalOut });
  }
    
  _modalDeposit = () => {
    this.setState({ 
      isDeposit : !this.state.isDeposit,
      setDeposit : formatCur({value:this.state.data?.sewa?.deposit.split('.').join(''), input:true})
    });
  }

  _modalBatal = () => {
    this.setState({ isBatal : !this.state.isBatal });
  }
  
  _modalBatalOwner = () => {
    this.setState({ isBatalOwner : !this.state.isBatalOwner });
  }  

  _modalPengembalianDana = () => {
    this.setState({ isPengembalianDana : !this.state.isPengembalianDana });
  }

  _modalTerimaKonfirmasi = () => {
    this.setState({ isTerimaKonfirmasi : !this.state.isTerimaKonfirmasi });
  }

  _detail = () => {
    this.props.navigation.replace('GoTo', {
      page   : 'KosDetail',
      params : {
        properti_id : this.state.data?.properti?.properti_id,
        action      : this._onAction
      }
    })
  }

  _tagihanDetail = () => {
    this.props.navigation.push('GoTo', {
      page    : 'TagihanDetail',
      params  : {
        sewa        : this.state.data.sewa,
        rincian     : this.state.rician,
        actReload   : this._onRefresh
      }
    });
  }

  _detailProfile = () => {
    this.props.navigation.push('GoTo', {
      page    : 'DetailProfile',
      params  : {
        user_id  : this.state.data?.sewa?.created_by
      }
    });
  }

  _filter = (item, index) => {
    if (this._filterList) {
      this._filterList?.scrollToIndex({index : index, animated : true})
    }
    this.setState({
      filter        : item.value,
      filterText    : item.label,
      isLoadingMini : true,
    }, () => {
      this._getData();
    });
  }

  _onProsesBayar = () => {
    this.props.navigation.push('GoTo', {
      page   : 'BuktiBayarProses',
      params : {
        sewa   : this.state.data?.sewa,
        action : this._onAction,
      }
    })
  }

  _konfirmasi = () => {
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

  _konfirmasiBatal = () => {
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

  _hideAlert = () => {
    this.setState({isAlert : !this.state.isAlert});
  }

  _checkOut = () => {
    this.setState({isProcess : true}, () => {
      request({
        'model'     : 'Sewa_model',
        'key'       : 'checkOut',
        'table'     : '-',
        'where'     : {
          'properti_id' : this.state.data?.properti.properti_id,
          'pemilik_id'  : this.state.data.properti.created_by,
          'created_by'  : this.props.state.user.user_id,
        }
      }).then((res) => {
        if (res.success) {
          this.props.setReload({key : 'home', value : true});
          this.props.params.action();
        } else {
          Toast.show(t('aError', {ercode : '001'}), Toast.SHORT)
        }
      }).catch((error) => {
        this.setState({isLoading : false, isRefresh : false, isProcess : false});
      });
    })
  }

  _onTerimaChackOut = () => {
    this.setState({isProcess : true}, () => {
      request({
        'model'     : 'Sewa_model',
        'key'       : 'terimaCheckOut',
        'table'     : '-',
        'where'     : {
          'refund'       : this.state.deposit.split('.').join(''),
          'properti_id'  : this.state.data?.properti.properti_id,
          'sewa_id'      : this.props.params.sewa_id,
          'pemilik_id'   : this.state.data?.sewa?.pemilik_id,
          'gambar'       : this.state.gambar,
          'created_by'   : this.state.data?.sewa?.created_by,
          'tanggal_sewa' : formatDate({date : this.state.tanggal_out, format : 'YYYY-MM-DD'}),
          'deposit'      : this.state.data?.sewa?.deposit,
          'note'         : this.state.catatan,
        }
      }).then((res) => {
        if (res.success) {
          this.props.setReload({key : 'home', value : true});
          this.props.params.action();
        } else {
          Toast.show(t('aError', {ercode : '001'}), Toast.SHORT)
        }
      }).catch((error) => {
        this.setState({isLoading : false, isRefresh : false, isProcess : false});
      });
    })
  }

  _onBatalCheckOut = () => {
    this.setState({isProcess : true}, () => {
      request({
        'model'     : 'Sewa_model',
        'key'       : 'batalCheckOut',
        'table'     : '-',
        'where'     : {
          'sewa_id' : this.props.params.sewa_id
        }
      }).then((res) => {
        if (res.success) {
          this.props.setReload({key : 'home', value : true});
          this.props.params.refresh();
          this._onRefresh();
        } else {
          Toast.show(t('aError', {ercode : '001'}), Toast.SHORT)
        }
      }).catch((error) => {
        this.setState({isLoading : false, isRefresh : false, isProcess : false});
      });
    })
  }

  _onAction = () => {
    this.props.navigation.pop();
    this.props.params.refresh();
    this._onRefresh();
  }

  _renderMenuSort = (item, index) => {
    return (
      <TouchableOpacityReal onPress={() => this._filter(item, index)} key={index}>
        <Text style={[styles.buttonMenuFilter, (this.state.filterText == item.label) ? styles.buttonMenuFilterActive : {}]}>{item.label+((item.badge > 0) ? ' ('+item.badge+')' : '')}</Text>
      </TouchableOpacityReal>
    )
  }

  _pilihKamar = (item) => {
    this.props.navigation.push('GoTo', {
      page   : 'EditProfile',
      params : {
        sewa_id : item.sewa_id,
      }
    })
  }

  _onBatalSewa = () => {
    this.setState({isProcess : true}, () => {
      request({
        'model' : 'Sewa_model',
        'key'   : 'batalSewa',
        'table' : '-',
        'data'  : {
          'sewa_id' : this.props.params.sewa_id
        }
      }).then((res) => {
        this.props.setReload({key : 'home', value : true});
        this.props.params.action();
      }).catch((error) => {
        this.setState({isLoading : false});
      });
    });
  };
  
  _onBatalSewaOwner = () => {
    this.setState({isProcess : true}, () => {
      request({
        'model' : 'Sewa_model',
        'key'   : 'batalSewaOwner',
        'table' : '-',
        'data'  : {
          'sewa_id' : this.props.params.sewa_id
        }
      }).then((res) => {
        this.props.setReload({key : 'home', value : true});
        this.props.params.action();
      }).catch((error) => {
        this.setState({isLoading : false});
      });
    });
  };
    
  _checkOutOwner = () => {
    this.setState({isProcess : true}, () => {
      request({
        'model'     : 'Sewa_model',
        'key'       : 'checkOutOwner',
        'table'     : '-',
        'where'     : {
          'refund'       : this.state.deposit.split('.').join(''),
          'properti_id'  : this.state.data?.properti.properti_id,
          'sewa_id'      : this.props.params.sewa_id,
          'pemilik_id'   : this.state.data?.sewa?.pemilik_id,
          'gambar'       : this.state.gambar,
          'created_by'   : this.state.data?.sewa?.created_by,
          'tanggal_sewa' : formatDate({date : this.state.tanggal_out, format : 'YYYY-MM-DD'}),
          'deposit'      : this.state.data?.sewa?.deposit,
          'note'         : this.state.catatan,
          'is_owner'     : true,
        }
      }).then((res) => {
        if (res.success) {
          this.props.setReload({key : 'home', value : true});
          this._modalBatalOwner();
          this._onRefresh();
        } else {
          Toast.show(t('aError', {ercode : '001'}), Toast.SHORT)
        }
      }).catch((error) => {
        this.setState({isLoading : false, isRefresh : false, isProcess : false});
      });
    })
  }
    
  _setPengembalianDana = () => {
    this.setState({isProcess : true}, () => {
      request({
        'model'     : 'Sewa_model',
        'key'       : 'setPengembalianDana',
        'table'     : '-',
        'where'     : {
          'refund'       : this.state.deposit.split('.').join(''),
          'properti_id'  : this.state.data?.properti.properti_id,
          'sewa_id'      : this.props.params.sewa_id,
          'pemilik_id'   : this.state.data?.sewa?.pemilik_id,
          'gambar'       : this.state.gambar,
          'created_by'   : this.state.data?.sewa?.created_by,
          'deposit'      : this.state.data?.sewa?.deposit,
          'note'         : this.state.catatan,
        }
      }).then((res) => {
        if (res.success) {
          this.props.setReload({key : 'home', value : true});
          this._modalPengembalianDana();
          this._onRefresh();
        } else {
          Toast.show(t('aError', {ercode : '001'}), Toast.SHORT)
        }
      }).catch((error) => {
        this.setState({isLoading : false, isRefresh : false, isProcess : false});
      });
    })
  }

  _onBatal = () => {
    this.setState({isProcess : true}, () => {
      request({
        'model' : 'Sewa_model',
        'key'   : 'batalKonfirmasi',
        'table' : '-',
        'data'  : {
          'refund'  : this.state.deposit.split('.').join(''),
          'sewa_id' : this.props.params.sewa_id,
          'gambar'  : this.state?.gambar,
          'deposit' : this.state.data?.sewa?.deposit,
          'note'    : this.state.catatan,
        }
      }).then((res) => {
        this.props.setReload({key : 'home', value : true});
        this.props.params.action();
        this.setState({ isProcess : false, isBatal : false });
      }).catch((error) => {
        this.setState({isLoading : false});
      });
    });
  };

  _onTerima = () => {
    this.setState({isProcess : true}, () => {
      request({
        'model' : 'Sewa_model',
        'key'   : 'simpanKonfirmasi',
        'table' : '-',
        'data'  : {
          'sewa_id' : this.props.params.sewa_id
        }
      }).then((res) => {
        this.props.setReload({key : 'home', value : true});
        this.props.params.action();
      }).catch((error) => {
        this.setState({isLoading : false});
      });
    });
  };

  _zoom = (gambar) => {
    if (this.state.data.sewa.gambar_link) {
      this.props.navigation.push('GoTo', {
        page    : 'Zoom',
        params  : {
          source : gambar
        }
      });
    }
  }

  _onRefresh = () => {
    this.setState({isRefresh : true}, () => {
      this.props.params.refresh();
      this._getData();
    })
  }

}

const mapStateToProps = state => ({state: state});
const mapDispatchToProps = dispatch => ({
  setReload: (data) => dispatch(setReload(data)),
});
export default connect(mapStateToProps, mapDispatchToProps)(DetailSewa);
