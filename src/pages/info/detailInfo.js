import React, { Component } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { Container, Header } from '../../theme';
import { Layout, Text, Spinner } from '@ui-kitten/components';
import { connect } from 'react-redux';
import t from '../../lang';
import layout from '../../theme/styles/layout';
import styles from '../../theme/styles/styles';

class DetailInfo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading     : true,
      kamar         : '',
      data          : [],
      menuAct       : [],
    }
  }

  render() {
    return (
      <Container>
        <Header navigation={this.props.navigation} params={{
          center : t('pInfo'),
          isBack : true
        }}/>
        <Layout style={layout.container}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            >
            {
               this._renderContainer()
            }
          </ScrollView>
        </Layout>
      </Container>
    )
  }

  _renderContainer = () => {
    return (
      <View style={styles.containerInner}>
        <Text style={layout.bold} category="h5">{this.props.params.data.judul}</Text>
        <Text style={{marginVertical : 8}}>{this.props.params.data.isi}</Text>
        <Text category="c2" appearance="hint">{this.props.params.data.created_on_f}</Text>
      </View>
    )
  }

}

const mapStateToProps = state => ({state: state});
const mapDispatchToProps = dispatch => ({

});
export default connect(mapStateToProps, mapDispatchToProps)(DetailInfo);
