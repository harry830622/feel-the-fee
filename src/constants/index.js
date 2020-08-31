export const symbolByCurrency = {
  usd: '$',
  twd: 'NT$',
  hkd: 'HK$',
  cny: '¥',
  jpy: '¥',
  sgd: '$',
  gbp: '£',
  eur: '€',
  cad: '$',
  aud: '$',
  thb: '฿',
  vnd: '₫',
  inr: '₹',
  krw: '₩',
  eth: 'Ξ',
  btc: '₿',
};

export const methodsByContractName = {
  yearn__vault__yCrv: ['deposit', 'withdraw'],
  curve__pool__y: ['add_liquidity', 'remove_liquidity'],
  curveDao__gauge__yCrv: ['deposit', 'withdraw'],
  curveDao__minter: ['mint'],
  uniswap__router: [
    'swapExactETHForTokens',
    'addLiquidityETH',
    'removeLiquidityETH',
  ],
  weth: ['transfer', 'approve'],
  usdt: ['transfer', 'approve'],
  dai: ['transfer', 'approve'],
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

export const textByCategory = {
  general: 'General',
  uniswap: 'Uniswap',
  yearn: 'yEarn',
  curve: 'Curve',
  curveDao: 'CurveDAO',
};

export const textByTxTypeByCategory = {
  general: {
    eth__transfer: 'Transfer ETH',
    [txTypeByMethodByContractName.weth.transfer]: 'Transfer WETH',
    [txTypeByMethodByContractName.usdt.transfer]: 'Transfer USDT',
    [txTypeByMethodByContractName.dai.transfer]: 'Transfer DAI',
    [txTypeByMethodByContractName.weth.approve]: 'Approve WETH to be spent',
    [txTypeByMethodByContractName.usdt.approve]: 'Approve USDT to be spent',
    [txTypeByMethodByContractName.dai.approve]: 'Approve DAI to be spent',
  },
  uniswap: {
    [txTypeByMethodByContractName.uniswap__router.swapExactETHForTokens]:
      'Swap tokens',
    [txTypeByMethodByContractName.uniswap__router.addLiquidityETH]:
      'Add liquidity',
    [txTypeByMethodByContractName.uniswap__router.removeLiquidityETH]:
      'Remove liquidity',
  },
  yearn: {
    [txTypeByMethodByContractName.yearn__vault__yCrv.deposit]:
      'Deposit to yCRV vault',
    [txTypeByMethodByContractName.yearn__vault__yCrv.withdraw]:
      'Withdraw from yCRV vault',
  },
  curve: {
    [txTypeByMethodByContractName.curve__pool__y.add_liquidity]:
      'Deposit to Y pool',
    [txTypeByMethodByContractName.curve__pool__y.remove_liquidity]:
      'Withdraw from Y pool',
  },
  curveDao: {
    [txTypeByMethodByContractName.curveDao__gauge__yCrv.deposit]:
      'Deposit to yCRV gauge',
    [txTypeByMethodByContractName.curveDao__gauge__yCrv.withdraw]:
      'Withdraw from yCRV gauge',
    [txTypeByMethodByContractName.curveDao__minter.mint]:
      'Claim CRV from minter',
  },
};

export const textBySpeed = {
  instant: 'Instant',
  fast: 'Fast',
  standard: 'Standard',
  slow: 'Slow',
};

export const waitTimeTextBySpeed = {
  instant: '≈ 15 Sec.',
  fast: '≈ 1 Min.',
  standard: '≈ 5 Min.',
  slow: '> 10 Min.',
};
