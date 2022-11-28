import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Container, Header, Process } from '../../theme';
import { Layout, Text, Input, Button, Spinner, ListItem } from '@ui-kitten/components';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet';
import { connect } from 'react-redux';
import { request } from '../../bridge';
import Toast from 'react-native-simple-toast';
import styles from '../../theme/styles/styles';
import layout from '../../theme/styles/layout';
import t from '../../lang';

class KomplainUserProses extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading       : true,
      menuAct         : [],
      isProcess       : false,
      komplain_id     : this.props.params?.komplain_id,
      keterangan      : this.props.params?.keterangan,
      sewa_id         : this.props.params?.sewa_id,
      nama_properti   : this.props.params?.nama_properti,
      properti_id     : this.props.params?.properti_id,
      tanggapan       : this.props.params?.tanggapan,
      created_by      : this.props.params?.created_by,
    }
  }

  componentDidMount = () => {
    this._getData();
  }

  _getData = () => {
    this.setState({isLoading : true}, () => {
      request({
        'model'     : 'all_model',
        'key'       : 'get_kamar',
        'table'     : '-',
        'where'     : {
          'user_id' : this.props.state.user.user_id
        }
      }).then((res) => {
        if (res.success) {
          let data = res.data;
          let menu = [<Text status='danger'>{t('bClose')}</Text>];
          if (data?.length > 0) {
            data.map((item, index) => {
              menu.push(
                <ListItem
                  title={item.nama_properti}
                  description={'Lantai '+item.lantai+', No. '+item.nomor_kamar}
                  onPress={() => this._selectKamar(item)}
                />
              );
            })
          }
          this.setState({
            menuAct   : menu,
          });
        }
        this.setState({isLoading : false, isRefresh : false});
      }).catch((error) => {
        this.setState({isLoading : false, isRefresh : false});
      });
    })
  }

  render() {
    return (
      <Container>
        <Header navigation={this.props.navigation} params={{
          center : t('pKomplainUserProses'),
          isBack : true
        }}/>
        <Layout style={[layout.container, styles.containerInner]}>
          {
            (this.state.isLoading) ?
            (
              <View style={layout.spinner}>
                <Spinner/>
              </View>
            ) :
            (
              <ScrollView showsVerticalScrollIndicator={false} style={styles.containerList}>

                <TouchableOpacity disabled={(this.props.state.user.role != 2) ? true : false} activeOpacity={0.8} onPress={this._selectProp} style={[styles.registerInput, {backgroundColor : '#F7F9FC', borderWidth : 1, borderColor : '#E4E9F2'}]}>
                  <Text appearance={(this.state.nama_properti) ? 'basic' : 'hint'} style={{fontSize : 18, paddingHorizontal : 18}}>{(this.state.nama_properti) ? this.state.nama_properti : 'Kamar Terkait'}</Text>
                </TouchableOpacity>

                <Input
                  disabled={(this.props.state.user.role != 2) ? true : false}
                  style={styles.registerInput}
                  textStyle={styles.loginTextInput}
                  placeholder={'Keterangan'}
                  value={this.state.keterangan}
                  onChangeText={this._onChange}
                  status={(this.state.errKeterangan) ? 'danger' : 'basic'}
                  multiline={true}
                />

                {
                  (this.props.state.user.role != 2) &&
                  (
                    <Input
                      style={styles.registerInput}
                      textStyle={styles.loginTextInput}
                      placeholder={'Tanggapan'}
                      value={this.state.tanggapan}
                      onChangeText={this._onChange2}
                      status={(this.state.errTanggapan) ? 'danger' : 'basic'}
                      multiline={true}
                    />
                  )
                }

                <Button status="info" onPress={this._submit} disabled={(!this.state.nama_properti || !this.state.keterangan || (this.props.state.user.role != 2 && !this.state.tanggapan ? true : false))}>Submit</Button>
              </ScrollView>
            )
          }
        </Layout>
        <ActionSheet
          ref={o => this.menuSheet = o}
          title={<View style={layout.actionSheetHeader}></View>}
          options={this.state.menuAct}
          styles={layout.actionSheet}
          cancelButtonIndex={0}
        />
        <Process visible={this.state.isProcess}/>
      </Container>
    )
  }

  _selectProp = () => {
    this.menuSheet.show();
  }

  _selectKamar = (data) => {
    this.setState({
      sewa_id       : data.sewa_id,
      nama_properti : data.nama_properti,
      properti_id   : data.properti_id
    }, () => {
      this.menuSheet.hide();
    })
  }

  _submit = () => {
    this.setState({isProcess : true}, () => {
      request({
        'model'     : 'all_model',
        'key'       : 'add_komplain',
        'table'     : '-',
        'data'     : {
          'sewa_id'    : this.state.sewa_id,
          'keterangan' : this.state.keterangan,
          'komplain_id': this.state.komplain_id,
          'properti_id': this.state.properti_id,
          'user_id'    : (this.props.state.user.role != 2 ? this.state.created_by : this.props.state.user.user_id),
          'tanggapan'  : this.state.tanggapan
        }
      }).then((res) => {
        Toast.show(t(res.success ? 'aSimpanSuccess' : 'aSimpanFail'), Toast.LONG);
        if (res.success) {
          if (this.props.params.action) {
            this.props.params.action();
          }
          this.props.navigation.pop();
        }
        this.setState({isProcess : false});
      }).catch((error) => {
        this.setState({isProcess : false});
      });
    })
  }

  _onChange = (text) => {
    this.setState({ keterangan : text });
  }

  _onChange2 = (text) => {
    this.setState({ tanggapan : text });
  }

}

const mapStateToProps = state => ({state: state});
const mapDispatchToProps = dispatch => ({

});
export default connect(mapStateToProps, mapDispatchToProps)(KomplainUserProses);
