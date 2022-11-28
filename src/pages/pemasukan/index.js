import React, { Component } from 'react';
import { View, RefreshControl, ScrollView, FlatList, TouchableOpacity, Image } from 'react-native';
import { Container, Header, ListItem, Empty } from '../../theme';
import { Layout, Text, Spinner, Icon, Button } from '@ui-kitten/components';
import { connect } from 'react-redux';
import t from '../../lang';
import { request } from '../../bridge';
import { formatDate } from '../../func';
import layout from '../../theme/styles/layout';
import styles from '../../theme/styles/styles';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet';

class Pemasukan extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading     : true,
      edit          : false,
      kamar         : '',
      data          : [],
      menuAct       : [],
    }
  }

  componentDidMount = () => {
    this._getData();
  }

  _getData = () => {
    this.setState({isProcess : true}, () => {
      request({
        'model'     : 'all_model',
        'key'       : 'get_pemasukan',
        'table'     : '-',
        'where'     : {
          'created_by' : this.props.state.user.user_id,
          'role'       : this.props.state.user.role
        }
      }).then((res) => {
        this.setState({
          data          : res.data,
          isRefresh     : false,
          isLoading     : false,
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
          center : t('pPemasukan'),
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
                data={this.state.data}
                renderItem={this._renderItem}
                refreshControl={
                   <RefreshControl refreshing={this.state.isRefresh} onRefresh={this._onRefresh} />
                }
                contentContainerStyle={(this.state.data?.length > 0) ? null : layout.container}
                ListEmptyComponent={<Empty />}
              />
            )
          }
        </Layout>
        <ActionSheet
          ref={o => this.menuSheet = o}
          title={<View style={layout.actionSheetHeader}></View>}
          options={this.state.menuAct}
          styles={layout.actionSheet}
          cancelButtonIndex={0}
        />
      </Container>
    )
  }


  _right = () => (
    <Button size='tiny' onPress={this._tambah}>Tambah</Button>
  )

  _tambah = () => {
    this.props.navigation.push('GoTo', {
      page : 'Laporan',
      params : {
        edit   : false,
        action : this._onRefresh
      }
    });
  }

  _renderItem = ({item, index}) => {
    return (
      <TouchableOpacity style={styles.containerInner} onPress={() => this._detailSewa(item)}>
        <View style={styles.containerHeader}>
          <View>
            {this._renderKategori(item?.kategori)}
            <View style={{marginBottom: 16}}>
              <Text style={{}} numberOfLines={2}>{'Tanggal : '+item?.tanggal_sewa_f}</Text>
            </View>
            <Text style={{}} numberOfLines={2} appearance="hint" category="c2">{item.created_on_f}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  _renderKategori = (kategori) => {
    return kategori?.kategori_pemasukan.map((item, index) => {
      return (
        <View style={{marginBottom: 16}}>
          <Text style={layout.bold}>{kategori?.harga_f[index]}</Text>
          <Text style={layout.bold}>{item}</Text>
        </View>
      )
    })
  }

  _edit = (item) => {
    this.props.navigation.push('GoTo', {
      page : 'TambahPengeluaran',
      params : {
        edit   : true,
        data   : item,
        action : this._onRefresh
      }
    });
  }

  _detailSewa = (item) => {
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
    this.setState({isRefresh : true}, () => {
      this._getData()
    })
  }

}

const mapStateToProps = state => ({state: state});
const mapDispatchToProps = dispatch => ({

});
export default connect(mapStateToProps, mapDispatchToProps)(Pemasukan);
