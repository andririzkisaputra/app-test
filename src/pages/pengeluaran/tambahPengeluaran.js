import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { Container, Header, Process } from '../../theme';
import { Layout, Text, BottomNavigation, Icon, Button, Input, Select, SelectItem, Datepicker, Spinner } from '@ui-kitten/components';
import { connect } from 'react-redux';
import { formatCur } from '../../func';
import { request } from '../../bridge';
import Toast from 'react-native-simple-toast';
import layout from '../../theme/styles/layout';
import styles from '../../theme/styles/styles';
import t from '../../lang';

const IconAll = (name) => {
  return (
    <Icon style={{width: 35, color: '#8F9BB3'}} name={name.name} />
  )
}

class TambahPengeluaran extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading     : false,
      isProcess     : false,
      data          : [],
      k_pengeluaran : [],
      kategori_sel  : this.props.params?.data?.kategori,
      jumlah        : this.props.params?.data?.jumlah,
      keterangan    : this.props.params?.data?.keterangan,
      qty           : this.props.params?.data?.qty,
      tanggal       : (this.props.params?.data?.tanggal) ? new Date(this.props.params?.data?.tanggal) : new Date(),
      pengeluaran_id: this.props.params?.data?.pengeluaran_id,
      total         : this.props.params?.data?.total,
    }
  }

  componentDidMount = () => {
    this._getData();
  }

  _getData = () => {
    this.setState({isLoading : true}, () => {
      request({
        'model'     : 'all_model',
        'key'       : 'get_pengeluaran_need',
        'table'     : '-',
        'where'     : {
          'created_by' : this.props.state.user.user_id
        }
      }).then((res) => {
        this.setState({
          data          : res.data,
          k_pengeluaran : res.data.kategori_pengeluaran,
          isLoading     : false,
          isProcess     : false
        });
      }).catch((error) => {
        this.setState({isLoading : false, isProcess : false});
      });
    })
  }

  render() {
    return (
      <Container>
        <Header navigation={this.props.navigation} params={{
          center : (this.props.params.edit) ? t('pEditPengeluaran') : t('pTambahPengeluaran'),
          isBack : true,
        }}/>
        <Layout style={layout.container}>

          {
            (this.state.isLoading) ?
            (
              <View style={layout.spinner}>
                <Spinner/>
              </View>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                { this._renderContainer() }
              </ScrollView>
            )
          }
        </Layout>
        <Process visible={this.state.isProcess}/>
      </Container>
    )
  }

  _renderContainer = () => {
    return (
      <View style={styles.containerInner}>

        <Datepicker
          accessoryRight={() =>
            <IconAll name='calendar-outline'/>
          }
          min={new Date('1930')}
          style={styles.registerInput}
          placeholder={t('iTanggalLahir')}
          date={this.state.tanggal}
          onSelect={this._onChangeTanggal}
          status={(this.state.errTanggal) ? 'danger' : 'basic'}
        />

        <Input
          style={styles.registerInput}
          textStyle={styles.loginTextInput}
          placeholder={'Keterangan'}
          value={this.state.keterangan}
          onChangeText={this._onChangeKeterangan}
          status={(this.state.errKeterangan) ? 'danger' : 'basic'}
          multiline={true}
        />

        <Input
          style={styles.registerInput}
          textStyle={styles.loginTextInput}
          placeholder={'Qty'}
          value={this.state.qty}
          onChangeText={this._onChangeQty}
          status={(this.state.errQty) ? 'danger' : 'basic'}
          keyboardType={'numeric'}
        />

        <Input
          style={styles.registerInput}
          textStyle={styles.loginTextInput}
          placeholder={'Nilai'}
          value={this.state.jumlah}
          onChangeText={this._onChangeJumlah}
          status={(this.state.errJumlah) ? 'danger' : 'basic'}
          keyboardType={'numeric'}
        />

        <Input
          style={styles.registerInput}
          textStyle={styles.loginTextInput}
          placeholder={'Total'}
          value={this.state.total}
          onChangeText={this._onChangeTotal}
          status={(this.state.errTotal) ? 'danger' : 'basic'}
          keyboardType={'numeric'}
        />

        <Select
          accessoryRight={() =>
            <IconAll name='menu-2-outline'/>
          }
          style={styles.registerInput}
          textStyle={styles.loginTextInput}
          value={this.state.kategori_sel?.kategori_pengeluaran}
          placeholder={'Kategori'}
          status={(this.state.errKategori) ? 'danger' : 'basic'}
          onSelect={this.onChangeKategori}>
            {this.state.k_pengeluaran.map(this._renderOption)}
        </Select>

        <Button onPress={this._submit} disabled={!this.state.tanggal || !this.state.keterangan || !this.state.jumlah || !this.state.qty || !this.state.kategori_sel}>Submit</Button>

        {
          (this.props.params.edit) ?
          (
            <Button style={{marginTop : 12}} status="danger" onPress={this._hapus}>Hapus</Button>
          ) : null
        }

      </View>
    )
  }

  _renderOption = (title) => (
      <SelectItem title={title.kategori_pengeluaran}/>
  );

  _hapus = () => {
    this.setState({isProcess : true}, () => {
      request({
        'model' : 'all_model',
        'key'   : 'del_pengeluaran',
        'table' : '-',
        'data'  : {
          'pengeluaran_id': this.state.pengeluaran_id,
        }
      }).then((res) => {
        Toast.show(t((res.success ? 'aSimpanSuccess' : 'aSimpanFail')), Toast.LONG);
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
    });
  }

  _submit = () => {
    this.setState({isProcess : true}, () => {
      request({
        'model' : 'all_model',
        'key'   : 'add_pengeluaran',
        'table' : '-',
        'data'  : {
          'pengeluaran_id': this.state.pengeluaran_id,
          'total'         : this.state.total.split('.').join(''),
          'qty'           : this.state.qty,
          'kategori_id'   : this.state.kategori_sel.kategori_pengeluaran_id,
          'jumlah'        : this.state.jumlah.split('.').join(''),
          'keterangan'    : this.state.keterangan,
          'tanggal'       : this.state.tanggal,
          'created_by'    : this.props.state.user.user_id
        }
      }).then((res) => {
        Toast.show(t((res.success ? 'aSimpanSuccess' : 'aSimpanFail')), Toast.LONG);
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
    });
  }

  _onChangeQty = (text) => {
    this.setState({ qty : text, total : (this.state.jumlah ? (this.state.jumlah * text).toString() : '') })
  }

  _onChangeJumlah = (text) => {
    let hasil = '';
    if (this.state.qty) {
      hasil = (this.state.qty * text.split('.').join('')).toString();
    }
    this.setState({ jumlah : formatCur({value : text.split('.').join(''), input : true}), total : (this.state.qty ? formatCur({value : hasil.split('.').join(''), input : true}) : formatCur({value : text.split('.').join(''), input : true}) ) })
  }

  _onChangeKeterangan = (text) => {
    this.setState({ keterangan : text })
  }

  _onChangeTanggal = (text) => {
    this.setState({ tanggal : text })
  }

  _onChangeTotal = (text) => {
    this.setState({ total : text })
  }

  onChangeKategori = (item) => {
    this.setState({
      kategori_sel : this.state.k_pengeluaran[item.row]
    });
  }

}

const mapStateToProps = state => ({state: state});
const mapDispatchToProps = dispatch => ({

});
export default connect(mapStateToProps, mapDispatchToProps)(TambahPengeluaran);
