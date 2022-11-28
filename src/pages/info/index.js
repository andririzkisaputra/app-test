import React, { Component } from 'react';
import { View, RefreshControl, Dimensions } from 'react-native';
import { Container, Header } from '../../theme';
import { Layout, Text, Spinner, Icon, Button } from '@ui-kitten/components';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { connect } from 'react-redux';
import t from '../../lang';
import layout from '../../theme/styles/layout';
import styles from '../../theme/styles/styles';
import KomplainUser from '../profile/komplainUser';
import Inform from './inform';

class Info extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading     : true,
      kamar         : '',
      data          : [],
      menuAct       : [],
      index         : (this.props.route.params?.active || 0),
      routes        : [
        { key: 'informasi', title: t('pInform'), navigation: this.props.navigation, params : this.props.params, active : 1 },
        { key: 'komplain', title: t('pKomplainUser'), navigation: this.props.navigation, params : this.props.params, active : 0 },
      ],
    }

    this._sceneMap = SceneMap({
      informasi : Inform,
      komplain : KomplainUser,
    });
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    if (this.state.index != nextProps.route.params?.active) {
      this.setState({index : nextProps.route.params?.active});
      return true;
    }
    
    return false;
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
          isBack : false,
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
export default connect(mapStateToProps, mapDispatchToProps)(Info);
