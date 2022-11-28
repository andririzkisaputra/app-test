const validator = (params) => {
  switch (params.type) {
    case 'email':
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (re.test(params.value)) {
        return true;
      }
      break;
    case 'angka':
      let reg = /^[0-9]+$/;
      if (reg.test(params.value)) {
        return true;
      }
      break;
    default:
  }

  return false;
};

export default validator;
