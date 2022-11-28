import * as types from './const_actions';

export const userUpdate         = params => ({ type: types.USER_UPDATE, params });
export const userSet            = params => ({ type: types.USER_SET, params });
export const logOut             = () => ({ type: types.LOGOUT });
export const setReload          = params => ({ type: types.SET_RELOAD, params });
