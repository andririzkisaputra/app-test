import React, { Component } from 'react';
import { View, ScrollView, RefreshControl, TouchableOpacity, Image, FlatList, Linking } from 'react-native';
import { Container, Header } from '../../theme';
import { Layout, Text, Spinner, Icon, ListItem } from '@ui-kitten/components';
import { connect } from 'react-redux';
import { APP_VERSION, LOGO } from '../../config';
import Toast from 'react-native-simple-toast';
import layout from '../../theme/styles/layout';
import styles from '../../theme/styles/styles';
import t from '../../lang';

class Tentang extends Component {

  constructor(props) {
    super(props);

    this.state = {

    }
  }

  componentDidMount = () => {

  }

  render() {
    return (
      <Container>
        <Layout style={[layout.container, styles.containerInner]}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{flex : 1, flexDirection : 'column', justifyContent : 'center', alignItems : 'center'}}>
              <Image source={LOGO} style={{width : 300, height : 300}}/>
              <ListItem
                accessoryLeft={(props) => <Icon {...props} name="info-outline" />}
                title={'Versi aplikasi'}
                description={'Versi aplikasi saat ini '+APP_VERSION}
              />
              <ListItem
                accessoryLeft={(props) => <Icon {...props} name="facebook-outline" />}
                title={'Facebook'}
                onPress={() => this._link('https://web.facebook.com/kost.zy')}
                description={'Like kami di Facebook'}
              />
              <ListItem
                accessoryLeft={(props) => <Icon {...props} name="instagram" />}
                title={'Instagram'}
                onPress={() => this._link('https://www.instagram.com/thekostzy')}
                description={'Follow kami di Instagram'}
              />
              <ListItem
                accessoryLeft={(props) => <Icon {...props} name="link-outline" />}
                title={'Website'}
                onPress={() => this._link('http://kostzy.com/')}
                description={'Temukan kami di kostzy.com'}
              />
            </View>
          </ScrollView>
        </Layout>
      </Container>
    )
  }

  _link = (link) => {
    Linking.openURL(link);
  }

}

const mapStateToProps = state => ({state: state});
const mapDispatchToProps = dispatch => ({

});
export default connect(mapStateToProps, mapDispatchToProps)(Tentang);
