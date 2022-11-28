import React, { Component } from 'react';
import { View, RefreshControl, FlatList, TouchableOpacity } from 'react-native';
import { Layout, Icon, Text, List, Spinner, Avatar } from '@ui-kitten/components';
import { Container, Header, Process, Calert, Empty, ListItem } from '../../theme';
import { DEFAULT_PAGE, DEFAULT_PERPAGE } from '../../config';
import { connect } from 'react-redux';
import t from '../../lang';
import layout from '../../theme/styles/layout';
import styles from '../../theme/styles/styles';
import { setReload } from '../../root/redux/actions';
import { request } from '../../bridge';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet';
import { CommonActions } from '@react-navigation/native';

const IconAll = (name) => {
  return (
    <Icon style={{width: 35, color: '#8F9BB3'}} name={name.name} />
  )
}

class Notifikasi extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data        : [],
      menuAct     : [],
      isAlert     : false,
      paramsAlert : [],
      isRefresh   : false,
      isLoading   : true,
      isLoadMore  : true,
      totaldata   : 0
    }
  }

  componentDidMount = () => {
    this.timerHandle = setTimeout(() => {
      this._getData();
      this.props.setReload({key : 'home', value : true});
    },0);
  }

  componentWillUnmount = () => {
    if (this.timerHandle) {
      clearTimeout(this.timerHandle);
      this.timerHandle = 0;
    }
  }

  _renderFooter = () => {
    if (this.state.isLoadMore) {
      return (<View style={layout.spinner}><Spinner /></View>);
    }

    return null;
  }

  _loadMoreData = () => {
    if (this.state.isLoadMore) {
      this.page = this.page + 1;
      request({
        'model' : 'Notifikasi_Model',
        'key'   : 'find_all_data_limit',
        'page'      : (this.page * DEFAULT_PERPAGE),
        'perpage'   : DEFAULT_PERPAGE,
        'table' : 'notifikasi',
        'where' : {
          'to_id' : this.props.state.user.user_id
        },
      }).then((res) => {
        this.setState(state => ({
          data : [...state.data, ...res.data],
          totaldata : res.totaldata
        }), () => {
          this.setState({isLoadMore : ((this.state.data.length >= this.state.totaldata) ? false : true) });
        });
      }).catch((error) => {
        this.setState({isLoading : false, isRefresh : false});
      });
    }
  }

  _onRefresh = () => {
    this.setState({
      isRefresh  : true,
      valSearch  : ''
    }, () => {
      this._getData();
    });
  }

  _getData = () => {
    this.page = DEFAULT_PAGE;
    request({
      'model'     : 'Notifikasi_Model',
      'key'       : 'find_all_data_limit',
      'page'      : DEFAULT_PAGE,
      'perpage'   : DEFAULT_PERPAGE,
      'table'     : 'notifikasi',
      'where'     : {
        'to_id' : this.props.state.user.user_id
      },
    }).then((res) => {
      this.setState({
        isLoading   : false,
        isRefresh   : false,
        data        : res.data,
        isLoadMore  : (res.totaldata <= DEFAULT_PERPAGE) ? false : true,
        totaldata   : res.totaldata
      });
    }).catch((error) => {
      this.setState({isLoading : false, isRefresh : false, isLoadMore : false});
    });
  }

  render() {
    return (
      <Container>
        <Header navigation={this.props.navigation} params={{
          center : t('pNotif'),
          preHapus : this._preHapus,
          isBack : true
        }}/>
        <Layout style={layout.container}>
          {
            (this.state.isLoading) ?
            (
              <View style={layout.spinner}>
                <Spinner/>
              </View>
            ) :
              (
                <FlatList
                  data={this.state.data}
                  renderItem={this.renderItem}
                  refreshControl={
                     <RefreshControl refreshing={this.state.isRefresh} onRefresh={this._onRefresh} />
                  }
                  contentContainerStyle={(this.state.data?.length > 0) ? null : layout.container}
                  ListEmptyComponent={<Empty />}
                  ListFooterComponent={this._renderFooter}
                  onEndReached={this._loadMoreData}
                  onEndReachedThreshold={0.1}
                />
              )
          }
        </Layout>

        <ActionSheet
          ref={o => this.actionSheet = o}
          title={<View style={layout.actionSheetHeader}></View>}
          options={this.state.menuAct}
          styles={layout.actionSheet}
          cancelButtonIndex={0}
        />
        <Calert visible={this.state.isAlert} params={this.state.paramsAlert}/>
        <Process visible={this.state.isProcess}/>
      </Container>
    )
  }

  renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity style={styles.containerInner} onPress={() => this._detail(item, index)} onLongPress={() => this.detail(item)}>
        <View style={styles.containerHeader}>
          <View>
            <View style={{marginBottom: 16}}>
              <Text style={layout.bold}>{item.judul}</Text>
              <Text>{item.pesan}</Text>
            </View>
            <Text style={{}} numberOfLines={2} appearance="hint" category="c2">{item.created_on}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  detail = (data, index) => {
    let newData   = this.state.data;
    let menu      = [<Text status="danger">{t('bClose')}</Text>];
    menu.push(
      <ListItem
        title={t('bDetail')}
        onPress={() => this._detail(data)}
        icon={() => <View style={layout.iconBg}><Icon style={layout.iconAct} name="document-info"/></View>}
      />,
      <ListItem
        title={t('bDelete')}
        onPress={() => this._preHapus(data)}
        icon={() => <View style={layout.iconBg}><Icon style={layout.iconAct} name="trash"/></View>}
      />
    );
    this.setState({ menuAct : menu}, () => {
      this.actionSheet.show();
    });
    // newData[index].new = '0';
    // this.setState({ data : newData }, () => {
    //   this._detail(data);
    // });
  }

  _detail = (item) => {
    this.actionSheet.hide();
    let params = JSON.parse(item?.params);
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
        const commonActions = CommonActions.navigate({name : 'InfoTab', params : { active : 1 }});
        this.props.navigation.dispatch(commonActions);
      }
    }

    // this.timerHandle = setTimeout(() => {
    //   Notif.update();
    //   request({
    //     'model'    : 'Notifikasi_Model',
    //     'key'      : 'removeNotif',
    //     'table'    : '-',
    //     'where'    : { 'notifikasi_id' : item.notifikasi_id }
    //   }).then((res) => {
    //
    //   });
    // }, 1000);
  }

  _preHapus = () => {
    this.setState({isAlert : true, paramsAlert : {
      title          : t('aTitleInfo'),
      message        : t('aDeleteConfirmAll'),
      negativeLabel  : t('bNo'),
      positiveLabel  : t('bYes'),
      dualButton     : true,
      positiveAction : () => this._hapus(),
      action         : this.hideAlert
    }});
    this.actionSheet.hide();
  }

  _hapus = () => {
    this.setState({isProcess : true});
    request({
      'model'    : 'notifikasi_Model',
      'key'      : 'delete_all',
      'table'    : '-',
      'where'    : {'to_id' : this.props.state.user.user_id}
    }).then((res) => {
      this._getData();
      this.setState({isAlert : true, isProcess : false, paramsAlert : {
        title          : (res.success) ? t('aTitleInfoSuc') : t('aTitleInfoEror'),
        message        : (res.success) ? t('aDeleteSuccess') : t('aDeleteFailed'),
        negativeLabel  : (res.success) ? t('bOkMakasih') : t('bUlang'),
        negativeAction : this._reloadAfterDel,
        action         : this.hideAlert
      }});

      // this.timerHandle = setTimeout(() => {
      //   Notif.update();
      // }, 1000);
    }).catch((error) => {
      Toast.show(t('aError'), Toast.SHORT);
      this.setState({isProcess : false});
    });
  }

  hideAlert = () => {
    this.setState({isAlert : !this.state.isAlert});
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
export default connect(mapStateToProps, mapDispatchToProps)(Notifikasi);
