import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import { Container, Header, Process } from '../../theme';
import { Layout, Text, Icon, Input, Button, Select, SelectItem, BottomNavigation, Spinner } from '@ui-kitten/components';
import { connect } from 'react-redux';
import t from '../../lang';
import layout from '../../theme/styles/layout';
import { request, upload } from '../../bridge';
import { formatCur, formatDate } from '../../func';
import styles from '../../theme/styles/styles';
import Toast from 'react-native-simple-toast';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';
import RNDateTimePicker from '@react-native-community/datetimepicker';

const IconAll = (data) => {
  return (
    <Icon style={{width: 35, color: data.color}} name={data.name} />
  )
}

class InfoBersih extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isProcess    : false,
      isTanggal    : false,
      isWaktu      : false,
      isSprei      : false,
      tanggal      : '',
      waktu_bersih : '',
      ganti_sprei  : '',
    }

  }

  componentDidMount = () => {
    this.setState({isProcess : true}, () => {
      this._getData();
    })
  }

  _getData = () => {
    this.setState({
      waktu_bersih : this.props.params?.waktu_bersih,
      ganti_sprei  : this.props.params?.ganti_sprei,
      isProcess    : false,
    })
  }

  render() {
    return (
      <Container>
        <Header navigation={this.props.navigation} params={{
          center : t('pInfoBersih'),
          isBack : true
        }}/>
        <Layout style={[layout.container, styles.containerInner]}>
          <ScrollView showsVerticalScrollIndicator={false} style={styles.containerList}>
            <TouchableOpacity style={[styles.containerInputBersih, {borderColor: (this.state.errBersih ? 'red' : '#eef1f7')}]} onPress={this._onBersih}>
              <Text numberOfLines={1} style={[styles.loginTextInput, {paddingVertical: 10, marginLeft: 20, color: (this.state.waktu_bersih) ? '#000000' : '#909cb3'}]}>{(this.state.waktu_bersih) ? this.state.waktu_bersih : t('iBersih')}</Text>
              <IconAll color='#8F9BB3' name='menu-2-outline'/>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.containerInputBersih, {borderColor: (this.state.errSprei ? 'red' : '#eef1f7')}]} onPress={this._onSprei}>
              <Text style={[styles.loginTextInput, {paddingVertical: 10, marginLeft: 20, color: (this.state.ganti_sprei) ? '#000000' : '#909cb3'}]}>{(this.state.ganti_sprei) ? this.state.ganti_sprei : t('iSprei')}</Text>
              <IconAll color='#8F9BB3' name='menu-2-outline'/>
            </TouchableOpacity>
          </ScrollView>
          <BottomNavigation appearance="noIndicator">
            <Button style={{marginVertical : 10}} onPress={this._onSubmit} disabled={(this.props.state.user.role == '3') ? true : false}>{t('bSubmit')}</Button>
          </BottomNavigation>
        </Layout>
        {
          (this.state.isTanggal) &&
          <RNDateTimePicker minimumDate={new Date('2021-03-01')} maximumDate={new Date('2021-03-31')} value={new Date('2021-03-01')} onChange={this._onTanggal}/>
        }
        {
          (this.state.isWaktu) &&
          <RNDateTimePicker mode="time" timeZoneOffsetInSeconds={60} value={new Date()} onChange={this._onWaktu}/>
        }
        {
          (this.state.isSprei) &&
          <RNDateTimePicker mode="date" minimumDate={new Date('2021-03-01')} maximumDate={new Date('2021-03-31')} value={new Date('2021-03-01')} onChange={this._onTanggalSprei}/>
        }
        <Process visible={this.state.isProcess}/>
      </Container>
    )
  }

  _onSubmit = () => {
    this.setState({
      errBersih       : (this.state.waktu_bersih ? false : true),
      errSprei        : (this.state.ganti_sprei ? false : true),
    }, () => {
      if (
        !this.state.errBersih &&
        !this.state.errSprei
      ) {
        let params = {
          'waktu_bersih' : this.state.waktu_bersih,
          'ganti_sprei'  : this.state.ganti_sprei,
        }
        this._simpanInfoBersih(params);
      }
    })
  }

  _simpanInfoBersih = (params) => {
    this.setState({isProcess : true}, () => {
      request({
        'model'  : 'properti_model',
        'key'    : 'simpan_pembersihan',
        'table'  : '-',
        'data'   : params,
        'where'  : {
          // 'kamar_id'    : this.props.params?.edit?.kamar_id,
          'properti_id' : this.props.params?.properti_id
        },
      }).then((res) => {
        this.props.params.action();
        Toast.show(t('aSimpanPembersihan'), Toast.SHORT);
        this.setState({isLoading : false});
      }).catch((error) => {
        this.setState({isLoading : false});
      });  
    })
  }

  _onBersih = () => {
    this.setState({isTanggal: !this.state.isTanggal, isWaktu : false})
  }

  _onSprei = () => {
    this.setState({isSprei: !this.state.isSprei})
  }

  _onTanggalSprei = (event, date) => {
    if (date) {
      this.setState({
        ganti_sprei   : 'Tanggal '+formatDate({date : date, format : 'DD'}),
        isSprei : false
      });
    } else {
      this.setState({
        isSprei : false
      });
    }
  }

  _onTanggal = (event, date) => {
    if (date) {
      this.setState({
        tanggal   : 'Tanggal '+formatDate({date : date, format : 'DD'}),
        isTanggal : !this.state.isTanggal,
        isWaktu   : !this.state.isWaktu,
      });
    } else {
      this.setState({
        isTanggal : false,
        isWaktu   : false,
      });
    }
  }

  _onWaktu = (event, timestamp) => {
    if (timestamp) {
      let time = ('0'+timestamp.getHours()).slice(-2)+':'+('0'+timestamp.getMinutes()).slice(-2);
      this.setState({
        waktu_bersih : this.state.tanggal+', Jam '+time,
        isTanggal    : false,
        isWaktu      : false
      });
    } else {
      this.setState({
        isTanggal : false,
        isWaktu   : false
      });
    }
  }

}

const mapStateToProps = state => ({state: state});
const mapDispatchToProps = dispatch => ({

});
export default connect(mapStateToProps, mapDispatchToProps)(InfoBersih);
