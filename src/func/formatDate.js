import moment from 'moment';
import 'moment/locale/id'

const formatDate = (params) => {
  moment.locale('id');
  if (params.date) {
    if (params.time) {
      var split = params.date.split(/\D/);
      var date  = new Date(split[0], --split[1], split[2], split[3], split[4]);
      return moment(date).format(((params.format) ? params.format : 'DD MMMM YYYY HH:mm'));
    }else {
      return moment(new Date(params.date)).format(((params.format) ? params.format : 'DD MMMM YYYY'));
    }
  }else {
    return moment(new Date(params.date)).format(((params.format) ? params.format : 'DD MMMM YYYY'));
  }

};

export default formatDate;
