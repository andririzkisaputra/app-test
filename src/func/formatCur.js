import currencyFormatter from 'currency-formatter';

const formatCur = (params) => {
  if (!params.input) {
    return currencyFormatter.format(params.value, {
                                                    code: ((params.code) ? params.code : 'Rp'),
                                                    symbol: ((params.symbol) ? params.symbol : 'Rp')+' ',
                                                    thousand : '.',
                                                    precision   : 0
                                                  }
                                    ) +((params.negasi) ? ',-' : '');
  }else {
    return currencyFormatter.format(params.value, {
                                                    code: ((params.code) ? params.code : 'Rp'),
                                                    symbol: '',
                                                    thousand : '.',
                                                    precision   : 0
                                                  }
                                    );
  }
};

export default formatCur;
