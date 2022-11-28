import React, { PureComponent } from 'react';
import { Platform, Linking } from 'react-native';
import { status_login } from '../bridge/storage';
import { userSet } from './redux/actions';
import { OS_APPID } from '../config';
import { connect } from 'react-redux';
import OneSignal from 'react-native-onesignal';

class Init extends PureComponent {

  constructor(props) {
    super(props);

    OneSignal.setAppId(OS_APPID);
  }

  UNSAFE_componentWillMount() {
    this._setUser();
  }

  _setUser = () => {
    status_login().then((data) => {
      if (data) {
        this.props.userSet(data);
      }
    });
  }

  render() {
    if (this.props.state.user.role == '1') {
      return this.props.owner;
    }

    if (this.props.state.user.role == '3') {
      return this.props.penjaga;
    }

    return this.props.user;
  }

}

const mapStateToProps = state => ({state: state});
const mapDispatchToProps = dispatch => ({
  userSet: (data) => dispatch(userSet(data))
});
export default connect(mapStateToProps, mapDispatchToProps)(Init);
