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
import { setReload } from '../../root/redux/actions';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet';
import ActionButton from 'react-native-action-button';

class Inform extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading     : true,
      kamar         : '',
      data          : [],
      menuAct       : [],
    }

    this.navigation = this.props.route.navigation;
    this.focus      = false;
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

    this.focus = this.navigation.addListener('focus', () => {
      if (this.props.state.reload.inform) {
        this._onRefresh();
        this.props.setReload({key : 'inform', value : false});
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
        'model'     : 'Info_model',
        'key'       : 'info',
        'table'     : '-',
        'where'     : {
          'user_id' : this.props.state.user.user_id,
          'role'    : this.props.state.user.role
        },
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
      <>
        <Layout style={[layout.container, {paddingTop : 14}]}>
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
                contentContainerStyle={(this.state.data?.length > 0) ? null : layout.container}
                ListEmptyComponent={<Empty />}
                refreshControl={
                   <RefreshControl refreshing={this.state.isRefresh} onRefresh={this._onRefresh} />
                }
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
        { (this.props.state.user.role != '2') && <ActionButton onPress={this._tambah} buttonColor={layout.btnFloating}/>}
      </>
    )
  }

  _tambah = () => {
    this.navigation.push('GoTo', {
      page : 'TambahInfo',
      params : {
        action : this._onAction
      }
    });
  }

  _onAction = (params, hapus_kamar) => {
    this.navigation.pop();
    this._getData();
  }

  _renderItem = ({item, index}) => {
    return (
      <TouchableOpacity style={styles.containerInner} activeOpacity={0.9} onPress={() => (this.props.state.user.role == '2') ? this._onDetail(item, index) : this._renderMenu(item, index)}>
        <View style={styles.containerHeader}>
          <View>
            <View style={{marginBottom: 16}}>
              <Text style={layout.bold}>{item.judul}</Text>
              <Text style={{}} numberOfLines={2}>{item.isi}</Text>
            </View>
            <Text style={{}} numberOfLines={2} appearance="hint" category="c2">{item.created_on_f}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  _renderMenu = (item, index) => {
    this.setState({ edit : item })
    this.menuSheet.show();
  }

  _onDetail = (item, index) => {
    this.navigation.push('GoTo', {
      page : 'DetailInfo',
      params : {
        data : item
      }
    });
  }

  _edit = () => {
    this.menuSheet.hide();
    this.navigation.push('GoTo', {
      page : 'TambahInfo',
      params : {
        edit   : this.state.edit,
        action : this._onAction
      }
    });
  }

  _hapus = () => {
    this.menuSheet.hide();
    this.setState({isProcess : true}, () => {
      request({
        'model'     : 'Info_model',
        'key'       : 'deleteInfo',
        'table'     : '-',
        'where'     : {
          'info_id' : this.state.edit.info_id,
        }
      }).then((res) => {
        this._onRefresh();
      }).catch((error) => {
        this.setState({isLoading : false, isRefresh : false, isProcess : false});
      });
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
  setReload: (data) => dispatch(setReload(data))
});
export default connect(mapStateToProps, mapDispatchToProps)(Inform);
