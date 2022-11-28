import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import { Container, Header, ListItem, Button } from '../../theme';
import { Layout, Text, Icon, BottomNavigation } from '@ui-kitten/components';
import { connect } from 'react-redux';
import t from '../../lang';
import layout from '../../theme/styles/layout';
import styles from '../../theme/styles/styles';
import { formatCur } from '../../func';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';

const IconAll = (data) => {
  return (
    <Icon style={data.style} name={data.name} />
  )
}

class Kamar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isProcess     : false,
      data          : this.props.params.data,
      jumlah_lantai : this.props.params.jumlah_lantai,
      data_kamar    : [],
      edit          : [],
      hapus_kamar   : this.props.params.hapus_kamar,
      menuAct       : []
    }

  }

  componentDidMount = () => {
    if (this.props.state.user.role == '3') {
      this.setState({
        menuAct : [
          <Text status='danger'>{t('bClose')}</Text>,
          <ListItem
            title={t('aEdit')}
            descriptionStyle={layout.regular}
            onPress={this._edit}
            accessoryLeft={<IconAll style={styles.iconList} name='edit-2-outline'/>}
          />
        ]
      })
    } else {
      this.setState({
        menuAct : [
          <Text status='danger'>{t('bClose')}</Text>,
          <ListItem
            title={t('aEdit')}
            descriptionStyle={layout.regular}
            onPress={this._edit}
            accessoryLeft={<IconAll style={styles.iconList} name='edit-2-outline'/>}
          />,
          <ListItem
            title={t('aHapus')}
            descriptionStyle={layout.regular}
            onPress={this._hapus}
            accessoryLeft={<IconAll style={styles.iconList} name='trash-2-outline'/>}
          />
        ]
      })
    }
  }

  render() {
    return (
      <Container>
        <Header navigation={this.props.navigation} params={{
          center : t('pKamar'),
          isBack : true,
          right  : (this.props.state.user.role == '3') ? null : this._right
        }}/>
        <Layout style={[layout.container, styles.containerInner]}>
          <View style={styles.containerList}>
            <FlatList
              data={this.state.data}
              renderItem={this._renderItem}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </Layout>

        <BottomNavigation style={{paddingHorizontal: 20}} appearance="noIndicator">
          <Button style={{marginVertical : 10}} onPress={this._onSubmit} disabled={(this.state.data.length > 0) ? false : true}>{t('bSubmit')}</Button>
        </BottomNavigation>
        <ActionSheet
          ref={o => this.menuSheet = o}
          title={<View style={layout.actionSheetHeader}></View>}
          options={this.state.menuAct}
          styles={layout.actionSheet}
          cancelButtonIndex={0}
        />
      </Container>
    )
  }
  // render
  _renderItem = ({item, index}) => {
    return(
      <TouchableOpacity style={{flexDirection: 'row', marginVertical: 5}} onPress={() => this._renderMenu(item, index)}>
        <Image
          style={{ width: 110, height: 100, borderRadius: 18}}
          source={{
            uri: (item.gambar_link[0]) ? item.gambar_link[0] : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
          }}
        />
        <View style={[styles.containerItem, {marginLeft : 10, marginVertical: 5}]}>
          <View>
            <Text numberOfLines={1} style={[layout.bold]}>{'Kamar '+item.nomor_kamar}</Text>
            <View style={[styles.containerCoin, styles.iconTextHome]}>
              <IconAll style={styles.iconKamar} name="pricetags-outline"/>
              <Text numberOfLines={1} category="s2" appearance="hint" style={layout.bold}>{formatCur({value:item.harga_kamar.split('.').join(''), input:false})+'/Month'}</Text>
            </View>
            <View style={[styles.containerCoin, styles.iconTextHome]}>
              <IconAll style={styles.iconKamar} name="home-outline"/>
              <Text category="c2" appearance="hint" numberOfLines={1} style={styles.listDesc}>{item.value_lantai}</Text>
            </View>
            <View style={[styles.containerCoin, styles.iconTextHome]}>
              <IconAll style={styles.iconKamar} name="clipboard-outline"/>
              <Text numberOfLines={1} category="c2" appearance="hint">{item.value_kamar}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  // render
  _renderMenu = (item, index) => {
    this.setState({ edit : item, id : index })
    this.menuSheet.show();
  }
  // end render

  // page
  _right = () => (
    <Button size='tiny' onPress={this._tambah}>Tambah</Button>
  )

  _tambah = () => {
    this.menuSheet.hide();
    this.props.navigation.push('GoTo', {
      page : 'TambahKamar',
      params : {
        data_kamar    : this.state.data,
        jumlah_lantai : this.state.jumlah_lantai,
        action        : this._onAction
      }
    });
  }

  _edit = () => {
    this.menuSheet.hide();
    this.props.navigation.push('GoTo', {
      page : 'TambahKamar',
      params : {
        id            : this.state.id,
        jumlah_lantai : this.state.jumlah_lantai,
        data          : this.state.edit,
        data_kamar    : this.state.data_kamar,
        action        : this._onAction
      }
    });
  }

  _hapus = () => {
    this.menuSheet.hide();
    let data = [];
    this.state.data.map((item, index) => {
      if (index != this.state.id) {
        data.push(item);
      } else {
        if (item.kamar_id) {
          this.setState({ hapus_kamar : [...this.state.hapus_kamar, item.kamar_id] })
        }
      }
    })
    this.setState({ data : data });
  }
  // end page

  // proses
  _onAction = (params, id, data, data_kamar) => {
    if (id >= 0) {
      let dataEdit  = [];
      let dataKamar = [];
      this.state.data.map((item, index) => {
        if (id == index) {
          dataEdit.push(params);
        }else {
          dataEdit.push(this.state.data[index]);
        }
      })

      this.setState({ data : dataEdit, data_kamar : dataKamar });
    }else {
      this.setState({ data : [...this.state.data, params], data_kamar : [...this.state.data_kamar, data_kamar] });
    }
    this.props.navigation.pop();
  }

  _onSubmit = () => {
    this.props.params.action(this.state.data, this.state.hapus_kamar);
  }

  // end proses

}

const mapStateToProps = state => ({state: state});
const mapDispatchToProps = dispatch => ({

});
export default connect(mapStateToProps, mapDispatchToProps)(Kamar);
