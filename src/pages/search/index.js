import React, { Component } from 'react';
import { View, ScrollView, RefreshControl, Image, TouchableOpacity, FlatList } from 'react-native';
import { Container, Header } from '../../theme';
import { Layout, Text, Spinner, Icon, Calendar, Modal, Input, ListItem } from '@ui-kitten/components';
import { connect } from 'react-redux';
import t from '../../lang';
import { request } from '../../bridge';
import layout from '../../theme/styles/layout';
import styles from '../../theme/styles/styles';
import { DEFAULT_PAGE, DEFAULT_PERPAGE } from '../../config';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet';

class Search extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading     : true,
      isOpsiTanggal : false,
      keyword       : '',
      data          : [],
      sort          : 'properti.created_on DESC',
      menuAct       : [
        <Text status='danger'>{t('bClose')}</Text>,
        <ListItem
          title={t('bTerlaris')}
          descriptionStyle={layout.regular}
          onPress={() => this._sort('kamar.harga ASC')}
        />,
        <ListItem
          title={t('bHargaTerendah')}
          descriptionStyle={layout.regular}
          onPress={() => this._sort('kamar.harga ASC')}
        />,
        <ListItem
          title={t('bHargaTertinggi')}
          descriptionStyle={layout.regular}
          onPress={() => this._sort('kamar.harga DESC')}
        />
      ]
    }
  }

  componentDidMount = () => {
    this._getData()
  }

  _getData = () => {
    this.page = DEFAULT_PAGE;
    this.setState({isProcess : true}, () => {
      request({
        'model'   : 'Search_model',
        'key'     : 'search',
        'table'   : '-',
        'page'    : this.page,
        'perpage' : DEFAULT_PERPAGE,
        'where'          : {
          'sort'           : this.state.sort,
          'keyword'        : this.state.keyword,
          // level          : this.state.level,
          // role           : this.state.role,
          // kategori_id    : this.state.kategori_id,
          // status_account : '1'
        }
      }).then((res) => {
        this.setState({
          data        : res.data,
          isLoadMore  : (res.totaldata <= DEFAULT_PERPAGE) ? false : true,
          totaldata   : res.totaldata,
          isRefresh   : false,
          isLoading   : false,
          isProcess   : false
        });
      }).catch((error) => {
        this.setState({isLoading : false, isRefresh : false, isProcess : false});
      });
    })
  }

  _loadMoreData = () => {
    if (this.state.isLoadMore) {
      this.setState({scroll : false});
      this.page = this.page + 1;
      request({
        'model'   : 'Search_model',
        'key'     : 'search',
        'table'   : '-',
        'page'    : this.page,
        'perpage' : DEFAULT_PERPAGE,
        'where'          : {
          'sort'           : this.state.sort,
          'keyword'        : this.state.keyword,
          // level          : this.state.level,
          // role           : this.state.role,
          // kategori_id    : this.state.kategori_id,
          // status_account : '1'
        }
      }).then((res) => {
        this.setState(state => ({
          data      : [...state.data, ...res.data],
          totaldata : res.totaldata
        }), () => {
          this.setState({isLoadMore : ((this.state.data.length >= this.state.totaldata) ? false : true) });
        });
      }).catch((error) => {
        this.setState({
          isLoadMore : false
        }, () => {
          Toast.show(t('aError', { ercode : '304' }), Toast.LONG);
        })
      });
    }
  }

  render() {
    return (
      <Container>
        <Header navigation={this.props.navigation} params={{
          center      : t('pSearch'),
          keyword     : this.state.keyword,
          changeText  : this._keywordSearch,
          rightSearch : this._right,
          right       : this._filterKos,
          actSearch   : this._search,
          isBack      : true
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
        <ActionSheet
          ref={o => this.menuSheet = o}
          title={<View style={layout.actionSheetHeader}></View>}
          options={this.state.menuAct}
          styles={layout.actionSheet}
          cancelButtonIndex={0}
        />
        </Layout>
      </Container>
    )
  }

  _renderContainer = () => {
    return (
      <FlatList
        style={{marginHorizontal: 20}}
        data={this.state.data}
        ListHeaderComponent={this._renderHeader}
        renderItem={this._renderItemSearch}
        // onEndReached={this._loadMoreData}
      />
    )
  }

  _renderHeader = () => {
    return (
      <Layout>
      </Layout>
    )
  }

  _renderItemSearch = ({item, index}) => {
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

  _filterKos = () => (
    <TouchableOpacity activeOpacity={1} style={[styles.containerIconSearch]} onPress={this._selectKos}>
      <Icon style={styles.iconFilter} name="funnel-outline"/>
      <Text style={[layout.bold, styles.textPrimary]}>Filter</Text>
    </TouchableOpacity>
  )

  _sort = (sort) => {
    this.menuSheet.hide();
    this.setState({
      sort : sort
    }, () => {
      this._getData();
    })
  }

  _selectKos = () => {
    this.menuSheet.show();
  }

  _right = () => {
    if (this.state.keyword) {
      return (
        <TouchableOpacity activeOpacity={1} style={styles.containerIconSearch} onPress={this._removeSearch}>
          <Icon style={styles.iconSearchPage} name='close-outline'/>
        </TouchableOpacity>
      )
    }

    return (
      <TouchableOpacity activeOpacity={1} style={styles.containerIconSearch} onPress={this._search}>
        <Icon style={styles.iconSearchPage} name='search'/>
      </TouchableOpacity>
    )
  }

  _search = () => {
    this._getData();
  }

  _removeSearch = () => {
    this.setState({keyword : ''}, () => {
      this._getData();
    })
  }

  _keywordSearch = (text) => {
    this.setState({keyword : text}, () => {
      this._getData();
    });
  }

  _detail = (item) => {
    this.props.navigation.push('GoTo', {
      page   : 'KosDetail',
      params : {
        properti_id : item.properti_id
      }
    })
  }

}

const mapStateToProps = state => ({state: state});
const mapDispatchToProps = dispatch => ({

});
export default connect(mapStateToProps, mapDispatchToProps)(Search);
