import React, { Component } from 'react';
import { View, RefreshControl, ScrollView, Image, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import { Container, Header, Empty } from '../../theme';
import { Layout, Text, Spinner, Icon, BottomNavigation, Button } from '@ui-kitten/components';
import { connect } from 'react-redux';
import t from '../../lang';
import { request } from '../../bridge';
import layout from '../../theme/styles/layout';
import styles from '../../theme/styles/styles';


const BannerWidth = Dimensions.get('window').width;
const BannerHeight = 180;

class GantiKamar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isProcess     : false,
            isAlert       : false,
            isOpsiTanggal : false,
            isLoading     : true,
            tanggal_now   : new Date(),
            kamar         : '',
            kamar_id      : '',
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
            'model'     : 'Sewa_model',
            'key'       : 'listKamar',
            'table'     : '-',
            'where'     : {
                'pemilik_id'  : this.props.params?.penyewa?.pemilik_id,
                'properti_id' : this.props.params?.penyewa?.properti_id,
                'kamar_id'    : this.props.params?.penyewa?.kamar_id,
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
                    center : t('pGantiKamar'),
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
                    <BottomNavigation appearance="noIndicator">
                      <Button size='small' style={{marginVertical : 10, marginHorizontal: 10}} onPress={this._gantiKamar} disabled={(this.state.isLoading || !this.state.kamar_id) ? true : false}>{'Ganti'}</Button>
                    </BottomNavigation>
                </Layout>
            </Container>
        )
    }

    _renderContainer = () =>{
        return (
            <Layout>
                <FlatList
                    style={{ marginVertical:10 }}
                    data={this.state.data}
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
    if (item.isActive) {
        return (
            <TouchableOpacity style={{flexDirection: 'row', marginVertical: 5, marginHorizontal:20}} onPress={() => !item.is_active ? this._selectKamar(item) : null}>
                {
                    (item.img_link) ?
                    (
                        <Image
                            style={{width: 80, height: 80, borderRadius: 18}}
                            source={{
                                uri: (item.img_link) ? item.img_link : '',
                            }}
                        />
                    ) :
                    (
                        <View style={styles.containerManagementIcon}>
                            <Icon style={styles.iconAvatarProfile} name="person-outline"/>
                        </View>
                    )
                }
                <View style={{flex: 1, marginHorizontal: 10, marginVertical: 6, justifyContent: 'space-between'}}>
                    <Layout>
                        <Text category="p1" style={layout.semiBold}>{item.nomor_kamar+' - '+item.tipe_kamar}</Text>
                        <Text category="c2" appearance="hint" style={layout.regular}>{t('dLantai', {'lantai' : item.lantai})}</Text>
                    </Layout>
                    <Text category="p2" style={layout.regular}>{item.harga_f}</Text>
                    {
                        (item.is_selected) &&
                        <View style={{position: 'absolute', top: 0, right: 0}}>
                        <Icon style={{color : '#60b8d6'}} name={'checkmark-square-outline'}/>
                        </View>
                    }
                </View>
            </TouchableOpacity>
        )   
    }
  }
  
  _selectKamar = (data) => {
    let select = [];
    this.state.data.map((item, index) => {
      if (item.kamar_id == data.kamar_id) {
        select.push({...item, is_selected : true});
      } else {
        select.push({...item, is_selected : false});
      }
    })
    this.setState({data: select, kamar_id : data.kamar_id});
  }

  _gantiKamar = () => {
      this.setState({isProcess : true}, () => {
        request({
          'model'      : 'Sewa_model',
          'key'        : 'gantiKamar',
          'table'      : '-',
          'where'      : {
            'kamar_id' : this.state.kamar_id,
            'sewa_id'  : this.props.params?.penyewa?.sewa_id
          }
        }).then((res) => {
          if (res.success) {
            this.props.params.action();
          }
        }).catch((error) => {
          this.setState({isLoading : false, isRefresh : false, isProcess : false});
        });
      })
  }

  _simpanManage = () => {
    this.setState({isProcess : true}, () => {
      request({
        'model'     : 'Properti_model',
        'key'       : 'simpanManagementKos',
        'table'     : '-',
        'data'      : {
          'user'        : this.state.data,
          'properti_id' : this.props.params.properti_id,
        }
      }).then((res) => {
        if (res.success) {
          this.props.params.action();
        }
      }).catch((error) => {
        this.setState({isLoading : false, isRefresh : false, isProcess : false});
      });
    })
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
export default connect(mapStateToProps, mapDispatchToProps)(GantiKamar);
