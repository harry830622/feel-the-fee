export const symbolByCurrency = {
  eth: 'Ξ',
  btc: '₿',
  twd: 'NT$',
  usd: '$',
  cad: '$',
  aud: '$',
  cny: '¥',
  jpy: '¥',
  sgd: '$',
  thb: '฿',
  vnd: '₫',
  eur: '€',
  gbp: '£',
  inr: '₹',
  krw: '₩',
  hkd: 'HK$',
};

// TODO: Move it to backend so that we don't need to update frontend code just
// for adding a new txType
export const methodsByContractName = {
  yearn__vault__yCrv: ['deposit', 'withdraw'],
  curve__pool__y: ['add_liquidity', 'remove_liquidity'],
  curveDao__gauge__yCrv: ['deposit', 'withdraw'],
  curveDao__minter: ['mint'],
};

export const txTypeByMethodByContractName = Object.entries(
  methodsByContractName,
).reduce(
  (prev, [contractName, methods]) => ({
    ...prev,
    [contractName]: methods.reduce(
      (pprev, method) => ({
        ...pprev,
        [method]: `${contractName}__${method}`,
      }),
      {},
    ),
  }),
  {},
);

export const contractNameAndMethodByTxType = Object.entries(
  txTypeByMethodByContractName,
).reduce(
  (prev, [contractName, txTypeByMethod]) => ({
    ...prev,
    ...Object.entries(txTypeByMethod).reduce(
      (pprev, [method, txType]) => ({
        ...pprev,
        [txType]: [contractName, method],
      }),
      {},
    ),
  }),
  {},
);

export const textByTxType = {
  transfer: 'Transfer',
  [txTypeByMethodByContractName.yearn__vault__yCrv.deposit]:
    'Deposit to Yearn yCRV vault',
  [txTypeByMethodByContractName.yearn__vault__yCrv.withdraw]:
    'Withdraw from Yearn yCRV vault',
  [txTypeByMethodByContractName.curve__pool__y.add_liquidity]:
    'Deposit to Curve Y pool',
  [txTypeByMethodByContractName.curve__pool__y.remove_liquidity]:
    'Withdraw from Curve Y pool',
  [txTypeByMethodByContractName.curveDao__gauge__yCrv.deposit]:
    'Deposit to CurveDAO yCRV gauge',
  [txTypeByMethodByContractName.curveDao__gauge__yCrv.withdraw]:
    'Withdraw to CurveDAO yCRV gauge',
  [txTypeByMethodByContractName.curveDao__minter.mint]:
    'Claim CRV from CurveDAO Minter',
};

export const textBySpeed = {
  fast: 'Fast',
  average: 'Average',
  safeLow: 'Slow',
};
