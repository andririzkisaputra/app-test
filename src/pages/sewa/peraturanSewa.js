import React, { Component } from 'react';
import { View, ScrollView, RefreshControl, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { Container, Header, ListItem, Process } from '../../theme';
import { Layout, Text, Spinner, Icon, Card, Modal, Input, SelectItem, BottomNavigation, Button } from '@ui-kitten/components';
import { connect } from 'react-redux';
import t from '../../lang';
import { request } from '../../bridge';
import { formatDate, formatCur } from '../../func';
import { setReload } from '../../root/redux/actions';
import layout from '../../theme/styles/layout';
import styles from '../../theme/styles/styles';
import { StackActions  } from '@react-navigation/native';

const BannerWidth = Dimensions.get('window').width - 32;
const BannerHeight = Dimensions.get('window').height/3.5;

class PeraturanSewa extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading : true,
      isProcess : false,
      peraturan : '',
      data      : [],
    }
  }

  componentDidMount = () => {
    this._getData()
  }

  _getData = () => {
    this.setState({
        peraturan : this.props.params.peraturan,
        isLoading : false,
        isRefresh : false,
    });
  }

  render() {
    return (
      <Container>
        <Header navigation={this.props.navigation} params={{
          center : 'Peraturan Kos',
          isBack : false
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
            <Button status="danger" style={{marginVertical : 10, marginLeft: 10, marginRight:5}} onPress={this._onTidakSetuju}>{'Tidak Setuju'}</Button>
            <Button style={{marginVertical : 10, marginRight: 10, marginLeft: 5}} onPress={this._onSetuju}>{'Setuju'}</Button>
          </BottomNavigation>
        </Layout>
        <Process visible={this.state.isProcess}/>
      </Container>
    )
  }

  _renderContainer = () => {
    return (
      <View style={styles.containerInner}>
        <Text style={[layout.regular, {margin: 10}]}>
            {this.state.peraturan ?? 'Peraturan Kos Belum di Isi'}
        </Text>
      </View>
    )
  }

  _onTidakSetuju = () => {
    this.props.params.action(false);
  }

  _onSetuju = () => {
    this.props.params.action(true);
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
export default connect(mapStateToProps, mapDispatchToProps)(PeraturanSewa);
