import React, { PureComponent } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { TopNavigation, TopNavigationAction, Icon, Text, Input } from '@ui-kitten/components';
import { connect } from 'react-redux';
import styles from './styles/styles';
import layout from './styles/layout';
import { LOGO_HOME } from '../config';
import t from '../lang';

const BackIcon = (style) => (
  <Icon style={[style.style, {color : styles.headerIcon.color, height: 20, width : 20}]} name='arrow-ios-back-outline' />
);

class Header extends PureComponent {

    constructor(props) {
      super(props)

      this.state = {
      }

    }

    componentDidMount = () => {

    }

    render() {
      const params = this.props.params;
      this.center  = (params.center) ? params.center : t('pHome');
      this.right   = (params.right) ? params.right : false;
      this.isBack  = (params.isBack) ? true : false;
      this.rightSearch  = (params.rightSearch) ? params.rightSearch : false;
      const page   = this.center;
      if (page == t('pSearch')) {
        return (
          <TopNavigation
            alignment='start'
            accessoryLeft={
              <View style={styles.containerHeaderSearch}>
                { this._backAction() }
                <Input
                  style={styles.searchInput}
                  textStyle={styles.searchTextInput}
                  placeholder={t('pSearch')}
                  accessoryRight={this.rightSearch}
                  autoFocus
                  value={params.keyword}
                  onChangeText={params.changeText}
                  onSubmitEditing={params.actSearch}
                  returnKeyType='search'
                />
                { this.right() }
              </View>
            }
          />
        );
      } else if(page == t('pHome')) {
        return (
          <TopNavigation
            title={() => <Image source={LOGO_HOME} style={{height : 40, width : 80}}/>}
            alignment='start'
            accessoryLeft={(this.isBack) ? this._backAction() : null}
            accessoryRight={this.right}
          />
        );
      } else {
        return (
          <TopNavigation
            title={() => <Text style={layout.title}>{this.center}</Text>}
            alignment='start'
            accessoryLeft={(this.isBack) ? this._backAction() : null}
            accessoryRight={this.right}
          />
        );
      }
    }

    _backAction = () => {
      return (<TopNavigationAction onPress={() => (this.props.params?.isAlert ? this.props.params?.isAlert() : this.props.navigation.pop())} icon={BackIcon}/>)
    }
}

const mapStateToProps = state => ({state: state});
const mapDispatchToProps = dispatch => ({

});
export default connect(mapStateToProps, mapDispatchToProps)(Header);
