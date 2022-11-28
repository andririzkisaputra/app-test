import React, { Component } from 'react';
import { View, TextInput, ScrollView } from 'react-native';
import { Container, Header, Process } from '../../theme';
import { Layout, Text, BottomNavigation, Button, Input } from '@ui-kitten/components';
import { connect } from 'react-redux';
import t from '../../lang';
import { request, upload } from '../../bridge';
import layout from '../../theme/styles/layout';
import styles from '../../theme/styles/styles';

class TambahInfo extends Component {

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
    if (this.props.params.edit) {
      this._getData();
    }
  }

  _getData = () => {
    this.setState({isProcess : true}, () => {
      request({
        'model'     : 'Info_model',
        'key'       : 'getByInfo',
        'table'     : '-',
        'where'     : {
          'info_id' : this.props.params.edit.info_id
        }
      }).then((res) => {
        this.setState({
          judul     : res.data.judul,
          isi       : res.data.isi,
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
          center : (this.props.params.edit) ? t('pEditInfo') : t('pTambahInfo'),
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
          textStyle={styles.loginTextInput}
          placeholder={t('iJudul')}
          onChangeText={this._onChangeJudul}
          value={this.state.judul}
          status={(this.state.errjudul) ? 'danger' : 'basic'}
        />
        <Input
          style={styles.registerInput}
          textStyle={[styles.alamatInput, {height: 300}]}
          multiline={true}
          style={{fontSize: 20}}
          placeholder={t('iIsi')}
          onChangeText={this._onChangeIsi}
          value={this.state.isi}
          status={(this.state.errisi) ? 'danger' : 'basic'}
        />
      </View>
    )
  }

  _right = () => (
    <Button size="tiny" onPress={this._onSubmit}>{t('bSimpan')}</Button>
  )
  _onChangeJudul = (text) => {
    this.setState({ judul : text })
  }

  _onChangeIsi = (text) => {
    this.setState({ isi : text })
  }

  _onSubmit = () => {
    this.setState({
      errjudul : (this.state.judul) ? false : true,
      errisi   : (this.state.isi) ? false : true
    }, () => {
      if (
        !this.state.errjudul &&
        !this.state.errisi
      ) {
        if (this.props.params.edit) {
          this._onEdit();
        } else {
          this._onSimpan();
        }
      }
    })
  }

  _onSimpan = () => {
    this.setState({isProcess : true}, () => {
      request({
        'model' : 'Info_model',
        'key'   : 'simpanInfo',
        'table' : '-',
        'data'  : {
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
export default connect(mapStateToProps, mapDispatchToProps)(TambahInfo);
