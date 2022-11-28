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

class Adjustment extends Component {

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
        this.setState({
          menuAct : [
            <Text status='danger'>{t('bClose')}</Text>,
            <ListItem
              title={t('aEdit')}
              descriptionStyle={layout.regular}
              onPress={this._edit}
              accessoryLeft={<Icon style={styles.iconList} name='edit-2-outline'/>}
            />,
            <ListItem
              title={t('aHapus')}
              descriptionStyle={layout.regular}
              onPress={this._hapus}
              accessoryLeft={<Icon style={styles.iconList} name='trash-2-outline'/>}
            />
          ]
        })
        this._getData();
    }
    
    _getData = () => {
        this.setState({isProcess : true}, () => {
          request({
            'model'     : 'all_model',
            'key'       : 'get_adjustment',
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
              center : t('pAdjustment'),
              isBack : true,
              right  : (this.props.state.user.role == '1') ? this._right : null
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
          page : 'TambahAdjustment',
          params : {
            edit   : false,
            action : this._onRefresh
          }
        });
    }
    
    _renderItem = ({item, index}) => {
        return (
          <TouchableOpacity style={styles.containerInner} onPress={() => (this.props.state.user.role == '1') ? this._edit(item) : null}>
            <View style={styles.containerHeader}>
              <View>
                <View style={{marginBottom: 16}}>
                  <Text style={layout.bold}>{((item.is_min == '1') ? '- ': '')+item.total_f}</Text>
                  <Text style={layout.bold}>{item.kategori?.kategori_pemasukan}</Text>
                  <Text style={{}} numberOfLines={2}>{item.keterangan+'\nTanggal : '+item.tanggal_f}</Text>
                </View>
                <Text style={{}} numberOfLines={2} appearance="hint" category="c2">{item.created_on_f}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )
    }
    
    _edit = (item) => {
        this.props.navigation.push('GoTo', {
          page : 'TambahAdjustment',
          params : {
            edit   : true,
            data   : item,
            action : this._onRefresh
          }
        });
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
export default connect(mapStateToProps, mapDispatchToProps)(Adjustment);
