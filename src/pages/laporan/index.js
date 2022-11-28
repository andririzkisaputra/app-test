import React, { Component } from 'react';
import { View, RefreshControl, FlatList, TouchableOpacity, PermissionsAndroid } from 'react-native';
import { Layout, Icon, Text, Button, Spinner, Avatar, Datepicker } from '@ui-kitten/components';
import { Container, Header, Process, Calert, Empty, ListItem } from '../../theme';
import { DEFAULT_PAGE, DEFAULT_PERPAGE } from '../../config';
import { connect } from 'react-redux';
import { request } from '../../bridge';
import MonthPicker from 'react-native-month-year-picker';
import layout from '../../theme/styles/layout';
import styles from '../../theme/styles/styles';
import t from '../../lang';
import ActionButton from 'react-native-action-button';
import RNFetchBlob from 'react-native-fetch-blob';
import Toast from 'react-native-simple-toast';


const IconAll = (name) => {
  return (
    <Icon style={{width: 20, height : 20, color: '#8F9BB3'}} name={name.name} />
  )
}

class Laporan extends Component {

  constructor(props) {
    super(props);
    let dates  = new Date();
    this.state = {
      data        : [],
      isRefresh   : false,
      show        : false,
      isProcess   : false,
      date        : dates,
      month       : (dates.getMonth()+1),
      year        : dates.getFullYear(),
      isLoading   : true
    }
  }

  componentDidMount = () => {
    this.timerHandle = setTimeout(() => {
      this._getData();
    },0);
  }

  componentWillUnmount = () => {
    if (this.timerHandle) {
      clearTimeout(this.timerHandle);
      this.timerHandle = 0;
    }
  }

  _onRefresh = () => {
    this.setState({
      isRefresh  : true,
      valSearch  : ''
    }, () => {
      this._getData();
    });
  }

  _getData = () => {
    request({
      'model'     : 'all_model',
      'key'       : 'get_laporan',
      'table'     : '-',
      'where'     : {
        'user_id' : this.props.state.user.user_id,
        'bulan'   : this.state.month,
        'tahun'   : this.state.year,
      },
    }).then((res) => {
      this.setState({
        isLoading   : false,
        isRefresh   : false,
        isProcess   : false,
        data        : res.data,
        owner       : res.owner
      });
    }).catch((error) => {
      this.setState({isLoading : false, isRefresh : false});
    });
  }

  render() {
    return (
      <Container>
        <Header navigation={this.props.navigation} params={{
          center : t('pLaporan'),
          preHapus : this._preHapus,
          isBack : true,
          right  : this._right
        }}/>
        <Layout style={layout.container}>
          {
            (this.state.isLoading) ?
            (
              <View style={layout.spinner}>
                <Spinner/>
              </View>
            ) :
              (
                <FlatList
                  data={this.state.data}
                  renderItem={this.renderItem}
                  refreshControl={
                     <RefreshControl refreshing={this.state.isRefresh} onRefresh={this._onRefresh} />
                  }
                  contentContainerStyle={(this.state.data?.length > 0) ? null : layout.container}
                  ListEmptyComponent={<Empty />}
                  ListHeaderComponent={this._renderHeader}
                  onEndReachedThreshold={0.1}
                />
              )
          }
          {
            (this.props.state.user.role == '1') &&
            <ActionButton onPress={() => this._print()} buttonColor={layout.btnFloating} renderIcon={() => <Icon style={{width: 20, height : 20, color: '#fff'}} name="download-outline" />}/>
          }
        </Layout>

        <Process visible={this.state.isProcess}/>
        {this.state.show && (
          <MonthPicker
            onChange={this._onValueChange}
            value={this.state.date}
            minimumDate={new Date(2000, 0)}
            maximumDate={new Date()}
            locale="id"
          />
        )}
      </Container>
    )
  }
  
  _right = () => (
    <Button size='tiny' onPress={this._listTransaksi}>Detail Laporan</Button>
  )

  _print = async () => {
    // return console.warn(this.state.data);
    
      let fileName = 'Laporan '+this._month(this.state.month)+' '+this.state.year;
      let period   = 'FOR THE PERIOD '+this._month(this.state.month).toUpperCase()+', '+this.state.year;
      
      if (Platform.OS === "android") {
        const permissionGranted = await this.fRequestAndroidPermission(); 
        if (!permissionGranted) {
          console.log("access was refused")
          return; 
        }
      }
      request({
        'model'     : 'all_model',
        'key'       : 'get_pdf_laporan',
        'table'     : '-',
        'where'     : {
          'data'     : this.state.data,
          'fileName' : fileName+'.pdf',
          'period'   : period,
          'user_id'  : this.props.state.user.user_id,
        },
      }).then((res) => {
        let dirs = RNFetchBlob.fs.dirs;
        RNFetchBlob.config({
          trusty    : true,
          overwrite : true,
          addAndroidDownloads : {
            useDownloadManager : true,
            notification : false,
            path : dirs.DownloadDir+'/Kostzy/Laporan/'+fileName+'.pdf'
          }
        }).fetch('GET', res.data, {
        }).then((res) => {
          Toast.show('Laporan Berhasil di Download', Toast.SHORT)
        })

      }).catch((error) => {
        this.setState({isLoading : false, isRefresh : false});
      });
  }

  fRequestAndroidPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "Permintaan Izin",
          message: "Koszy membutuhkan akses ke penyimpanan Anda sehingga Anda dapat menyimpan file ke perangkat Anda.",
          buttonNeutral: "Tanya lagi nanti",
          buttonNegative: "Batal",
          buttonPositive: "Izinkan"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("permission is granted");
        return true; 
      } else {
        console.log("permission denied");
        return false; 
      }
    } catch (err) {
      console.error("fRequestAndroidPermission error:", err);
      return false; 
    }
  };

  _onValueChange = (event, newDate) => {
    let month = new Date(newDate).getMonth()+1;
    let year  = new Date(newDate).getFullYear();
    switch (event) {
      case 'dateSetAction':
        this.setState({
          date       : new Date(newDate),
          show       : false,
          isProcess  : true,
          month      : month,
          year       : year
        }, () => {
          this._getData();
        });
        break;
      case 'dismissedAction':
        this.setState({ show : false });
        break;
      default:

    }
  }

  _renderHeader = () => {
    return (
      <Layout>
        <TouchableOpacity onPress={this._changeMonth} style={{paddingHorizontal : 16, paddingVertical : 16, flexDirection : 'row', justifyContent : 'space-between'}} activeOpacity={0.9}>
          <Text style={layout.bold}>Periode Laporan</Text>
          <View style={{flexDirection : 'row', alignItems : 'center'}}>
            <Text style={layout.bold} status="primary">{this._month(this.state.month)+', '+this.state.year}</Text>
            <IconAll name="edit-2-outline"/>
          </View>
        </TouchableOpacity>
      </Layout>
    )
  }

  _changeMonth = () => {
    this.setState({show : !this.state.show});
  }

  _listTransaksi = () => {
    this.props.navigation.push('GoTo', {
      page   : 'ListTransaksi',
      params : {
        'bulan' : this.state.month,
        'tahun' : this.state.year,
      }
    });
  }

  renderItem = ({ item, index }) => {
    return (
      <View style={{paddingHorizontal : 16, marginBottom : 16}}>
        {
          (!item.isSingle) ?
          (
            <>
              <Text style={layout.bold}>{item.title}</Text>
              {
                item.data.map((val, key) => (
                  <View key={key} style={[{paddingVertical : 6, flexDirection : 'row', alignItems: 'center', justifyContent : 'space-between'}, (val.is_total ? {borderTopWidth : 1, borderColor : '#d0d0d0'} : null)]}>
                    <Text style={(val.is_total) ? layout.bold : null}>{val.tipe}</Text>
                    <Text style={(val.is_total) ? layout.bold : null}>{val.nominal}</Text>
                  </View>
                ))
              }
            </>
          ) : (
            <View style={{flexDirection : 'row', alignItems: 'center', justifyContent : 'space-between'}}>
              <Text style={layout.bold}>{item.title}</Text>
              <Text style={layout.bold}>{item.data}</Text>
            </View>
          )
        }
      </View>
    )
  }

  _month = (month) => {
    month = month -1;
    let data = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    return data[month];
  }

}

const mapStateToProps = state => ({state: state});
export default connect(mapStateToProps)(Laporan);
