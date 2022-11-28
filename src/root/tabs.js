import React from 'react';
import { BottomNavigation, BottomNavigationTab, Icon } from '@ui-kitten/components';
import { View, Platform, SafeAreaView } from 'react-native';
import { connect } from 'react-redux';
import layout from '../theme/styles/layout';

const IconAll = (style, name, index) => {
  return (
    <Icon {...style} style={[style.style, {height : (name == 'controller' ? 28 : (name == 'arrow-left-right' ? 22 : 26)), width : (name == 'controller' ? 28 : (name == 'arrow-left-right' ? 22 : 26))}, (style.style.tintColor == '#8F9BB3' ? {tintColor : '#8F9BB3'} : null)]} name={name} />
  )
}

const Tabs = ({ navigation, state, ...props }) => {
  const onSelect = (index) => {
    if (!props.dataUser.user.isLogin && (state.routeNames[index] != 'HomeTab')) {
      navigation.push('GoTo', {
        page : 'Login'
      })
    }else {
      navigation.navigate(state.routeNames[index])
    }
  }

  return (
    <SafeAreaView>
      <BottomNavigation
          selectedIndex={state.index}
          onSelect={onSelect}
          appearance="noIndicator"
          style={layout.navBottom}
        >
        <BottomNavigationTab icon={(style) => IconAll(style, 'home-outline', state.index)}/>
        <BottomNavigationTab icon={(style) => IconAll(style, 'file-text-outline', state.index)}/>
        <BottomNavigationTab icon={(style) => IconAll(style, 'person-outline', state.index)}/>
      </BottomNavigation>
    </SafeAreaView>
  );
}

const mapStateToProps = state => ({dataUser: state});
const mapDispatchToProps = dispatch => ({
});
export default connect(mapStateToProps, mapDispatchToProps)(Tabs);
