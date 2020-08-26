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

export const methodsByContractName = {
  yearn__vault__yCrv: ['deposit', 'withdraw'],
  curve__pool__y: ['add_liquidity', 'remove_liquidity'],
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
};
