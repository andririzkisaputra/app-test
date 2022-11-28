import { save, logout } from '../../bridge/storage';
import { DEFAULT_DB_USER } from '../../config';
import OneSignal from 'react-native-onesignal';
import * as types from './const_actions';

const currentUser = {
  user_id             : '',
  nama                : '',
  email               : '',
  user_img            : '',
  user_img_preview    : '',
  notelp              : '',
  birthday            : '',
  pekerjaan           : '',
  nama_darurat_satu   : '',
  notelp_darurat_satu : '',
  nama_darurat_dua    : '',
  notelp_darurat_dua  : '',
  gambar              : '',
  alamat              : '',
  code                : '',
  role                : '',
  gender              : '',
  is_active           : '',
  is_verif_email      : '',
  created_on          : '',
  modified_on         : '',
  isLogin             : false,
};

export default reducerUser = (state = currentUser, action) => {
    switch (action.type) {
      case types.USER_SET:
        if (action.params) {
          state = action.params;
        }
        OneSignal.sendTags({
          'user_id' : state.user_id,
          'is_login': 1
        });
        save({table : DEFAULT_DB_USER, data : state});
        return {
          ...state,
          isLogin : ((action.params) ? true : false)
        }


      case types.USER_UPDATE:
        if (!action.params.length) {
          state[action.params.key] = action.params.value;
        }else {
          for (var i = 0; i < action.params.length; i++) {
            state[action.params[i].key] = action.params[i].value;
          }
        }
        save({table : DEFAULT_DB_USER, data : state});
        return {
          ...state
        }

      case types.LOGOUT:
        logout();
        return {
          ...state,
          isLogin : false
        }

      default:
      return state;
    }
}
