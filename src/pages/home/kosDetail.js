import React, { Component } from 'react';
import { View, Dimensions, ScrollView, TouchableOpacity, RefreshControl, Image, FlatList } from 'react-native';
import { Container, Header, Calert } from '../../theme';
import { Layout, Text, Spinner, Icon, BottomNavigation, Button, ListItem, Avatar } from '@ui-kitten/components';
import { connect } from 'react-redux';
import Carousel from 'react-native-banner-carousel';
import { request } from '../../bridge';
import { setReload } from '../../root/redux/actions';
import t from '../../lang';
import layout from '../../theme/styles/layout';
import styles from '../../theme/styles/styles';

const BannerWidth = Dimensions.get('window').width;
const BannerHeight = 180;

class KosDetail extends Component {

  constructor(props) {
    super(props);

    this.state = {
      paramsAlert   : [],
      data          : [],
      data_gambar   : [],
      data_kamar    : [],
      detail_kamar  : [],
      properti_id   : '',
      follow        : '',
      tipe_kamar_id : '',
      isLoading     : true,
      isAlert       : false,
    }
  }

  componentDidMount = () => {
    this.setState({properti_id : this.props.params.properti_id}, () => {
      this._getData();
    })
  }

  _getData = () => {
    this.setState({isLoading : true}, () => {
      request({
        'model'     : 'Properti_model',
        'key'       : 'properti_detail',
        'table'     : '-',
        'where'     : {
          'properti_id' : this.state.properti_id,
        }
      }).then((res) => {
        this.setState({
          data        : res.data,
          data_kamar  : res.data.data_kamar,
          data_gambar : res.data.data_gambar,
          follow      : res.message,
          isRefresh   : false,
          isLoading   : false,
          isProcess   : false
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
          center : this.state.data.nama_properti,
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
          {
            (!this.state.isLoading && this.state.data.created_by == this.props.state.user.user_id && this.props.state.user.role == '1' && this.props.state.user.isLogin) &&
            <BottomNavigation appearance="noIndicator">
              <View style={styles.containerBottomKosKiri}>
                <Button status='danger' onPress={this._hapus} style={styles.btnCheckin} accessoryLeft={(style) => <Icon {...style } name="trash-2-outline"/>}>Hapus</Button>
              </View>
              <View style={styles.containerBottomKosKanan}>
                <Button onPress={this._edit} style={styles.btnCheckin} accessoryLeft={(style) => <Icon {...style } name="edit-2-outline"/>}>Edit</Button>
              </View>
            </BottomNavigation>
          }
          {
            (!this.state.isLoading && this.props.state.user.role == '2' && !this.state.data.isActive && this.props.state.user.isLogin) &&
            <BottomNavigation appearance="noIndicator">
              <View style={styles.containerBottomBtn}>
                <Button onPress={this._checkIn} style={styles.btnCheckin} accessoryLeft={(style) => <Icon {...style } name="log-in-outline"/>}>Booking</Button>
              </View>
            </BottomNavigation>
          }
          {
            // (this.state.data?.sewa?.status_sewa == '3') &&
            // <BottomNavigation appearance="noIndicator">
            //   <View style={styles.containerBottomBtn}>
            //     <Button status="danger" onPress={this._konfirmasi} style={styles.btnCheckin} accessoryLeft={(style) => <Icon {...style } name="log-out-outline"/>}>Check Out</Button>
            //   </View>
            // </BottomNavigation>
          }
        </Layout>
        <Calert visible={this.state.isAlert} params={this.state.paramsAlert}/>
      </Container>
    )
  }

  _renderContainer = () => {
    return (
      <>
        {
          (this.state.data_gambar.length > 1) ?
          <Carousel autoplay={false} loop index={0} pageSize={BannerWidth} pageIndicatorContainerStyle={styles.pageIndicator} activePageIndicatorStyle={styles.indicatorActive}>
            {this.state.data_gambar.map((image, index) => this.renderPage(image, index))}
          </Carousel>
          :
          this.state.data_gambar.map((image, index) => this.renderPage(image, index))
        }

        <View style={[styles.containerHome, styles.containerInner]}>
            {/* <View style={{flexDirection: 'row', justifyContent: 'space-between'}}> */}
            {
              // (this.props.state.user.isLogin && this.props.state.user.role == '2') &&
              // <TouchableOpacity style={styles.containerRatingFix} onPress={() => this._add_favorite()}>
              //   <Icon style={[styles.iconStar, styles.iconStarMargin]} name="heart"/>
              //   <Text category="c2" style={[layout.bold, styles.sumRating]}>{this.state.follow}</Text>
              // </TouchableOpacity>
            }
            {
              // (this.state.data.bintang > 0) &&
              // <View style={styles.containerRatingFix}>
              //   <Icon style={[styles.iconStar, styles.iconStarMargin]} name="star"/>
              //   <Text category="c2" style={[layout.bold, styles.sumRating]}>{this.state.data.bintang}</Text>
              // </View>
            }
            {/* </View> */}
          {
          // <View style={{marginVertical: 12}}>
          //   <Text category="h6" style={layout.bold}>{this.state.data.nama_properti}</Text>
          // </View>
          }
          {
            // <View style={{marginBottom : 16}}>
            //   <Text>Reference site about Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator.</Text>
            // </View>
          }

          {/* <View style={{justifyContent: 'space-between', flexDirection: 'row'}}> */}
            {
              // <View style={styles.containerHeaderTop}>
              //   <View style={styles.containerHeader2}>
              //     <Icon style={styles.iconRekomen} name="person-done-outline"/>
              //     <Text category="h6" style={[layout.bold, styles.listHeader]}>Pemilik</Text>
              //   </View>
              // </View>
            }
            {
              // (this.props.state.user.role == '2') &&
              // <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => this._add_favorite()}>
              //   <Icon style={[styles.iconStar, styles.iconStarMargin]} name="heart"/>
              //   <Text category="c2" style={[layout.bold]}>{this.state.follow}</Text>
              // </TouchableOpacity>
            }
          {/* </View> */}

          {/* <View style={{marginBottom: 16, flexDirection: 'row'}}> */}
            {
              // (this.state.data?.gambar_profile) ?
              // (
              //   <Image style={styles.iconAvatarProfileImg} source={{uri : this.state.data.gambar_profile}} />
              // ) : (
              //   <View style={{borderRadius : 60, height : 60, width : 60, borderWidth : 1, borderColor : '#d0d0d0', justifyContent : 'center', alignItems : 'center'}}>
              //     <Icon style={[styles.iconAvatarProfileImg, { color : '#e1e1e1', height : 40, width : 40 }]} name="person"/>
              //   </View>
              // )
            }
            {
              // <View style={{marginLeft: 10, paddingVertical: 4, justifyContent: 'space-between'}}>
              //   <View style={{marginLeft: 2}}>
              //     <Text style={layout.semiBold} category="p2">{this.state.data.nama}</Text>
              //     <Text category="c2" appearance='hint'>{this.state.data.created_on_f}</Text>
              //   </View>
              //   <View style={{flexDirection: 'row'}}>
              //     <Icon style={styles.iconProfile} name="pin-outline" />
              //     <Text category="c2" appearance='hint'>{this.state.data.alamat}</Text>
              //   </View> 
              // </View>
            }
          {/* </View> */}
          <View style={styles.containerHeaderTop}>
            <View style={styles.containerHeader2}>
              <Icon style={styles.iconRekomen} name="layout-outline"/>
              <Text category="h6" style={[layout.bold, styles.listHeader]}>Tipe Kamar</Text>
            </View>
          </View>
          {this._onTipeKamar()}
          {
            (this.state.tipe_kamar_id) ?
              <View>
                <View style={styles.containerHeaderTop}>
                  <View style={styles.containerHeader2}>
                    <Icon style={styles.iconRekomen} name="layout-outline"/>
                    <Text category="h6" style={[layout.bold, styles.listHeader]}>List Kamar</Text>
                  </View>
                </View>
                <FlatList
                  data={this.state.data_kamar}
                  horizontal={true}
                  renderItem={this._renderKamar}
                />
              </View>
              : null
          }
          
          <View style={styles.containerHeaderTop}>
            <View style={styles.containerHeader2}>
              <Icon style={styles.iconRekomen} name="info-outline"/>
              <Text category="h6" style={[layout.bold, styles.listHeader]}>Info</Text>
            </View>
          </View>

          <View style={{marginBottom : 16}}>

          {
            (this.state.detail_kamar?.status_f && this.state.detail_kamar?.status == '0') &&
            <View style={styles.pb8}>
              <View style={styles.containerInfo}>
                <View style={styles.containerInfoIcon}>
                  <Icon style={styles.iconInfo} name="archive-outline" />
                </View>
                <View>
                  <Text category="c2" appearance="hint">{'Status Kamar'}</Text>
                  <View style={styles.containerInfoketer}>
                    <Text style={layout.semiBold} category="p2">{this.state.detail_kamar?.status_f}</Text>
                    {/* <Text style={layout.semiBold} category="p2">{'Kamar '+this.state.detail_kamar?.nomor_kamar+' '+this.state.detail_kamar?.status_f}</Text> */}
                  </View>
                </View>
              </View>
            </View>
          }

          <View style={styles.pb8}>
            <View style={styles.containerInfo}>
              <View style={styles.containerInfoIcon}>
                <Icon style={styles.iconInfo} name="briefcase-outline" />
              </View>
              <View>
                <Text category="c2" appearance="hint">{t('dKetersediaan')}</Text>
                {
                  (this.state.detail_kamar?.harga_f) ?
                  (
                    <View style={styles.containerInfoketer}>
                      <Text style={layout.semiBold} category="p2">{(this.state.detail_kamar.isSewa) ? 'Disewa' : 'Kosong'}</Text>
                      {
                        (!this.state.detail_kamar.isSewa) &&
                        <Text category="c2" appearance="hint" style={layout.regular}>{'/Max 2 Orang'}</Text>
                      }
                    </View>
                  )
                  :
                  (
                    <View style={styles.containerInfoketer}>
                      {
                        (this.state.data.jumlah_kamar != '0') &&
                        <Text style={layout.semiBold} category="p2">{this.state.data.jumlah_kamar}</Text>
                      }
                      <Text category="c2" appearance="hint" style={layout.regular}>{(this.state.data.jumlah_kamar != '0') ? ' Kamar' : t('dKamarKosong')}</Text>
                    </View>
                  )
                }
              </View>
            </View>
          </View>

          {
            (this.state.detail_kamar?.tipe_kamar) &&
            <View style={styles.pb8}>
              <View style={styles.containerInfo}>
                <View style={styles.containerInfoIcon}>
                  <Icon style={styles.iconInfo} name="award-outline" />
                </View>
                <View>
                  <Text category="c2" appearance="hint">{'Tipe Kamar'}</Text>
                  <Text style={layout.semiBold} category="p2">{this.state.detail_kamar?.tipe_kamar}</Text>
                </View>
              </View>
            </View>
          }
            <View style={styles.pb8}>
              <View style={styles.containerInfo}>
                <View style={styles.containerInfoIcon}>
                  <Icon style={styles.iconInfo} name="pricetags-outline" />
                </View>
                <View>
                  <Text category="c2" appearance="hint">{t('dHargaSewa')}</Text>
                  <View style={styles.containerInfoketer}>
                  {
                    (this.state.detail_kamar?.harga_f) ?
                    <Text style={layout.semiBold} category="p2">{t('dHarga', {harga : this.state.detail_kamar.harga_f})}</Text>
                    :
                    <Text style={layout.semiBold} category="p2">{(this.state.data.harga_min < this.state.data.harga_max) ? t('dHargaMin', {hargaMin : this.state.data.harga_min_f, hargaMax : this.state.data.harga_max_f}) : t('dHarga', {harga : this.state.data.harga_f})}</Text>
                  }
                    <Text category="c2" appearance="hint">{t('dBulan')}</Text>
                  </View>
                </View>
              </View>
            </View>

            {
              (this.state.data?.harga_parkir_mobil) &&
              <View style={styles.pb8}>
                <View style={styles.containerInfo}>
                  <View style={styles.containerInfoIcon}>
                    <Icon style={styles.iconInfo} name="car-outline" />
                  </View>
                  <View>
                    <Text category="c2" appearance="hint">{'Harga Parkir Mobil'}</Text>
                    <View style={styles.containerInfoketer}>
                      <Text style={layout.semiBold} category="p2">{t('dHarga', {harga : this.state.data?.harga_parkir_mobil_f})}</Text>
                      <Text category="c2" appearance="hint">{t('dBulan')}</Text>
                    </View>
                  </View>
                </View>
              </View>
            }

            {
              (this.state.data?.harga_parkir_motor) &&
              <View style={styles.pb8}>
                <View style={styles.containerInfo}>
                  <View style={styles.containerInfoIcon}>
                    <Icon style={styles.iconInfo} name="pantone-outline" />
                  </View>
                  <View>
                    <Text category="c2" appearance="hint">{'Harga Parkir Motor'}</Text>
                    <View style={styles.containerInfoketer}>
                      <Text style={layout.semiBold} category="p2">{t('dHarga', {harga : this.state.data?.harga_parkir_motor_f})}</Text>
                      <Text category="c2" appearance="hint">{t('dBulan')}</Text>
                    </View>
                  </View>
                </View>
              </View>
            }

            {
              <View style={styles.pb8}>
                <View style={styles.containerInfo}>
                  <View style={styles.containerInfoIcon}>
                    <Icon style={styles.iconInfo} name="tv-outline" />
                  </View>
                  <View>
                    <Text category="c2" appearance="hint">{'Fasilitas Umum'}</Text>
                    <View style={styles.containerInfoketer}>
                        {this._renderFasilitasUmum()}
                    </View>
                  </View>
                </View>
              </View>
            }

            {/* <View style={styles.pb8}>
              <View style={styles.containerInfo}>
                <View style={styles.containerInfoIcon}>
                  <Icon style={styles.iconInfo} name="map-outline" />
                </View>
                <View>
                  <Text category="c2" appearance="hint">{t('dAlamat')}</Text>
                  <View style={styles.containerInfoketer}>
                    <Text style={layout.semiBold} category="p2">{this.state.data.alamat}</Text>
                  </View>
                </View>
              </View>
            </View> */}

            {
              (this.state.detail_kamar.isSewa) &&
              <View style={styles.pb8}>
                <View style={styles.containerInfo}>
                  <View style={styles.containerInfoIcon}>
                    <Icon style={styles.iconInfo} name="trash-outline" />
                  </View>
                  <View>
                    <Text category="c2" appearance="hint">{'Info Check In'}</Text>
                      <View style={styles.containerInfoketer}>
                        <Text style={layout.semiBold} category="p2">{this.state.detail_kamar.checkin+'/'+this.state.detail_kamar.checkout}</Text>
                      </View>
                  </View>
                </View>
              </View>
            }

            {
              (this.state.detail_kamar.isSewa) &&
              <View style={styles.pb8}>
                <View style={styles.containerInfo}>
                  <View style={styles.containerInfoIcon}>
                    <Icon style={styles.iconInfo} name="trash-outline" />
                  </View>
                  <View>
                    <Text category="c2" appearance="hint">{'Priode'}</Text>
                      <View style={styles.containerInfoketer}>
                        <Text style={layout.semiBold} category="p2">{this.state.detail_kamar.priode}</Text>
                      </View>
                  </View>
                </View>
              </View>
            }

            {
              // (this.state.detail_kamar.harga_f) &&
              // <View style={styles.pb8}>
              //   <View style={styles.containerInfo}>
              //     <View style={styles.containerInfoIcon}>
              //       <Icon style={styles.iconInfo} name="trash-outline" />
              //     </View>
              //     <View>
              //       <Text category="c2" appearance="hint">{'Dibersihkan'}</Text>
              //         <View style={styles.containerInfoketer}>
              //           <Text style={layout.semiBold} category="p2">{(this.state.detail_kamar.waktu_bersih) ? this.state.detail_kamar.waktu_bersih : '-'}</Text>
              //         </View>
              //     </View>
              //   </View>
              // </View>
            }

            {
              // (this.state.detail_kamar.harga_f) &&
              // <View style={styles.pb8}>
              //   <View style={styles.containerInfo}>
              //     <View style={styles.containerInfoIcon}>
              //       <Icon style={styles.iconInfo} name="calendar-outline" />
              //     </View>
              //     <View>
              //       <Text category="c2" appearance="hint">{'Ganti Sprei'}</Text>
              //         <View style={styles.containerInfoketer}>
              //           <Text style={layout.semiBold} category="p2">{(this.state.detail_kamar.ganti_sprei) ? this.state.detail_kamar.ganti_sprei : '-'}</Text>
              //         </View>
              //     </View>
              //   </View>
              // </View>
            }

            {
              (this.state.detail_kamar.harga_f) &&
              <View style={styles.pb8}>
                <View style={styles.containerInfo}>
                  <View style={styles.containerInfoIcon}>
                    <Icon style={styles.iconInfo} name="log-out-outline" />
                  </View>
                  <View>
                    <Text category="c2" appearance="hint">{'Terakhir Check Out'}</Text>
                      <View style={styles.containerInfoketer}>
                        <Text style={layout.semiBold} category="p2">{this.state.detail_kamar?.check_out}</Text>
                      </View>
                  </View>
                </View>
              </View>
            }

          </View>

          {
            (this.state.data?.ulasan?.length > 0) &&
            <>
              <View style={styles.containerHeaderTop}>
                <View style={styles.containerHeader2}>
                  <Icon style={styles.iconRekomen} name="message-circle-outline"/>
                  <Text category="h6" style={[layout.bold, styles.listHeader]}>{t('dUlasan')}</Text>
                </View>
                <Text category="p2" style={layout.bold} status="primary">{t('dMore')}</Text>
              </View>
              <View style={{marginBottom : 16}}>
                <FlatList
                  data={this.state.data.ulasan}
                  refreshControl={
                     <RefreshControl refreshing={this.state.isRefresh} onRefresh={this._onRefresh} />
                  }
                  renderItem={this._renderItemUlasan}
                />
              </View>
            </>
          }
          {
            // (this.state.data?.menarik?.length > 0) &&
            // <>
            //   <View style={styles.containerHeaderTop}>
            //     <View style={styles.containerHeader2}>
            //       <Icon style={styles.iconRekomen} name="compass-outline"/>
            //       <Text category="h6" style={[layout.bold, styles.listHeader]}>Koszy Menarik</Text>
            //     </View>
            //     <Text category="p2" style={layout.bold} status="primary">More...</Text>
            //   </View>
            //   <FlatList
            //     data={this.state.data.menarik}
            //     renderItem={this._renderItemProperti}
            //   />
            // </>
          }
        </View>
      </>
    )
  }

  renderPage(image, index) {
    return (
      <View key={index}>
        <Image style={{ width: BannerWidth, height: BannerHeight, borderRadius : 0 }} source={{ uri: image.gambar_link }} />
      </View>
    );
  }
  
  _onTipeKamar = () => {
    return (
      <FlatList
        data={this.state.data.data_tipe_kamar}
        horizontal={true}
        renderItem={this._renderDataTipeKamar}
      />
    )
  }
  
  
  _renderFasilitasUmum = () => {
    return (
      <View style={{width:'90%'}}>
        <Text category='c2'>{this.state.data.fasilitas_string}</Text>
      </View>
    )
  }

  _renderDataTipeKamar = ({item, index}) => {
    return (
      <View style={[styles.listTipeKamar, (item.tipe_kamar_id == this.state.tipe_kamar_id) ? {backgroundColor: '#60B8D6'} : {backgroundColor: '#eef4f9'}]}>
        <Text style={{}} category='c2'>{item.tipe_kamar}</Text>
      </View>
    )
  }

  _renderKamar = ({item, index}) => {
    return (
      <TouchableOpacity style={{marginRight: 9, marginBottom: 16}}>
        <Image style={styles.imgKamar} source={{ uri: item.gambar_link }} />
        <Text style={[styles.containerListKamar, styles.sumRating]} category='c2'>{'Kamar '+item.nomor_kamar}</Text>
      </TouchableOpacity>
    )
  }

  _renderItemUlasan = ({item, index}) => {
    return (
      <ListItem
        accessoryLeft={(style) => <Avatar style={[style.style, styles.avatarComment]} source={{uri : item.gambar_link}}/>}
        title={item.user.nama}
        description={item.komentar}
        accessoryRight={() => (
          <View style={styles.containerRatingFix}>
            <Icon style={[styles.iconStar, styles.iconStarMargin]} name="star"/>
            <Text category="c2" style={[layout.bold, styles.sumRating]}>{item.bintang}</Text>
          </View>
        )}
        style={styles.listComment}
      />
    )
  }

  _renderItemProperti = ({item, index}) => {
    return (
      <View style={styles.pb16}>
        <TouchableOpacity activeOpacity={0.9} onPress={() => this._detail(item)} tyle={styles.containerList}>
          <View style={styles.containerInnerList}>
              <>
                <Image style={styles.listItemImg} source={{uri : item.gambar_link}}/>
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
                <Text numberOfLines={1} category="s2" appearance="hint" style={layout.bold}>{t('dHargaBulan', {harga : item.harga_f})}</Text>
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

  _detail = (item) => {
    this.setState({properti_id : item.properti_id}, () => {
      this._getData();
    })
  }

  _hapus = () => {
    this.setState({isProcess : true}, () => {
      request({
        'model'     : 'Properti_model',
        'key'       : 'delete_properti',
        'table'     : '-',
        'where'     : {
          'properti_id' : this.state.properti_id,
          'created_by'  : this.props.state.user.user_id
        }
      }).then((res) => {
        this.props.params.action();
      }).catch((error) => {
        this.setState({isLoading : false, isRefresh : false, isProcess : false});
      });
    })
  }

  _selectTipeKamar = (item) => {
    this.setState({isProcess : true}, () => {
      request({
        'model'     : 'Properti_model',
        'key'       : 'selectTipeKamar',
        'table'     : '-',
        'where'     : {
          'tipe_kamar_id' : item.tipe_kamar_id,
          'created_by'    : item.user_id,
        }
      }).then((res) => {
        this.setState({
          data_kamar    : res.data,
          tipe_kamar_id : item.tipe_kamar_id,
          isRefresh     : false,
          isLoading     : false,
          isProcess     : false
        });
      }).catch((error) => {
        this.setState({isLoading : false, isRefresh : false, isProcess : false});
      });
    })
  }

  _detailKamar = (item) => {
    this.setState({isProcess : true}, () => {
      request({
        'model'     : 'Properti_model',
        'key'       : 'detail_kamar',
        'table'     : '-',
        'where'     : {
          'kamar_id' : item.kamar_id,
        }
      }).then((res) => {
        this.setState({
          detail_kamar : res.data,
          data_gambar  : res.data.data_gambar,
          isRefresh    : false,
          isLoading    : false,
          isProcess    : false
        });
      }).catch((error) => {
        this.setState({isLoading : false, isRefresh : false, isProcess : false});
      });
    })
  }

  _add_favorite = () => {
    this.setState({isProcess : true}, () => {
      request({
        'model'     : 'Home_model',
        'key'       : 'add_favorite',
        'table'     : '-',
        'where'     : {
          'properti_id' : this.state.data.properti_id,
          'created_by'  : this.props.state.user.user_id,
        }
      }).then((res) => {
        this.setState({
          follow    : res.message,
          isRefresh : false,
          isLoading : false,
          isProcess : false
        });
      }).catch((error) => {
        this.setState({isLoading : false, isRefresh : false, isProcess : false});
      });
    })
  }

  _edit = () => {
    this.props.navigation.push('GoTo', {
      page : 'TambahProperti',
      params : {
        data   : this.state.data,
        action : this._onAction
      }
    });
  }

  _checkIn = () => {
    this.setState({isProcess : true}, () => {
      request({
        'model'     : 'Sewa_model',
        'key'       : 'preProcess',
        'table'     : '-',
        'data'     : {
          'properti_id' : this.state.data.properti_id,
          'pemilik_id'  : this.state.data.created_by,
          'created_by'  : this.props.state.user.user_id,
        }
      }).then((res) => {
        if (res.success) {
          this.props.navigation.replace('GoTo', {
            page : 'PreSewa',
            params : {
              sewa_id : res.data,
              action  : this._onAction
            }
          });
        } else {
          Toast.show(t('aError', {ercode : '001'}), Toast.SHORT)
        }
      }).catch((error) => {
        this.setState({isLoading : false, isRefresh : false, isProcess : false});
      });
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

  _checkOut = () => {
    this.setState({isProcess : true}, () => {
      request({
        'model'     : 'Sewa_model',
        'key'       : 'checkOut',
        'table'     : '-',
        'where'     : {
          'properti_id' : this.state.data.properti_id,
          'pemilik_id'  : this.state.data.created_by,
          'created_by'  : this.props.state.user.user_id,
        }
      }).then((res) => {
        if (res.success) {
          this.props.params.action();
        } else {
          Toast.show(t('aError', {ercode : '001'}), Toast.SHORT)
        }
      }).catch((error) => {
        this.setState({isLoading : false, isRefresh : false, isProcess : false});
      });
    })
  }

  _hideAlert = () => {
    this.setState({isAlert : !this.state.isAlert});
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
export default connect(mapStateToProps, mapDispatchToProps)(KosDetail);
