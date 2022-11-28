import React, { Component } from 'react';
import { View, ScrollView, RefreshControl, TouchableOpacity, Image, FlatList, Linking, Dimensions } from 'react-native';
import { Container, Header } from '../../theme';
import { Layout, Text, Spinner, Icon, ListItem } from '@ui-kitten/components';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { connect } from 'react-redux';
import Bantuan from './bantuan';
import Tentang from './tentang';
import layout from '../../theme/styles/layout';
import styles from '../../theme/styles/styles';
import t from '../../lang';

class TentangTab extends Component {

  constructor(props) {
    super(props);

    this.state = {
      index         : 0,
      routes        : [
        { key: 'tentang', title: t('pTentang'), navigation: this.props.navigation, params : this.props.params, active : 1 },
        { key: 'bantuan', title: t('pBantuan'), navigation: this.props.navigation, params : this.props.params, active : 0 },
      ],
    }

    this._sceneMap = SceneMap({
      tentang : Tentang,
      bantuan : Bantuan,
    });
  }

  _renderTabBar = props => {
   return (
     <TabBar
       {...props}
       indicatorStyle={layout.indicator}
       labelStyle={layout.label}
       style={layout.tabbar}
     />
   );
  }

  componentDidMount = () => {

  }

  render() {
    return (
      <Container>
        <Header navigation={this.props.navigation} params={{
          center : t('pInfo'),
          isBack : true
        }}/>
        <Layout style={{flex: 1}} level="3">
          <TabView
            lazy
            navigationState={this.state}
            renderScene={this._sceneMap}
            renderTabBar={this._renderTabBar}
            renderLazyPlaceholder={this._renderPlaceholder}
            onIndexChange={this._handleIndexChange}
            initialLayout={{ width: Dimensions.get('window').width }}
            style={layout.container}
          />
        </Layout>
      </Container>
    )
  }

  _handleIndexChange = index => this.setState({ index });

  _renderPlaceholder = ({ route }) => <View style={layout.spinner}><Spinner /></View>;

}

const mapStateToProps = state => ({state: state});
const mapDispatchToProps = dispatch => ({

});
export default connect(mapStateToProps, mapDispatchToProps)(TentangTab);
