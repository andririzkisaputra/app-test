import React, { Component } from 'react';
import { View, RefreshControl, ScrollView, FlatList, TouchableOpacity as TouchableOpacityReal, Image } from 'react-native';
import { Container, Header, Empty } from '../../theme';
import { Layout, Text, Spinner, Icon, Button, Input } from '@ui-kitten/components';
import { connect } from 'react-redux';
import t from '../../lang';
import { request } from '../../bridge';
import { formatDate } from '../../func';
import { setReload } from '../../root/redux/actions';
import layout from '../../theme/styles/layout';
import styles from '../../theme/styles/styles';

class BuktiBayarOwner extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading     : true,
      isOpsiTanggal : false,
      tanggal_now   : new Date(),
      kamar         : '',
      valSearch     : '',
      data          : [],
      filterText    : 'Semua',
      filter        : {'sewa.status_sewa !=' : '0'},
      menuSort      : [
        {
          label    : 'Semua',
          value : this.props?.params?.data,
          badge    : 0,
          isActive : true
        },
        {
          label    : 'Menunggu',
          value    : '(sewa.status_sewa = "1" OR sewa.status_sewa = "2")',
          badge    : 0,
          isActive : (this.props?.params?.checkIn) ? true : false
        },
        {
          label    : 'Check In',
          value    : {'sewa.status_sewa' : '3'},
          badge    : 0,
          isActive : (this.props?.params?.checkIn) ? true : false
        },
        {
          label    : 'Check Out',
          value    : {
            'sewa.status_sewa >=' : '4',
            'sewa.status_sewa <=' : '5',
          },
          badge    : 0,
          isActive : (this.props?.params?.checkOut) ? true : false
        },
        {
          label    : 'Batal',
          value    : {
            'sewa.status_sewa >=' : '6',
            'sewa.status_sewa <=' : '7',
          },
          badge    : 0,
          isActive : (this.props?.params?.checkOut) ? true : false
        },
      ]
    }
  }

  componentDidMount = () => {
    this.props.setReload({key : 'home', value : true});
    this.props.state.reload.home;
    let text = ['Semua', 'Menunggu', 'Check In', 'Check Out', 'Batal'];
    let resDefault = 0;
    this.setState({
      indexSort   : resDefault,
      filterText  : text[resDefault],
      filter      : (resDefault != '0') ? {'status_sewa' : resDefault} : (this.props?.params?.data)
    })
    this._getData();
  }

  _getData = () => {
    this.setState({isProcess : true}, () => {
      request({
        'model'     : 'Sewa_model',
        'key'       : 'getSewa',
        'table'     : '-',
        'where'     : {
          'pemilik_id' : this.props.state.user.user_id,
          'role'       : this.props.state.user.role,
          'filter'     : this.state.filter,
          'keyword'    : this.state.valSearch,
        }
      }).then((res) => {
        this.setState({
          data          : res.data,
          totaldata     : res.totaldata,
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
          center : this.props?.params?.title,
          isBack : true
        }}/>
        <Layout style={layout.container}>
            {
              (this.state.isLoading) ?
              (
                <View style={layout.spinner}>
                  <Spinner/>
                </View>
              ) : (
                <FlatList
                  refreshControl={
                     <RefreshControl refreshing={this.state.isRefresh} onRefresh={this._onRefresh} />
                  }
                  ListHeaderComponent={this._renderHeader}
                  data={this.state.data}
                  renderItem={this._renderItem}
                  contentContainerStyle={(this.state.data?.length > 0) ? null : layout.container}
                  ListEmptyComponent={<Empty />}
                />
              )
            }
        </Layout>
      </Container>
    )
  }

  _renderItem = ({item, index}) => {
    return (
      <>
        <Layout style={{height : 8}} level="3"/>
        <TouchableOpacityReal disabled={item.isActive} onPress={() => this._pilihKamar(item)} style={[styles.containerInner, item.isStatus ? {backgroundColor : 'rgba(199, 252, 252, 0.32)'} : {}]} activeOpacity={0.9}>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10}}>
            {
            // <View style={{flexDirection: 'row'}}>
            //   <Image style={styles.iconSewaKosan} source={{uri : item.gambar_properti}} />
            //   <Text style={layout.bold}>{item.nama_properti}</Text>
            // </View>
            }
            <View>
              <Text style={{color : ((item.status_sewa == '3') ? '#60B8D6' : ((item.status_sewa != '3') ? '#ff2929' : '#a1a1a1'))}} category='c2'>{item.status_sewa_f}</Text>
            </View>
          </View>
          <View style={{paddingVertical: 10, paddingHorizontal: 0}}>
            <View style={styles.containerInfo}>
              {
                (item.gambar_kamar) &&
                <Image style={styles.listItemImgSewa} source={{uri : item.gambar_kamar}}/>
              }
              <View style={{flex: 1}}>
              <Text numberOfLines={2} style={[layout.regular, layout.semiBold, {marginVertical: 2}]} category='p2'>{t('aNamaKamar', {nama_kos : item.nama_properti, tipe_kamar : item.tipe_kamar , nomor_kamar : item.nomor_kamar})}</Text>
                {/* <Text numberOfLines={1} style={[layout.regular, {marginVertical: 2}]} category='p2'>{item.harga_f}</Text> */}
              </View>

            </View>
          </View>
          <View style={{borderWidth: 0.4, width: '100%', borderColor: '#e3e3e3'}}/>
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5}}>
            <Text numberOfLines={1} style={[layout.regular, {marginVertical: 2, color : '#a1a1a1'}]} category='p2'>{'Kode Pesanan'}</Text>
            <Text numberOfLines={1} style={[layout.regular, layout.semiBold, {marginVertical: 2, color : '#a1a1a1'}]} category='p2'>{item.kode_tagihan}</Text>
          </View>
          {
            (item.tanggal_bayar) &&
            <>
              <View style={{borderWidth: 0.4, width: '100%', borderColor: '#e3e3e3'}}/>
              <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5}}>
                <Text numberOfLines={1} style={[layout.regular, {marginVertical: 2, color : '#a1a1a1'}]} category='p2'>{'Tanggal Bayar'}</Text>
                <Text numberOfLines={1} style={[layout.regular, layout.semiBold, {marginVertical: 2, color : '#a1a1a1'}]} category='p2'>{item.tanggal_bayar}</Text>
              </View>
            </>
          }
          <View style={{borderWidth: 0.4, width: '100%', borderColor: '#e3e3e3'}}/>
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5}}>
            <Text numberOfLines={1} style={[layout.regular, {marginVertical: 2, color : '#a1a1a1'}]} category='p2'>{'Info Tanggal'}</Text>
            <Text numberOfLines={1} style={[layout.regular, layout.semiBold, {marginVertical: 2, color : '#a1a1a1'}]} category='p2'>{item.checkin+'-'+item.checkout}</Text>
          </View>
          {
          // <View style={{borderWidth: 0.4, width: '100%', borderColor: '#e3e3e3'}}/>
          // <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5}}>
          //   <Text numberOfLines={1} style={[layout.regular, {marginVertical: 2, color : '#a1a1a1'}]} category='p2'>{'Priode Check In'}</Text>
          //   <Text numberOfLines={1} style={[layout.regular, layout.semiBold, {marginVertical: 2, color : '#a1a1a1'}]} category='p2'>{item.priode}</Text>
          // </View>
          }
          <View style={{borderWidth: 0.4, width: '100%', borderColor: '#e3e3e3'}}/>
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5}}>
            <Text numberOfLines={1} style={[layout.regular, {marginVertical: 2, color : '#a1a1a1'}]} category='p2'>{'Total'}</Text>
            <Text numberOfLines={1} style={[layout.regular, layout.semiBold, {marginVertical: 2, color : '#a1a1a1'}]} category='p2'>{item.total_bayar_f}</Text>
          </View>
          {
            // (item.status_sewa == '2') &&
            // <View style={{marginVertical: 10}}>
            //   <Button size="small" onPress={() => this._onProsesBayar(item)}>Konfirmasi Pembayaran</Button>
            // </View>
          }
        </TouchableOpacityReal>
      </>
    )
  }

  _renderHeader = () => {
    return (
      <View>
        {
          // <Layout style={[{marginHorizontal: 15, marginBottom: 15}]}>
          //   <Input
          //     placeholder={t('iJumlahData', {jumlah : this.state.totaldata})}
          //     style={[styles.inputStyle, {width : '100%'}]}
          //     textStyle={layout.regular}
          //     accessoryRight={this.renderIconHeader}
          //     value={this.state.valSearch}
          //     onChangeText={(val) => this.setState({valSearch : val})}
          //     ref={ref => { this.input = ref }}
          //     onSubmitEditing={this._getData}
          //   />
          // </Layout>
        }
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

  renderIconHeader = () => {
    return (
      <View>
        {
          (this.state.valSearch) ?
          (
            <TouchableOpacityReal onPress={this._onRefresh} onLongPress={() => Toast.show(t('bDelete'), Toast.SHORT)}>
              <Icon style={styles.iconFilter} name="close-outline"/>
            </TouchableOpacityReal>
          ) :
          (
            null
          )
        }
      </View>
    )
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

  _renderMenuSort = (item, index) => {
    if (!item.isActive) {
      return null;
    }
    return (
      <TouchableOpacityReal onPress={() => this._filter(item, index)} key={index}>
        <Text style={[styles.buttonMenuFilter, (this.state.filterText == item.label) ? styles.buttonMenuFilterActive : {}]}>{item.label+((item.badge > 0) ? ' ('+item.badge+')' : '')}</Text>
      </TouchableOpacityReal>
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

  _onAction = () => {
    this.props.navigation.pop();
    this._onRefresh();
  }

  _onRefresh = () => {
    this.setState({isRefresh : true, valSearch : ''}, () => {
      this._getData()
    })
  }

}

const mapStateToProps = state => ({state: state});
const mapDispatchToProps = dispatch => ({
  setReload: (data) => dispatch(setReload(data)),
});
export default connect(mapStateToProps, mapDispatchToProps)(BuktiBayarOwner);
