import I18n from 'react-native-i18n';
// import { get } from '../service/localDb';
// import { DEFAULT_DB_LANG } from '../config';
import en from './en';
import id from './id';

I18n.fallbacks     = true;
I18n.translations  = { en, id};
I18n.defaultLocale = "id";

export default t = (lang, params) => {

  // get({table : DEFAULT_DB_LANG}).then((data) => {
  //   I18n.locale = data;
  // });

  return I18n.t(lang, params);
};
