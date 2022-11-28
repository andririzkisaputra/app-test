import React, { Component } from 'react';
import { View, FlatList, ScrollView, Image, RefreshControl, TouchableOpacity } from 'react-native';
import { Container, Header, ListItem, Button } from '../../theme';
import { Layout, Text, Icon, BottomNavigation, Spinner } from '@ui-kitten/components';
import { connect } from 'react-redux';
import t from '../../lang';
import layout from '../../theme/styles/layout';
import styles from '../../theme/styles/styles';
import { request } from '../../bridge';

class TambahManager extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading   : true,
      isProcess   : false,
      isRefresh   : false,
      data        : [],
      user_id     : '',
    }
  }


  componentDidMount = () => {
    this._getData();
  }

  _getData = () => {
    this.setState({isProcess : true}, () => {
      request({
        'model'     : 'Properti_model',
        'key'       : 'managementKos',
        'table'     : '-',
        'where'     : {
          'properti_id' : this.props.params.properti_id
        }
      }).then((res) => {
        this.setState({
          data      : res.data,
          isLoading : false,
          isRefresh : false,
          isProcess : false
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
          center : t('pManagementKos'),
          isBack : true
        }}/>
        <Layout style={layout.container}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={this.state.isLoading ? layout.container : null}
            refreshControl={
               <RefreshControl refreshing={this.state.isRefresh} onRefresh={this._onRefresh} />
            }>
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
          <Button size='small' style={{marginVertical : 10, marginHorizontal: 10}} onPress={this._simpanManage} disabled={(this.state.isLoading || !this.state.user_id) ? true : false}>{t('bSimpan')}</Button>
        </BottomNavigation>
        </Layout>
      </Container>
    )
  }

  _renderContainer = () => {
    return (
      <Layout style={styles.containerInner}>
        <FlatList
          data={this.state.data}
          renderItem={this._renderItem}
        />
      </Layout>
    )
  }

  _renderItem = ({item, index}) => {
    if (item.is_active) {
      return false;
    }
    
    return (
      <TouchableOpacity style={{flexDirection: 'row', marginVertical: 6}} onPress={() => !item.is_active ? this._selectManagement(item) : null}>
      {
        (item.gambar_link) ?
        (
          <Image
            opacity={(!item.is_active ? 1 : 0.5)}
            style={{width: 80, height: 80, borderRadius: 18}}
            source={{
              uri: (item.gambar_link) ? item.gambar_link : '',
            }}
          />
        ) :
        (
          <View style={styles.containerManagementIcon}>
            <Icon style={styles.iconAvatarProfile} name="person-outline"/>
          </View>
        )
      }
        <View opacity={(!item.is_active ? 1 : 0.5)} style={{flex: 1, marginHorizontal: 10, marginVertical: 2, justifyContent: 'space-between'}}>
          <Text category="p1" style={layout.semiBold}>{item.nama}</Text>
          <Text category="c2" appearance="hint" style={layout.regular}>{item.notelp}</Text>
          <Text category="c2" appearance="hint" style={layout.regular}>{t('dUmur', {umur : item.birthday_f})}</Text>
          <Text category="c2" appearance="hint" style={layout.regular}>{item.created_on_f}</Text>
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

  _selectManagement = (data) => {
    let select = [];
    this.state.data.map((item, index) => {
      if (item.user_id == data.user_id) {
        if (item.is_selected) {
          select.push({...item, is_selected : false});
        } else {
          select.push({...item, is_selected : true});
        }
      } else {
        if (item.is_selected) {
          select.push({...item, is_selected : true});
        } else {
          select.push({...item, is_selected : false});
        }
      }
    })
    this.setState({data: select, user_id: data.user_id});
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
    this.setState({isRefresh : true}, () => {
      this._getData()
    })
  }

}

const mapStateToProps = state => ({state: state});
const mapDispatchToProps = dispatch => ({

});
export default connect(mapStateToProps, mapDispatchToProps)(TambahManager);
