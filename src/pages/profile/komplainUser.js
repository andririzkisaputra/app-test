import React, { Component } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { Container, Header, ListItem, Empty } from '../../theme';
import { Layout, Text, Button, Spinner, Icon } from '@ui-kitten/components';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet';
import { connect } from 'react-redux';
import { request } from '../../bridge';
import { setReload } from '../../root/redux/actions';
import ActionButton from 'react-native-action-button';
import styles from '../../theme/styles/styles';
import layout from '../../theme/styles/layout';
import t from '../../lang';

const IconAll = (name) => {
  return (
    <Icon style={{width: 35, color: '#8F9BB3'}} name={name.name} />
  )
}

class KomplainUser extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isRefresh   : false,
      data        : [],
      menuAct     : []
    }

    this.navigation = this.props.route.navigation;
    this.focus      = false;
  }

  componentDidMount = () => {
    this._getData();

    this.focus = this.navigation.addListener('focus', () => {
      if (this.props.state.reload.komplain) {
        this._onRefresh();
        this.props.setReload({key : 'komplain', value : false});
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
    this.setState({isLoading : true}, () => {
      request({
        'model'     : 'all_model',
        'key'       : 'get_komplain',
        'table'     : '-',
        'where'     : {
          'user_id' : this.props.state.user.user_id
        },
        'data'      : {
          'role' : this.props.state.user.role
        }
      }).then((res) => {
        if (res.success) {
          this.setState({
            data      : res.data,
            menuAct   : [
              <Text status='danger'>{t('bClose')}</Text>,
              <ListItem
                title={t('aEdit')}
                descriptionStyle={layout.regular}
                onPress={this._edit}
                accessoryLeft={<IconAll name='edit-2-outline'/>}
              />,
              <ListItem
                title={t('aHapus')}
                descriptionStyle={layout.regular}
                onPress={this._hapus}
                accessoryLeft={<IconAll name='trash-2-outline'/>}
              />
            ],
            isRefresh : false,
            isProcess : false
          });
        }
        this.setState({isLoading : false, isRefresh : false});
      }).catch((error) => {
        this.setState({isLoading : false, isRefresh : false});
      });
    })
  }

  render() {
    return (
      <>
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
                refreshControl={
                   <RefreshControl refreshing={this.state.isRefresh} onRefresh={this._onRefresh} />
                }
                renderItem={this._renderItem}
                contentContainerStyle={(this.state.data?.length > 0) ? null : layout.container}
                ListEmptyComponent={<Empty />}
              />
            )
          }

          <ActionSheet
            ref={o => this.menuSheet = o}
            title={<View style={layout.actionSheetHeader}></View>}
            options={this.state.menuAct}
            styles={layout.actionSheet}
            cancelButtonIndex={0}
          />
        </Layout>

        { (this.props.state.user.role == '2') && <ActionButton onPress={this._proses} buttonColor={layout.btnFloating}/>}
      </>
    )
  }

  _renderItem = ({item, index}) => {
    return(
      <ListItem
        title={(this.props.state.user.role == '1' ? item.nama+'\n' : item.nama_properti+'\n')+item.keterangan}
        description={'Tanggapan : '+(item.tanggapan || '-')+'\nLantai '+item.lantai+', No. '+item.nomor_kamar+' • '+item.created_on_f}
        onPress={() => this._more(item)}
      />
    );
  }

  _more = (data) => {
    this.setState({
      komplain_id   : data.komplain_id,
      properti_id   : data.properti_id,
      keterangan    : data.keterangan,
      sewa_id       : data.sewa_id,
      nama_properti : data.nama_properti,
      tanggapan     : data.tanggapan,
      created_by    : data.cby,
    }, () => {
      if (this.props.state.user.role != '2') {
        this._edit();
        this.menuSheet.show();
      } else {
        this.menuSheet.show();
      }
    })
  }

  _edit = () => {
    this.navigation.push('GoTo', {
      page : 'KomplainUserProses',
      params : {
        isEdit        : true,
        komplain_id   : this.state.komplain_id,
        properti_id   : this.state.properti_id,
        keterangan    : this.state.keterangan,
        sewa_id       : this.state.sewa_id,
        nama_properti : this.state.nama_properti,
        tanggapan     : this.state.tanggapan,
        created_by    : this.state.created_by,
        action        : this._onRefresh
      }
    });

    this.setState({
      komplain_id   : '',
      keterangan    : '',
      sewa_id       : '',
      nama_properti : '',
    }, () => {
      this.menuSheet.hide();
    })
  }

  _hapus = () => {

  }

  _onRefresh = () => {
    this.setState({
      isRefresh  : true
    }, () => {
      this._getData();
    });
  }

  _right = () => (
    <Button size="tiny" onPress={this._proses}>Buat Komplain</Button>
  )

  _proses = () => {
    this.navigation.push('GoTo', {
      page : 'KomplainUserProses',
      params : {
        isEdit      : false,
        action      : this._onRefresh
      }
    });
  }

}

const mapStateToProps = state => ({state: state});
const mapDispatchToProps = dispatch => ({
  setReload: (data) => dispatch(setReload(data))
});
export default connect(mapStateToProps, mapDispatchToProps)(KomplainUser);
