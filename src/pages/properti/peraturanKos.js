import React, { Component } from 'react';
import { View, TextInput, ScrollView } from 'react-native';
import { Container, Header, Process } from '../../theme';
import { Layout, Text, BottomNavigation, Button, Input } from '@ui-kitten/components';
import { connect } from 'react-redux';
import t from '../../lang';
import { request, upload } from '../../bridge';
import layout from '../../theme/styles/layout';
import styles from '../../theme/styles/styles';

class PeraturanKos extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading     : true,
      isProcess     : false,
      isOpsiTanggal : false,
      kamar         : '',
      data          : [],
    }
  }

  componentDidMount = () => {
    this._getData();
  }

  _getData = () => {
    this.setState({isProcess : true}, () => {
      request({
        'model'     : 'properti_model',
        'key'       : 'get_pengaturan_kos',
        'table'     : '-',
        'where'     : {
          'properti_id' : this.props.params.properti_id
        }
      }).then((res) => {
        this.setState({
          peraturan : res.data.peraturan,
          isRefresh : false,
          isLoading : false,
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
          center : t('pPeraturanKos'),
          isBack : true,
          right  : this._right,
        }}/>
        <Layout style={layout.container}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {this._renderContainer()}
          </ScrollView>
        </Layout>
        <Process visible={this.state.isProcess}/>
      </Container>
    )
  }

  _renderContainer = () => {
    return (
      <View style={styles.containerInner}>
        <Input
          style={styles.registerInput}
          textStyle={[styles.alamatInput, {height: 300}]}
          multiline={true}
          style={{fontSize: 20}}
          placeholder={t('iPeraturanKos')}
          onChangeText={this._onChangePeraturan}
          value={this.state.peraturan}
          status={(this.state.errPeraturan) ? 'danger' : 'basic'}
        />
      </View>
    )
  }

  _right = () => (
    <Button size="tiny" onPress={this._onSubmit}>{t('bSimpan')}</Button>
  )

  _onChangePeraturan = (text) => {
    this.setState({ peraturan : text })
  }

  _onSubmit = () => {
    this.setState({
      errPeraturan : (this.state.peraturan) ? false : true
    }, () => {
      if (
        !this.state.errPeraturan
      ) {
        this._onSimpan();
      }
    })
  }

  _onSimpan = () => {
    this.setState({isProcess : true}, () => {
      request({
        'model' : 'properti_model',
        'key'   : 'simpan_peraturan',
        'table' : '-',
        'data'  : {
          'peraturan'   : this.state.peraturan,
        },
        'where' : {
          'properti_id' : this.props.params.properti_id
        }
      }).then((res) => {
        if (res.success) {
          this.props.params.action();
        }
      }).catch((error) => {
        this.setState({isLoading : false});
      });
    });
  }

  _onEdit = () => {
    request({
      'model' : 'Info_model',
      'key'   : 'editInfo',
      'table' : '-',
      'data'  : {
        'info_id'    : this.props.params.edit.info_id,
        'judul'      : this.state.judul,
        'isi'        : this.state.isi,
        'created_by' : this.props.state.user.user_id,
      }
    }).then((res) => {
      if (res.success) {
        this.props.params.action();
      }
    }).catch((error) => {
      this.setState({isLoading : false});
    });
  }

}

const mapStateToProps = state => ({state: state});
const mapDispatchToProps = dispatch => ({

});
export default connect(mapStateToProps, mapDispatchToProps)(PeraturanKos);
