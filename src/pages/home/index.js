import React, { Component } from 'react';
import { View, Dimensions, Image, ScrollView, RefreshControl, TouchableOpacity, FlatList, LogBox } from 'react-native';
import { Container, Header } from '../../theme';
import { Layout, Text, Spinner, Icon, ListItem } from '@ui-kitten/components';
import { connect } from 'react-redux';
import { DEFAULT_DB_USER } from '../../config';
import { setReload } from '../../root/redux/actions';
import { request } from '../../bridge';
import { get } from '../../bridge/storage';
import { CommonActions } from '@react-navigation/native';
import OneSignal from 'react-native-onesignal';
import Carousel from 'react-native-banner-carousel';
import layout from '../../theme/styles/layout';
import styles from '../../theme/styles/styles';
import t from '../../lang';
// LogBox.ignoreAllLogs();

const BannerWidth = Dimensions.get('window').width - 32;
const BannerHeight = 130;

const images = [
  "https://static.thehoneycombers.com/wp-content/uploads/sites/4/2019/04/Villa-Tantangan-Bedroom-900x643.jpg",
  "https://pix10.agoda.net/hotelImages/3008760/0/b719b1c13fa0f7d102fb9b4d83e81a76.jpg?s=1024x768",
  "https://images.adsttc.com/media/images/55c1/93ca/e58e/ce59/3800/00bb/large_jpg/portada_7.jpg?1438749636"
];

class Home extends Component {

  constructor(props) {
    super(props);

    this._handleNotif();
    const date = new Date();
    this.state = {
      data      : [],
      profile   : '',
      isLoading : true,
      date      : date.getHours(),
      isSewa    : false,
      lastKamar : [],
      user_id_d : this.props.state.user.user_id
    }

    this.focus = false;
  }

  _handleNotif = () => {
    OneSignal.setNotificationWillShowInForegroundHandler(notificationReceivedEvent => {
      let notification = notificationReceivedEvent.getNotification();
      this.onReceived(notification);
      notificationReceivedEvent.complete(notification);
    });

    OneSignal.setNotificationOpenedHandler(notification => {
      this.onOpened(notification);
    });
  }

  onReceived = (notification) => {
    let params = (notification?.additionalData?.params) ? JSON.parse(notification?.additionalData?.params) : {};
    this._reloadList(params);
  }

  onOpened = (openResult) => {
    let params = (openResult?.notification?.additionalData?.params) ? JSON.parse(openResult?.notification?.additionalData?.params) : {};
    if (params) {
      let sewa_id      = params?.sewa_id;
      let produk_id    = params?.produk_id;
      let isOwner      = params?.isOwner;
      let isKomplain   = params?.isKomplain;
      if (sewa_id) {
        this.props.navigation.push('GoTo', {
          page    : 'DetailSewa',
          params  : {
            sewa_id : sewa_id,
            action  : this._onAction,
            refresh : this._onRefresh,
          }
        });
      } else if (isKomplain) {
        this.props.navigation.replace('GoTo', {
          page    : 'KomplainUser',
        });
      }
    }
  }

  _reloadList = (params) => {
    if (params) {
      let sewa_id      = params?.sewa_id;
      let produk_id    = params?.produk_id;
      let isOwner      = params?.isOwner;
      let isKomplain   = params?.isKomplain;
      if (sewa_id) {
        this.props.setReload({key : 'home', value : true});
      } else if (isKomplain) {
        this.props.setReload({key : 'home', value : true});
      }
    }
  }

  componentDidMount = () => {
    if (!this.props.state.user.user_id) {
      get({table : DEFAULT_DB_USER}).then((data) => {
        if(data) {
          this.setState({user_id_d : data.user_id}, () => {
            this._getData()
          });
        }else {
          this._getData()
        }
      });
    }else {
      this._getData()
    }

    this.focus = this.props.navigation.addListener('focus', () => {
      if (this.props.state.reload.home) {
        this._onRefresh();
        this.props.setReload({key : 'home', value : false});
      }
    });
  }

  componentWillUnmount = () => {
     if (this.focus) {
       this.focus = false;
       this.props?.navigation?.removeListener();
     }
  }

  _getData = () => {
    this.setState({isProcess : true}, () => {
      request({
        'model'     : 'Home_model',
        'key'       : 'home',
        'table'     : '-',
        'where'     : {
          'created_by' : (this.props.state.user.user_id ? this.props.state.user.user_id : this.state.user_id_d)
        }
      }).then((res) => {
        this.setState({
          notif     : res.data.notif,
          profile   : res.data.profile,
          data      : res.data,
          // isRefresh : false,
          // isLoading : false,
          // isProcess : false
        }, () => {
          this._getInfo();
        });
      }).catch((error) => {
        this.setState({isLoading : false, isRefresh : false, isProcess : false});
      });
    })
  }

  _getInfo = () => {
    request({
      'model'     : 'Home_model',
      'key'       : 'get_sewa',
      'table'     : '-',
      'where'     : {
        'user_id' : this.props.state.user.user_id,
        'role'    : this.props.state.user.role
      }
    }).then((res) => {
      this.setState({
        isSewa        : res.data?.isSewa,
        lastKamar     : res.data?.lastKamar,
        lastInfo      : res.data?.lastInfo,
        lastKomplain  : res.data?.lastKomplain,
        isRefresh     : false,
        isLoading     : false
      });
    }).catch((error) => {
      this.setState({isLoading : false, isRefresh : false});
    });
  }

  render() {
    return (
      <Container>
        <Header navigation={this.props.navigation} params={{
          center : '',
          right  : (!this.state.isSewa ? this._right : null),
          isBack : false
        }}/>
        <Layout style={[layout.container, styles.containerInner]}>
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

  _renderContainer = () => {
    return (
      <>
        {
          (this.props.state.user.isLogin) &&
          <View style={styles.containerHeader}>
            <View style={styles.containerHeaderLeft}>
              <View style={styles.containerHeaderIcon}>
              {
                (this.props.state.user.user_img) ?
                (<Image style={styles.iconAvatarProfileImg} source={{uri : this.props.state.user.user_img_preview}} />) :
                (<Icon style={styles.iconAvatarProfile} name="person-outline"/>)
              }
              </View>
              <View style={styles.containerTextHeader}>
                <Text category="c2" appearance="hint">{(this.state.date > 12 && this.state.date < 18) ? t('aSelamatSiang') : (this.state.date >= 18 ? t('aSelamatMalam') : t('aSelamat'))}</Text>
                <Text style={layout.bold} numberOfLines={1}>{this.props.state.user.nama}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={this._notif} style={styles.containerIconHome1}>
              <View style={styles.containerIconMenu}>
                {
                  (this.state.notif?.notif) ?
                  (
                    <View style={styles.dotNotif}/>
                  ) : null
                }
                <Icon style={styles.iconHeaderRight} name="bell-outline"/>
              </View>
            </TouchableOpacity>
          </View>
        }
        <Carousel autoplay={false} loop index={0} pageSize={BannerWidth} pageIndicatorContainerStyle={styles.pageIndicator} activePageIndicatorStyle={styles.indicatorActive}>
          {images.map((image, index) => this.renderPage(image, index))}
        </Carousel>

        {
          (this.props.state.user.isLogin) && (
            <View style={{marginTop : 12}}>
              {
                (this.props.state.user.role != '2') ?
                (
                  <View>
                    <Text category="h6" style={[layout.bold, styles.listHeader, {marginBottom : 6}]}>Propertiku</Text>
                    <TouchableOpacity style={styles.containerKamarku} onPress={this._onPropertiClick}>
                      <View style={[styles.containerHeaderLeft, { marginBottom : 14}]}>
                      {
                        (this.state.isSewa) &&
                        (<Image style={styles.imgKamarku2} source={{uri : this.state.lastKamar.gambar_link}}/>)
                      }
                      {
                          (this.state.isSewa) ?
                          (
                            <View style={styles.containerTextHeader}>
                              <Text style={[layout.semiBold, { marginBottom : 3}]}>{this.state.lastKamar.nama_properti}</Text>
                              <Text category="c2" appearance="hint">Jumlah Kamar {this.state.lastKamar.jumlah_kamar}</Text>
                              <Text category="c2" appearance="hint">Kamar Tersewa {this.state.lastKamar.kamar_tersewa}</Text>
                              <Text category="c2" appearance="hint">Kamar Kosong {this.state.lastKamar.kamar_kosong}</Text>
                            </View>
                          )
                          :
                          (
                            <View>
                              <Text style={[layout.semiBold]}>Belum ada properti</Text>
                            </View>
                          )
                      }

                      </View>
                      <View style={styles.footerKamarku}>
                        <Text category="c2" style={layout.bold} status="info">Lihat Detail</Text>
                        <Icon style={{width : 18, height : 18}} name={'arrow-ios-forward-outline'}/>
                      </View>
                    </TouchableOpacity>
                  </View>
                ) : null
              }

              {
                (this.props.state.user.role == '2' && this.state.isSewa) ?
                (
                  <View>
                    <Text category="h6" style={[layout.bold, styles.listHeader, {marginBottom : 6}]}>Kamarku</Text>
                    <TouchableOpacity style={styles.containerKamarku} onPress={this._onKamarkuClick}>
                      <View style={[styles.containerHeaderLeft, { marginBottom : 14}]}>
                      {
                        (this.state.isSewa) &&
                        (<Image style={styles.imgKamarku2} source={{uri : this.state.lastKamar.gambar_link}}/>)
                      }
                      {
                          (this.state.isSewa) ?
                          (
                            <View style={styles.containerTextHeader}>
                              <Text style={[layout.semiBold, { marginBottom : 3}]}>{this.state.lastKamar.nama_properti}</Text>
                              <Text category="c2" appearance="hint" numberOfLines={1}>Berakhir pada {this.state.lastKamar.tanggal_selesai_f}</Text>
                              <Text category="c2" appearance="hint" numberOfLines={1}>Dibersihkan pada {this.state.lastKamar.waktu_bersih}</Text>
                              <Text category="c2" status="primary" numberOfLines={1}>{this.state.lastKamar.status_sewa_f}</Text>
                            </View>
                          )
                          :
                          (
                            <View>
                              <Text style={[layout.semiBold]} appearance="hint">Kamu belum menyewa kamar</Text>
                            </View>
                          )
                      }

                      </View>
                      <View style={styles.footerKamarku}>
                        <Text category="c2" style={layout.bold} status="info">Lihat Histori</Text>
                        <Icon style={{width : 18, height : 18}} name={'arrow-ios-forward-outline'}/>
                      </View>
                    </TouchableOpacity>
                  </View>
                ) : null
              }

              {
                // (this.props.state.user.role == '2') && (
                //   <>
                //     <Text category="h6" style={[layout.bold, styles.listHeader, {marginBottom : 6}]}>Kelola Kamar</Text>
                //     <View style={{backgroundColor : 'white', borderWidth : 1, borderColor : '#eef4f9',borderRadius : 12, paddingHorizontal : 14, paddingVertical : 4, marginBottom : 4}}>
                //       <View style={styles.containerMenuProf}>
                //         <TouchableOpacity style={styles.containerIconProf} activeOpacity={0.9} onPress={this._buktiBayar}>
                //           <View style={styles.containerIconMenu}>
                //             {
                //               (this.state.notif?.bukti_bayar) ?
                //               (
                //                 <View style={styles.dotNotif}/>
                //               ) : null
                //             }
                //             <Icon style={[styles.iconMenuProf, styles.iconBukti]} name={'credit-card-outline'}/>
                //           </View>
                //           <Text category="c2">Bukti Bayar</Text>
                //         </TouchableOpacity>
                //
                //         <TouchableOpacity style={styles.containerIconProf} activeOpacity={0.9} onPress={this._Pengeluaran}>
                //           <View style={styles.containerIconMenu}>
                //             <Icon style={[styles.iconMenuProf, styles.iconPengeluaran]} name={'book-open-outline'}/>
                //           </View>
                //           <Text category="c2">Pengeluaran</Text>
                //         </TouchableOpacity>
                //
                //         <TouchableOpacity style={styles.containerIconProf} activeOpacity={0.9} onPress={this._komplain}>
                //           <View style={styles.containerIconMenu}>
                //             <Icon style={[styles.iconMenuProf, styles.iconKomplain]} name={'alert-circle-outline'}/>
                //           </View>
                //           <Text category="c2">Komplain</Text>
                //         </TouchableOpacity>
                //       </View>
                //     </View>
                //   </>
                // )
              }

              {
                (this.props.state.user.role != '2') && (
                  <>
                    <Text category="h6" style={[layout.bold, styles.listHeader, {marginBottom : 6}]}>Kelola Properti</Text>
                    <View style={{backgroundColor : 'white', borderWidth : 1, borderColor : '#eef4f9',borderRadius : 12, paddingHorizontal : 14, paddingVertical : 4, marginBottom : 4}}>
                      <View style={styles.containerMenuProf}>
                        <TouchableOpacity style={styles.containerIconProf} activeOpacity={0.9} onPress={this._onCheckIn}>
                          <View style={styles.containerIconMenu}>
                            {
                              (this.state.notif?.bukti_bayar) ?
                              (
                                <View style={styles.dotNotif}/>
                              ) : null
                            }
                            <Icon style={[styles.iconMenuProf, styles.iconBukti]} name={'log-in-outline'}/>
                          </View>
                          <Text category="c2">Check In</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.containerIconProf} activeOpacity={0.9} onPress={this._onCheckOut}>
                          <View style={styles.containerIconMenu}>
                            {
                              (this.state.notif?.check_out) ?
                              (
                                <View style={styles.dotNotif}/>
                              ) : null
                            }
                            <Icon style={[styles.iconMenuProf, styles.iconKomplain]} name={'log-out-outline'}/>
                          </View>
                          <Text category="c2">Check Out</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.containerIconProf} activeOpacity={0.9} onPress={this._Pengeluaran} disabled={(this.props.state.user.role == '3' ? true : false)}>
                          <View style={styles.containerIconMenu} opacity={(this.props.state.user.role == '3' ? 0.5 : 1)}>
                            <Icon style={[styles.iconMenuProf, styles.iconPengeluaran]} name={'book-open-outline'}/>
                          </View>
                          <Text category="c2">Pengeluaran</Text>
                        </TouchableOpacity>

                      </View>
                    </View>
                  </>
                )
              }

              {
                (this.props.state.user.role != '2' || (this.props.state.user.role == '2' && this.state.isSewa)) && (
                  <>
                    <View style={{marginTop : 12}}>
                      <Text category="h6" style={[layout.bold, styles.listHeader, {marginBottom : 6}]}>Informasi</Text>
                      <TouchableOpacity style={styles.containerKamarku} onPress={this._onLihatHistoriInfo}>
                        <View style={[styles.containerHeaderLeft, { marginBottom : 14}]}>
                        {
                            (this.state.lastInfo?.judul) ?
                            (
                              <View style={[styles.containerTextHeader, { marginLeft : 2 }]}>
                                <Text style={[layout.semiBold, { marginBottom : 3}]}>{this.state.lastInfo?.judul}</Text>
                                <Text category="c2" appearance="hint" numberOfLines={2}>{this.state.lastInfo?.isi}</Text>
                              </View>
                            )
                            :
                            (
                              <View>
                                <Text style={[layout.semiBold]}>Belum ada informasi</Text>
                              </View>
                            )
                        }

                        </View>
                        <View style={styles.footerKamarku}>
                          <Text category="c2" style={layout.bold} status="info">Lihat Histori</Text>
                          <Icon style={{width : 18, height : 18}} name={'arrow-ios-forward-outline'}/>
                        </View>
                      </TouchableOpacity>
                    </View>

                    <View style={{marginTop : 12}}>
                      <Text category="h6" style={[layout.bold, styles.listHeader, {marginBottom : 6}]}>Komplain</Text>
                      <TouchableOpacity style={styles.containerKamarku} onPress={this._onLihatHistori}>
                        <View style={[styles.containerHeaderLeft, { marginBottom : 14}]}>
                        {
                            (this.state.lastKomplain?.created_on) ?
                            (
                              <View style={[styles.containerTextHeader, { marginLeft : 2 }]}>
                                <Text style={[layout.semiBold, { marginBottom : 3}]}>{this.state.lastKomplain?.created_on_f}</Text>
                                <Text category="c2" appearance="hint" numberOfLines={2}>{this.state.lastKomplain?.keterangan+'\nTanggapan : '+(this.state.lastKomplain?.tanggapan || '-')}</Text>
                              </View>
                            )
                            :
                            (
                              <View>
                                <Text style={[layout.semiBold]}>Belum ada komplain baru</Text>
                              </View>
                            )
                        }

                        </View>
                        <View style={styles.footerKamarku}>
                          <Text category="c2" style={layout.bold} status="info">Lihat Histori</Text>
                          <Icon style={{width : 18, height : 18}} name={'arrow-ios-forward-outline'}/>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </>
                )
              }

            </View>
          )
        }

        {
          (!this.props.state.user.isLogin || (this.props.state.user.isLogin && !this.state.isSewa && this.props.state.user.role == '2')) && (
            <View style={styles.containerHome}>
              <TouchableOpacity style={styles.containerHeaderTop} onPress={this._search} activeOpacity={0.9}>
                <View style={styles.containerHeader2}>
                  <Icon style={styles.iconRekomen} name="compass-outline"/>
                  <Text category="h6" style={[layout.bold, styles.listHeader]}>Kostzy Terbaru</Text>
                </View>
                <Text category="p2" style={layout.bold} status="primary">More...</Text>
              </TouchableOpacity>

              <FlatList
                data={this.state.data.properti}
                renderItem={this._renderItemProperti}
              />

              {
                (this.state.data?.favorite?.length > 0 && this.props.state.user.isLogin) &&
                <View style={styles.containerHome}>
                  <View style={styles.containerHeaderTop}>
                    <View style={styles.containerHeader2}>
                      <Icon style={[styles.iconRekomen, { color : 'red'}]} name="heart"/>
                      <Text category="h6" style={[layout.bold, styles.listHeader]}>Kostzy Favorit</Text>
                    </View>
                    <Text category="p2" style={layout.bold} status="primary">More...</Text>
                  </View>

                  <FlatList
                    data={this.state.data.favorite}
                    renderItem={this._renderItemFavorite}
                  />

                </View>
              }

            </View>
          )
        }
      </>
    )
  }

  renderPage(image, index) {
    return (
      <View key={index}>
        <Image style={{ width: BannerWidth, height: BannerHeight, borderRadius : 12 }} source={{ uri: image }} />
      </View>
    );
  }

  _renderItemProperti = ({item, index}) => {
    return (
      <View style={styles.pb16}>
        <TouchableOpacity activeOpacity={0.9} onPress={() => this._detail(item)} tyle={styles.containerList}>
          <View style={styles.containerInnerList}>
            <>
              <Image style={styles.listItemImg} source={{uri : item?.gambar_link}}/>
              {
                (item.bintang > 0) &&
                <View style={styles.containerRating}>
                  <Icon style={[styles.iconStar, styles.iconStarMargin]} name="star"/>
                  <Text category="c2" style={[layout.bold, styles.sumRating]}>{item.bintang}</Text>
                </View>
              }
            </>
            <View style={styles.containerItem}>
              <Text numberOfLines={1} style={[layout.bold, styles.listTitle]}>{item.nama_properti}</Text>
              <View style={[styles.containerCoin, styles.iconTextHome]}>
                <Icon style={styles.iconCoin2} name="pricetags-outline"/>
                <Text numberOfLines={1} category="s2" appearance="hint" style={layout.bold}>{(item.harga_min < item.harga_max) ? t('dHargaMinBulan', {hargaMin : item.harga_min_f, hargaMax : item.harga_max_f})  : t('dHargaBulan', {harga : item.harga_f})}</Text>
              </View>
              <Text category="c2" appearance="hint" numberOfLines={1} style={styles.listDesc}>{((item.kota && item.alamat) ? item.kota+' • '+item.alamat : '')}</Text>
              <View style={styles.containerCoin}>
                <Text numberOfLines={1} category="c2" appearance="hint" style={layout.medium}>{item?.jumlah_lantai} lantai, {item?.jumlah_kamar} kamar</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  _renderItemFavorite = ({item, index}) => {
    return (
      <View style={styles.pb16}>
        <TouchableOpacity activeOpacity={0.9} onPress={() => this._detail(item)} tyle={styles.containerList}>
          <View style={styles.containerInnerList}>
              <>
                <Image style={styles.listItemImg} source={{uri : item?.gambar_link}}/>
                {
                  (item.bintang > 0) &&
                  <View style={styles.containerRating}>
                    <Icon style={[styles.iconStar, styles.iconStarMargin]} name="star"/>
                    <Text category="c2" style={[layout.bold, styles.sumRating]}>{item.bintang}</Text>
                  </View>
                }
              </>
            <View style={styles.containerItem}>
              <Text numberOfLines={1} style={[layout.bold, styles.listTitle]}>{item.nama_properti}</Text>
              <View style={[styles.containerCoin, styles.iconTextHome]}>
                <Icon style={styles.iconCoin2} name="pricetags-outline"/>
                <Text numberOfLines={1} category="s2" appearance="hint" style={layout.bold}>{(item.harga_min < item.harga_max) ? t('dHargaMinBulan', {hargaMin : item.harga_min_f, hargaMax : item.harga_max_f})  : t('dHargaBulan', {harga : item.harga_f})}</Text>
              </View>
              <Text category="c2" appearance="hint" numberOfLines={1} style={styles.listDesc}>{item.alamat}</Text>
              <View style={styles.containerCoin}>
                <Icon style={styles.iconCoin} name="pin-outline"/>
                <Text numberOfLines={1} category="c2" appearance="hint" style={layout.medium}>18 meter</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  _onCheckIn = () => {
    this.props.navigation.push('GoTo', {
      page   : 'BuktiBayarOwner',
      params : {
        checkIn  : true,
        checkOut : false,
        data :  {
          'sewa.status_sewa !=' : '0',
          'sewa.status_sewa >=' : '1',
          'sewa.status_sewa <=' : '3',
        },
        title: 'Check In'
      }
    })
  }

  
  _onCheckOut = () => {
    this.props.navigation.push('GoTo', {
      page   : 'BuktiBayarOwner',
      params : {
        checkIn  : false,
        checkOut : true,
        data :  {
          'sewa.status_sewa !=' : '0',
          'sewa.status_sewa >=' : '4',
          'sewa.status_sewa <=' : '7',
        },
        title: 'Check Out'
      } 
    })
  }

  _buktiBayar = () => {
    this.props.navigation.push('GoTo', {
      page : 'BuktiBayar'
    })
  }

  _Pengeluaran = () => {
    this.props.navigation.push('GoTo', {
      page : 'PengeluaranUser'
    })
  }

  _pemasukan = () => {
    this.props.navigation.push('GoTo', {
      page : 'Pemasukan'
    })
  }

  _onLihatHistori = () => {
    const commonActions = CommonActions.navigate({name : 'InfoTab', params : { active : 1 }});
    this.props.navigation.dispatch(commonActions);
  }

  _onLihatHistoriInfo = () => {
    const commonActions = CommonActions.navigate({name : 'InfoTab', params : { active : 0 }});
    this.props.navigation.dispatch(commonActions);
  }

  _onPropertiClick = () => {
    this.props.navigation.push('GoTo', {
      page : 'Properti'
    })
  }

  _onKamarkuClick = () => {
    this.props.navigation.push('GoTo', {
      page : 'KamarKu'
    })
  }

  _right = () => (
    <TouchableOpacity onPress={this._search} style={styles.containerIconHome2}>
      <Icon style={styles.headerIcon} name="search-outline"/>
    </TouchableOpacity>
  )

  _notif = () => {
    this.props.navigation.push('GoTo', {
      page : 'Notif'
    })
  }

  _search = () => {
    this.props.navigation.push('GoTo', {
      page : 'Search'
    })
  }

  _detail = (item) => {
    this.props.navigation.push('GoTo', {
      page   : 'KosDetail',
      params : {
        properti_id : item.properti_id,
        action      : this._onAction
      }
    })
  }

  _onAction = () => {
    this.props.navigation.pop();
    this._onRefresh();
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
export default connect(mapStateToProps, mapDispatchToProps)(Home);
