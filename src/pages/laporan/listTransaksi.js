import React, { Component } from 'react';
import { View, Dimensions, RefreshControl, ScrollView, FlatList, TouchableOpacity, Image } from 'react-native';
import { Container, Header, Calert, Process, Empty } from '../../theme';
import { RangeCalendar, Layout, Text, Spinner, Icon, Button, BottomNavigation, ListItem, Modal, Input, Datepicker} from '@ui-kitten/components';
import { connect } from 'react-redux';
import t from '../../lang';
import { request, upload } from '../../bridge';
import { formatDate, formatCur } from '../../func';
import { setReload } from '../../root/redux/actions';
import layout from '../../theme/styles/layout';
import styles from '../../theme/styles/styles';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';

const BannerWidth = Dimensions.get('window').width - 32;
const BannerHeight = 130;

class ListTransaksi extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isProcess          : true,
      isAlert            : false,
      isLoading          : true,
      tanggal_now        : new Date(),
      kamar              : '',
      gambar_link        : '',
      deposit            : '0',
      data               : [],
    }
  }

  componentDidMount = () => {
    this._getData();
  }

  _getData = () => {
    this.setState({isProcess : true}, () => {
      request({
        'model'     : 'Sewa_model',
        'key'       : 'listTransaksi',
        'table'     : '-',
        'where'     : {
          'bulan'   : this.props.params.bulan,
          'tahun'   : this.props.params.tahun,
          'user_id' : this.props.state.user.user_id,
        }
      }).then((res) => {
        this.setState({
          data          : res.data,
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
          center : t('pDetailLaporan'),
          isBack : true
        }}/>
        <Layout style={layout.container}>
            {
              (this.state.isLoading) ?
              (
                <View style={layout.spinner}>
                  <Spinner/>
                </View>
              ) : this._renderContainer()
              
            }
        </Layout>
        <Process visible={this.state.isProcess}/>
      </Container>
    )
  }

  _renderContainer = () => {
    if (this.state.data?.sewa.length == 0 && this.state.data?.pengeluaran.length == 0) {
      return (
        <Layout style={layout.container}>
          <Empty />
        </Layout>
      )
    }
    
    return (
      <Layout>
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={layout.container}
            refreshControl={
               <RefreshControl refreshing={this.state.isRefresh} onRefresh={this._onRefresh} />
            }
          >
          {this._renderSewa()}
          {this._renderAdjustment()}
          {this._renderPengeluaran()}
        </ScrollView>
      </Layout>
    )
  }

  _renderSewa = () => {
    if (this.state.data?.sewa.length > 0) {
      return (
        <View>
          <FlatList
            refreshControl={
              <RefreshControl refreshing={this.state.isRefresh} onRefresh={this._onRefresh} />
            }
            ListHeaderComponent={this._renderHeaderSewa}
            data={this.state.data.sewa}
            renderItem={this._renderItemSewa}
            contentContainerStyle={(this.state.data.sewa?.length > 0) ? {paddingBottom: 30} : layout.container}
            ListEmptyComponent={<Empty />}
          />
        </View>
      )
    }

    return null;
  }

  _renderAdjustment = () => {
    if (this.state.data?.adjustment.length > 0) {
      return (
        <View>
          <FlatList
            refreshControl={
              <RefreshControl refreshing={this.state.isRefresh} onRefresh={this._onRefresh} />
            }
            ListHeaderComponent={this._renderHeaderAdjustment}
            data={this.state.data?.adjustment}
            renderItem={this._renderItemAdjustment}
            contentContainerStyle={(this.state.data?.adjustment.length > 0) ? {paddingBottom: 30} : layout.container}
            ListEmptyComponent={<Empty />}
          />
        </View>
      )
    }

    return null;
  }

  _renderPengeluaran = () => {
    if (this.state.data?.pengeluaran.length > 0) {
      return (
        <View>
          <FlatList
            refreshControl={
              <RefreshControl refreshing={this.state.isRefresh} onRefresh={this._onRefresh} />
            }
            ListHeaderComponent={this._renderHeaderPengeluaran}
            data={this.state.data?.pengeluaran}
            renderItem={this._renderItemPengeluaran}
            contentContainerStyle={(this.state.data?.pengeluaran.length > 0) ? {paddingBottom: 30} : layout.container}
            ListEmptyComponent={<Empty />}
          />
        </View>
      )
    }

    return null;
  }
  
  _renderHeaderSewa = () => {
    return (
      <Layout style={[styles.containerInner, {paddingTop: 5}]}>
        <Text style={layout.bold} category="p1">Detail Sewa</Text>
      </Layout>
    )
  }

  _renderHeaderAdjustment = () => {
    return (
      <Layout style={[styles.containerInner, {paddingTop: 5}]}>
        <Text style={layout.bold} category="p1">Detail Adjustment</Text>
      </Layout>
    )
  }

  _renderHeaderPengeluaran = () => {
    return (
      <Layout style={[styles.containerInner, {paddingTop: 5}]}>
        <Text style={layout.bold} category="p1">Detail Pengeluaran</Text>
      </Layout>
    )
  }

  _renderItemSewa = ({item, index}) => { 
    return (
      <TouchableOpacity style={[styles.containerInner, {marginHorizontal: 15}]} onPress={() => this._pilihKamar(item)}>
        <View>
          <Layout style={{justifyContent: 'space-between', flexDirection: 'row', paddingTop: 15, paddingBottom: 7}}>
            <Text status='primary'>{item.created_on_f}</Text>
          </Layout>
          <Layout style={{width: '100%', height: 2}} level='3'/>
          <Layout style={{justifyContent: 'space-between', flexDirection: 'row', paddingVertical: 7}}>
            <Text>{'Kode Tagihan'}</Text>
            <Text status='primary'>{(item.kode_tagihan) ? item.kode_tagihan : '-'}</Text>
          </Layout>
          <Layout style={{justifyContent: 'space-between', flexDirection: 'row', paddingVertical: 7}}>
            <Text>{'Rent'}</Text>
            <Text>{(item.harga_sewa_f) ? item.harga_sewa_f : '-'}</Text>
          </Layout>
          <Layout style={{justifyContent: 'space-between', flexDirection: 'row', paddingVertical: 7}}>
            <Text>{'Parking'}</Text>
            <Text>{(item.parking_f) ? item.parking_f : '-'}</Text>
          </Layout>
          <Layout style={{justifyContent: 'space-between', flexDirection: 'row', paddingVertical: 7}}>
            <Text>{'Other'}</Text>
            <Text>{(item.tambahan_biaya_f) ? item.tambahan_biaya_f : '-'}</Text>
          </Layout>
          <Layout style={{justifyContent: 'space-between', flexDirection: 'row', paddingVertical: 7}}>
            <Text>{'Deposit'}</Text>
            <Text>{(item.deposit_f) ? item.deposit_f : '-'}</Text>
          </Layout>
          <Layout style={{width: '100%', height: 2}} level='3'/>
          <Layout style={{justifyContent: 'space-between', flexDirection: 'row', paddingVertical: 7}}>
            <Text style={layout.bold} category="p1">{'Pemasukan'}</Text>
            <Text style={layout.bold} category="p1">{(item.total_harga_f) ? item.total_harga_f : '-'}</Text>
          </Layout>
        </View>
      </TouchableOpacity>
    )
  }

  _renderItemAdjustment = ({item, index}) => {
    return (
      <TouchableOpacity style={[styles.containerInner, {marginHorizontal: 15}]}>
        <View>
          <Layout style={{justifyContent: 'space-between', flexDirection: 'row', paddingTop: 15, paddingBottom: 7}}>
            <Text status='primary'>{item.tanggal_f}</Text>
          </Layout>
          <Layout style={{width: '100%', height: 2}} level='3'/>
          <Layout style={{justifyContent: 'space-between', flexDirection: 'row', paddingVertical: 7}}>
            <Text>{'Kategori'}</Text>
            <Text>{(item.kategori_pemasukan) ? item.kategori_pemasukan : '-'}</Text>
          </Layout>
          <Layout style={{justifyContent: 'space-between', flexDirection: 'row', paddingVertical: 7}}>
            <Text style={{width: '50%'}}>{'Keterangan'}</Text>
            <Text style={{width: '50%', textAlign: 'right'}}>{(item.keterangan) ? item.keterangan : '-'}</Text>
          </Layout>
          <Layout style={{width: '100%', height: 2}} level='3'/>
          <Layout style={{justifyContent: 'space-between', flexDirection: 'row', paddingVertical: 7}}>
            <Text style={layout.bold} category="p1">{(item.is_min == '1') ? 'Pengeluaran' : 'Pemasukan'}</Text>
            <Text style={layout.bold} category="p1">{(item.total_f) ? item.total_f : '-'}</Text>
          </Layout>
        </View>
      </TouchableOpacity>
    )
  }
  
  _renderItemPengeluaran = ({item, index}) => {
    return (
      <TouchableOpacity style={[styles.containerInner, {marginHorizontal: 15}]}>
        <View>
          <Layout style={{justifyContent: 'space-between', flexDirection: 'row', paddingTop: 15, paddingBottom: 7}}>
            <Text status='primary'>{item.tanggal_f}</Text>
          </Layout>
          <Layout style={{width: '100%', height: 2}} level='3'/>
          <Layout style={{justifyContent: 'space-between', flexDirection: 'row', paddingVertical: 7}}>
            <Text>{'Kategori'}</Text>
            <Text>{(item.kategori_pengeluaran) ? item.kategori_pengeluaran : '-'}</Text>
          </Layout>
          <Layout style={{justifyContent: 'space-between', flexDirection: 'row', paddingVertical: 7}}>
            <Text style={{width: '50%'}}>{'Keterangan'}</Text>
            <Text style={{width: '50%', textAlign: 'right'}}>{(item.keterangan) ? item.keterangan : '-'}</Text>
          </Layout>
          <Layout style={{justifyContent: 'space-between', flexDirection: 'row', paddingVertical: 7}}>
            <Text>{'Qty'}</Text>
            <Text>{(item.qty) ? item.qty : '-'}</Text>
          </Layout>
          <Layout style={{justifyContent: 'space-between', flexDirection: 'row', paddingVertical: 7}}>
            <Text>{'Harga'}</Text>
            <Text>{(item.jumlah_f) ? item.jumlah_f : '-'}</Text>
          </Layout>
          <Layout style={{width: '100%', height: 2}} level='3'/>
          <Layout style={{justifyContent: 'space-between', flexDirection: 'row', paddingVertical: 7}}>
            <Text style={layout.bold} category="p1">{'Pengeluaran'}</Text>
            <Text style={layout.bold} category="p1">{(item.total_f) ? item.total_f : '-'}</Text>
          </Layout>
        </View>
      </TouchableOpacity>
    )
  }

  _pilihKamar = (item) => {
    this.props.navigation.push('GoTo', {
      page   : 'DetailSewa',
      params : {
        sewa_id : item.sewa_id,
        action  : this._onAction,
        refresh : this._onRefresh,
      }
    })
  }

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
export default connect(mapStateToProps, mapDispatchToProps)(ListTransaksi);
