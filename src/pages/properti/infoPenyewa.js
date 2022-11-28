import React, { Component } from 'react';
import { View, RefreshControl, ScrollView, Image, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import { Container, Header, Empty } from '../../theme';
import { Layout, Text, Spinner, Icon } from '@ui-kitten/components';
import { connect } from 'react-redux';
import t from '../../lang';
import { request } from '../../bridge';
import layout from '../../theme/styles/layout';
import styles from '../../theme/styles/styles';


const BannerWidth = Dimensions.get('window').width;
const BannerHeight = 180;

class InfoPenyewa extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isProcess     : false,
            isAlert       : false,
            isOpsiTanggal : false,
            isLoading     : true,
            tanggal_now   : new Date(),
            kamar         : '',
            data          : [],
            paramsAlert   : [],
            menuAct       : [],
        }
    }

  
    componentDidMount = () => {
        this._getData();
    }

    _getData = () => {
        this.setState({isProcess : true}, () => {
            request({
            'model'     : 'All_model',
            'key'       : 'infoPenyewa',
            'table'     : '-',
            'where'     : {
                'user_id'  : (this.props.params?.penyewa?.created_by) ? this.props.params?.penyewa?.created_by : this.props.params?.penyewa?.user_id,
                'kamar_id' : (this.props.params?.penyewa?.kamar_id) ? this.props.params?.penyewa?.kamar_id : this.props.params?.penyewa?.kamar_id,
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
                this.setState({
                    isLoading : false,
                    isRefresh : false, 
                    isProcess : false
                });
            });
        })
    }


    render() {
        return (
            <Container>      
                <Header navigation={this.props.navigation} params={{
                    center : t('pInfoPenyewa'),
                    isBack : true
                }}/>
                <Layout style={layout.container}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={this.state.isLoading ? layout.container : null}
                        refreshControl={
                            <RefreshControl refreshing={this.state.isRefresh} onRefresh={this._onRefresh} />
                        }
                    >
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
            </Container>
        )
    }

    _renderContainer = () =>{
        return (
            <Layout>
                <View style={[styles.containerHome, styles.containerInner]}>
                    <TouchableOpacity onPress={this._detailProfile} style={{marginBottom: 16, padding: 20, flexDirection: 'row', backgroundColor: '#ededed', borderRadius: 10}}>
                        {
                            (this.state.data?.gambar_link) ?
                            (
                                <Image style={styles.iconAvatarProfileImg} source={{uri : this.state.data.gambar_link}} />
                                ) : (
                                    <View style={{borderRadius : 60, height : 60, width : 60, borderWidth : 1, borderColor : '#d0d0d0', justifyContent : 'center', alignItems : 'center'}}>
                                        <Icon style={[styles.iconAvatarProfileImg, { color : '#e1e1e1', height : 40, width : 40 }]} name="person"/>
                                </View>
                            )
                        }
                        <View style={{marginLeft: 10, paddingVertical: 4, justifyContent: 'space-between'}}>
                            <View style={{marginLeft: 2}}>
                                <Text style={layout.semiBold} category="p2">{this.state.data.nama}</Text>
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <Icon style={styles.iconProfile} name="calendar-outline" />
                                <Text style={{marginLeft: 5}} category="c2" appearance='hint'>{this.state.data.birthday_f}</Text>
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <Icon style={styles.iconProfile} name="pin-outline" />
                                <Text style={{marginLeft: 5}} category="c2" appearance='hint'>{this.state.data.alamat}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <Text style={layout.semiBold}>History Sewa</Text>
                </View>
                <FlatList
                    style={{ marginVertical:10 }}
                    data={this.state.data?.history}
                    renderItem={this._renderItem}
                    ListEmptyComponent={<Empty />}
                />
            </Layout>
        )
    }

    
    renderPage(image, index) {
        return (
            <View key={index}>
                <Image style={{ width: BannerWidth, height: BannerHeight, borderRadius : 0 }} source={{ uri: image.gambar_link }} />
            </View>
        );
    }

    
  _renderItem = ({item, index}) => {
    return (
        <View>
            <Layout style={{height : 8}} level="3"/>
            <TouchableOpacity disabled={item.isActive} onPress={() => this._pilihKamar(item)} style={[styles.containerInner, item.isStatus ? {backgroundColor : 'rgba(199, 252, 252, 0.32)'} : {}]} activeOpacity={0.9}>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10}}>
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
                        <Text numberOfLines={2} style={[layout.regular, layout.semiBold, {marginVertical: 2}]} category='p2'>{item.nomor_kamar+' - '+item.tipe_kamar}</Text>
                        <Text numberOfLines={1} style={[layout.regular, {marginVertical: 2}]} category='p2'>{item.harga_f}</Text>
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
            </TouchableOpacity>
        </View>
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
  
  _detailProfile = () => {
    this.props.navigation.push('GoTo', {
      page   : 'DetailProfile',
      params : {
        user_id : this.state.data.user_id
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

});
export default connect(mapStateToProps, mapDispatchToProps)(InfoPenyewa);
