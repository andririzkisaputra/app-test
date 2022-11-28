import React, { PureComponent, Fragment } from 'react';
import { Button, View, Text, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { mapping, light as lightTheme } from '@eva-design/eva';
import { default as customMapping } from '../theme/json/custom-mapping.json';
import { default as appTheme } from '../theme/json/custom-theme.json';
import { EvaIconsPack } from '../theme/evaIcons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStore } from 'redux';
import { DEFAULT_DB_USER } from '../config';
import { get } from '../bridge/storage';
import { Provider } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import reducer from './redux/reducers';
import Home from '../pages/home';
import Info from '../pages/info';
import Properti from '../pages/properti';
import Profile from '../pages/profile';
import GoTo from './goto';
import Init from './init';
import Tabs from './tabs';
import * as Sentry from "@sentry/react-native";

const theme     = { ...lightTheme, ...appTheme };
const options   = { headerShown: false };

const Tab             = createBottomTabNavigator();
const HomeStack       = createNativeStackNavigator();
const InfoStack       = createNativeStackNavigator();
const PropertiStack   = createNativeStackNavigator();
const ProfileStack    = createNativeStackNavigator();
const AppStack        = createNativeStackNavigator();

function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator screenOptions={options}>
      <ProfileStack.Screen name="Profile" component={Profile} />
    </ProfileStack.Navigator>
  );
}

function OrderStackScreen() {
  return (
    <OrderStack.Navigator screenOptions={options}>
      <OrderStack.Screen name="Order" component={Order} />
    </OrderStack.Navigator>
  );
}

function InfoStackScreen() {
  return (
    <InfoStack.Navigator screenOptions={options}>
      <InfoStack.Screen name="Info" component={Info} />
    </InfoStack.Navigator>
  );
}

function PropertiStackScreen() {
  return (
    <InfoStack.Navigator screenOptions={options}>
      <InfoStack.Screen name="Properti" component={Properti} />
    </InfoStack.Navigator>
  );
}

function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={options}>
      <HomeStack.Screen name="Home" component={Home} />
    </HomeStack.Navigator>
  );
}

const TabNavigatorAnakKos = () => (
  <Tab.Navigator screenOptions={options} tabBar={props => <Tabs {...props} />}>
    <Tab.Screen name='HomeTab' component={HomeStackScreen}/>
    <Tab.Screen name='InfoTab' component={Info}/>
    <Tab.Screen name='ProfileTab' component={ProfileStackScreen}/>
  </Tab.Navigator>
)

const TabNavigatorOwner = () => (
  <Tab.Navigator screenOptions={options} tabBar={props => <Tabs {...props} />}>
    <Tab.Screen name='HomeTab' component={HomeStackScreen}/>
    <Tab.Screen name='InfoTab' component={Info}/>
    <Tab.Screen name='ProfileTab' component={ProfileStackScreen}/>
  </Tab.Navigator>
)

const TabNavigatorPenjaga = () => (
  <Tab.Navigator screenOptions={options} tabBar={props => <Tabs {...props} />}>
    <Tab.Screen name='HomeTab' component={HomeStackScreen}/>
    <Tab.Screen name='InfoTab' component={Info}/>
    <Tab.Screen name='ProfileTab' component={ProfileStackScreen}/>
  </Tab.Navigator>
)

const AppNavigationOwner = () => (
  <AppStack.Navigator screenOptions={options}>
    <AppStack.Screen name="Tab" component={TabNavigatorOwner} />
    <AppStack.Screen name="GoTo" component={GoTo} />
  </AppStack.Navigator>
)

const AppNavigationPenjaga = () => (
  <AppStack.Navigator screenOptions={options}>
    <AppStack.Screen name="Tab" component={TabNavigatorOwner} />
    <AppStack.Screen name="GoTo" component={GoTo} />
  </AppStack.Navigator>
)

const AppNavigationAnakKos = () => (
  <AppStack.Navigator screenOptions={options}>
    <AppStack.Screen name="Tab" component={TabNavigatorAnakKos} />
    <AppStack.Screen name="GoTo" component={GoTo} />
  </AppStack.Navigator>
)

const store = createStore(reducer);
class App extends PureComponent {

    constructor(props) {
      super(props);
      this.state = {
        userData  : null
      }
    }

    componentDidMount = () => {
      SplashScreen.hide();
      get({table : DEFAULT_DB_USER}).then((data) => {
        this.setState({userData : data});
      });

      Sentry.init({
        dsn: "https://22269b38909b489f8bca7174a50b6b2a@o1150984.ingest.sentry.io/6227581",
        tracesSampleRate: 0.2,
      });

    }

    render() {
      return (
        <Fragment>
          <Provider store={store}>
            <IconRegistry icons={EvaIconsPack} />
            <ApplicationProvider mapping={mapping} theme={theme} customMapping={customMapping}>
              <NavigationContainer>
                <Init user={<AppNavigationAnakKos/>} owner={<AppNavigationOwner/>} penjaga={<AppNavigationPenjaga/>}/>
              </NavigationContainer>
            </ApplicationProvider>
          </Provider>
        </Fragment>
      )

    }

}

export default Sentry.wrap(App);
