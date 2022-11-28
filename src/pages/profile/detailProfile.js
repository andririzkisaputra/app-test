import React, { Component } from 'react';
import { View, RefreshControl, ScrollView, Image, Dimensions } from 'react-native';
import { Container, Header } from '../../theme';
import { Layout, Text, Spinner, Icon } from '@ui-kitten/components';
import { connect } from 'react-redux';
import t from '../../lang';
import { request } from '../../bridge';
import layout from '../../theme/styles/layout';
import styles from '../../theme/styles/styles';
import Carousel from 'react-native-banner-carousel';


const BannerWidth = Dimensions.get('window').width;
const BannerHeight = 180;

class DetailProfile extends Component {

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
            'key'       : 'detailProfile',
            'table'     : '-',
            'where'     : {
                'user_id' : this.props.params.user_id,
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
                    center : t('pDetailProfile'),
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
                {
                    (this.state.data.file_upload.length > 1) ?
                    <Carousel autoplay={false} loop index={0} pageSize={BannerWidth} pageIndicatorContainerStyle={styles.pageIndicator} activePageIndicatorStyle={styles.indicatorActive}>
                        {this.state.data.file_upload.map((image, index) => this.renderPage(image, index))}
                    </Carousel>
                    :
                    this.state.data.file_upload.map((image, index) => this.renderPage(image, index))
                }
                <View style={[styles.containerHome, styles.containerInner]}>
                    <View style={{marginBottom: 16, padding: 20, flexDirection: 'row', backgroundColor: '#ededed', borderRadius: 10}}>
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
                    </View>
                </View>
                <View style={[styles.containerInner]}>
                    <View style={{marginBottom: 16, padding: 20, backgroundColor: '#ededed', borderRadius: 10}}>
                        <View style={{marginVertical: 5, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text style={layout.semiBold} category="p1">Umur</Text>
                            <Text category="p1">{this.state.data.umur+' Tahun'}</Text>
                        </View>
                        <View style={{marginVertical: 5, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text style={layout.semiBold} category="p1">Email</Text>
                            <Text category="p1">{this.state.data.email}</Text>
                        </View>
                        <View style={{marginVertical: 5, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text style={layout.semiBold} category="p1">No HP</Text>
                            <Text category="p1">{this.state.data.notelp}</Text>
                        </View>
                        <View style={{marginVertical: 5, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text style={layout.semiBold} category="p1">Pekerjaan</Text>
                            <Text category="p1">{this.state.data.pekerjaan}</Text>
                        </View>
                    </View>
                </View>
                <View style={[styles.containerInner]}>
                    <View style={{marginBottom: 16, padding: 20, backgroundColor: '#ededed', borderRadius: 10}}>
                        <View style={{marginVertical: 5, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text style={layout.semiBold} category="p1">Kontak Darurat 1</Text>
                            <Text category="p1">{this.state.data.nama_darurat_satu}</Text>
                        </View>
                        <View style={{marginVertical: 5, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text style={layout.semiBold} category="p1">No HP</Text>
                            <Text category="p1">{this.state.data.notelp_darurat_satu}</Text>
                        </View>
                        <View style={{marginVertical: 5, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text style={layout.semiBold} category="p1">Kontak Darurat 2</Text>
                            <Text category="p1">{this.state.data.nama_darurat_dua}</Text>
                        </View>
                        <View style={{marginVertical: 5, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text style={layout.semiBold} category="p1">No HP</Text>
                            <Text category="p1">{this.state.data.notelp_darurat_dua}</Text>
                        </View>
                    </View>
                </View>
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

}

const mapStateToProps = state => ({state: state});
const mapDispatchToProps = dispatch => ({

});
export default connect(mapStateToProps, mapDispatchToProps)(DetailProfile);
