import React, { PureComponent } from 'react';
import { View } from 'react-native';

const IMPORT_COMPONENT = {
  'Search'                  : require('../pages/search').default,
  'InfoDetail'              : require('../pages/info/detail').default,
  'TambahInfo'              : require('../pages/info/tambahInfo').default,
  'DetailInfo'              : require('../pages/info/detailInfo').default,
  'KosDetail'               : require('../pages/home/kosDetail').default,
  'Notif'                   : require('../pages/notif').default,
  'Register'                : require('../pages/auth/register').default,
  'LupaKataSandi'           : require('../pages/auth/lupaKataSandi').default,
  'Login'                   : require('../pages/auth').default,
  'TambahProperti'          : require('../pages/properti/tambahProperti').default,
  'TambahKamar'             : require('../pages/properti/tambahKamar').default,
  'UbahKamar'               : require('../pages/properti/ubahKamar').default,
  'TambahManager'           : require('../pages/properti/tambahManager').default,
  'Kamar'                   : require('../pages/properti/kamar').default,
  'InfoBersih'              : require('../pages/properti/infoBersih').default,
  'PeraturanKos'            : require('../pages/properti/peraturanKos').default,
  'InfoPenyewa'             : require('../pages/properti/infoPenyewa').default,
  'Properti'                : require('../pages/properti').default,
  'PreSewa'                 : require('../pages/sewa/preSewa').default,
  'Pembayaran'              : require('../pages/sewa/pembayaran').default,
  'GantiKamar'              : require('../pages/sewa/gantiKamar').default,
  'PeraturanSewa'           : require('../pages/sewa/peraturanSewa').default,
  'EditProfile'             : require('../pages/profile/editProfile').default,
  'KamarKu'                 : require('../pages/profile/kamarKu').default,
  'DetailSewa'              : require('../pages/profile/detailSewa').default,
  'TagihanDetail'           : require('../pages/profile/tagihanDetail').default,
  'DetailProfile'           : require('../pages/profile/detailProfile').default,
  'KomplainUserProses'      : require('../pages/profile/komplainUserProses').default,
  'KomplainUser'            : require('../pages/profile/komplainUser').default,
  'BuktiBayar'              : require('../pages/profile/buktiBayar').default,
  'BuktiBayarProses'        : require('../pages/profile/buktiBayarProses').default,
  'BuktiBayarOwner'         : require('../pages/profile/buktiBayarOwner').default,
  'Tagihan'                 : require('../pages/profile/buktiBayarOwner').default,
  'Pengaturan'              : require('../pages/profile/pengaturan').default,
  'Bantuan'                 : require('../pages/profile/bantuan').default,
  'Tentang'                 : require('../pages/profile/tentang').default,
  'TentangTab'              : require('../pages/profile/tentangTab').default,
  'Adjustment'              : require('../pages/adjustment').default,
  'TambahAdjustment'        : require('../pages/adjustment/tambahAdjustment').default,
  'TambahPengeluaran'       : require('../pages/pengeluaran/tambahPengeluaran').default,
  'PengeluaranUser'         : require('../pages/pengeluaran').default,
  'Pemasukan'               : require('../pages/pemasukan').default,
  'Laporan'                 : require('../pages/laporan').default,
  'ListTransaksi'           : require('../pages/laporan/listTransaksi').default,
  'Zoom'                    : require('../components/zoom').default,
}

class GoTo extends PureComponent {

  constructor(props) {
    super(props);
    this.params = this.props.route.params;
  }

  render() {
    const Component = IMPORT_COMPONENT[this.params.page];
    return (<Component navigation={this.props.navigation} params={this.params.params} />);
  }

}

export default GoTo;
