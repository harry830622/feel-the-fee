export const symbolByCurrency = {
  usd: '$',
  twd: 'NT$',
  hkd: 'HK$',
  cny: '¥',
  jpy: '¥',
  sgd: '$',
  gbp: '£',
  eur: '€',
  rub: '₽',
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
  yearn__vault__weth: ['deposit', 'withdraw'],
  yearn__vault__yfi: ['deposit', 'withdraw'],
  yearn__vault__yBCrv: ['deposit', 'withdraw'],
  yearn__vault__crvRenWSBtc: ['deposit', 'withdraw'],
  yearn__vault__dai: ['deposit', 'withdraw'],
  yearn__vault__tusd: ['deposit', 'withdraw'],
  yearn__vault__usdc: ['deposit', 'withdraw'],
  yearn__vault__usdt: ['deposit', 'withdraw'],
  yearn__vault__aLink: ['deposit', 'withdraw'],
  curve__pool__y: ['add_liquidity', 'remove_liquidity'],
  curve__pool__compound: ['add_liquidity', 'remove_liquidity'],
  curve__pool__pax: ['add_liquidity', 'remove_liquidity'],
  curve__pool__bUsd: ['add_liquidity', 'remove_liquidity'],
  curve__pool__sUsd: ['add_liquidity', 'remove_liquidity'],
  curve__pool__renBtc: ['mintThenDeposit', 'removeLiquidityThenBurn'],
  curve__pool__sBtc: ['mintThenDeposit', 'removeLiquidityThenBurn'],
  curveDao__gauge__yCrv: ['deposit', 'withdraw'],
  curveDao__gauge__cCrv: ['deposit', 'withdraw'],
  curveDao__gauge__yBCrv: ['deposit', 'withdraw'],
  curveDao__gauge__crvPlain3AndSUsd: ['deposit', 'withdraw'],
  curveDao__gauge__yPaxCrv: ['deposit', 'withdraw'],
  curveDao__gauge__crvRenWBtc: ['deposit', 'withdraw'],
  curveDao__gauge__crvRenWSBtc: ['deposit', 'withdraw'],
  curveDao__minter: ['mint'],
  uniswap__router: [
    'swapExactETHForTokens',
    'addLiquidityETH',
    'removeLiquidityETH',
  ],
  sushiswap__pool: ['deposit', 'withdraw'],
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
  sushiswap: 'SushiSwap',
  yearn: 'yEarn',
  curve: 'Curve',
  curveDao: 'CurveDAO',
};

export const defaultCategory = 'sushiswap';

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
  sushiswap: {
    [txTypeByMethodByContractName.sushiswap__pool.deposit]:
      'Stake to farm $SUSHI',
    [txTypeByMethodByContractName.sushiswap__pool.withdraw]: 'Unstake',
  },
  yearn: {
    [txTypeByMethodByContractName.yearn__vault__yCrv.deposit]:
      'Deposit to curve.fi/y LP vault',
    [txTypeByMethodByContractName.yearn__vault__yCrv.withdraw]:
      'Withdraw from curve.fi/y LP vault',
    [txTypeByMethodByContractName.yearn__vault__weth.deposit]:
      'Deposit to WETH vault',
    [txTypeByMethodByContractName.yearn__vault__weth.withdraw]:
      'Withdraw from WETH vault',
    [txTypeByMethodByContractName.yearn__vault__yfi.deposit]:
      'Deposit to yearn.finance vault',
    [txTypeByMethodByContractName.yearn__vault__yfi.withdraw]:
      'Withdraw from yearn.finance vault',
    [txTypeByMethodByContractName.yearn__vault__ybCrv.deposit]:
      'Deposit to curve.fi/busd LP vault',
    [txTypeByMethodByContractName.yearn__vault__ybCrv.withdraw]:
      'Withdraw from curve.fi/busd LP vault',
    [txTypeByMethodByContractName.yearn__vault__crvRenWSBtc.deposit]:
      'Deposit to curve.fi/sbtc LP vault',
    [txTypeByMethodByContractName.yearn__vault__crvRenWSBtc.withdraw]:
      'Withdraw from curve.fi/sbtc LP vault',
    [txTypeByMethodByContractName.yearn__vault__dai.deposit]:
      'Deposit to DAI vault',
    [txTypeByMethodByContractName.yearn__vault__dai.withdraw]:
      'Withdraw from DAI vault',
    [txTypeByMethodByContractName.yearn__vault__tusd.deposit]:
      'Deposit to TUSD vault',
    [txTypeByMethodByContractName.yearn__vault__tusd.withdraw]:
      'Withdraw from TUSD vault',
    [txTypeByMethodByContractName.yearn__vault__usdc.deposit]:
      'Deposit to USD Coin vault',
    [txTypeByMethodByContractName.yearn__vault__usdc.withdraw]:
      'Withdraw from USD Coin vault',
    [txTypeByMethodByContractName.yearn__vault__usdt.deposit]:
      'Deposit to USDT vault',
    [txTypeByMethodByContractName.yearn__vault__usdt.withdraw]:
      'Withdraw from USDT vault',
    [txTypeByMethodByContractName.yearn__vault__aLink.deposit]:
      'Deposit to aLink vault',
    [txTypeByMethodByContractName.yearn__vault__aLink.withdraw]:
      'Withdraw from aLink vault',
  },
  curve: {
    [txTypeByMethodByContractName.curve__pool__y.add_liquidity]:
      'Deposit to Y pool',
    [txTypeByMethodByContractName.curve__pool__y.remove_liquidity]:
      'Withdraw from Y pool',
    [txTypeByMethodByContractName.curve__pool__compound.add_liquidity]:
      'Deposit to Compound pool',
    [txTypeByMethodByContractName.curve__pool__compound.remove_liquidity]:
      'Withdraw from Compound pool',
    [txTypeByMethodByContractName.curve__pool__pax.add_liquidity]:
      'Deposit to PAX pool',
    [txTypeByMethodByContractName.curve__pool__pax.remove_liquidity]:
      'Withdraw from PAX pool',
    [txTypeByMethodByContractName.curve__pool__bUsd.add_liquidity]:
      'Deposit to BUSD pool',
    [txTypeByMethodByContractName.curve__pool__bUsd.remove_liquidity]:
      'Withdraw from BUSD pool',
    [txTypeByMethodByContractName.curve__pool__sUsd.add_liquidity]:
      'Deposit to sUSD pool',
    [txTypeByMethodByContractName.curve__pool__sUsd.remove_liquidity]:
      'Withdraw from sUSD pool',
    [txTypeByMethodByContractName.curve__pool__renBtc.mintThenDeposit]:
      'Deposit to renBTC pool',
    [txTypeByMethodByContractName.curve__pool__renBtc.removeLiquidityThenBurn]:
      'Withdraw from renBTC pool',
    [txTypeByMethodByContractName.curve__pool__sBtc.mintThenDeposit]:
      'Deposit to sBTC pool',
    [txTypeByMethodByContractName.curve__pool__sBtc.removeLiquidityThenBurn]:
      'Withdraw from sBTC pool',
  },
  curveDao: {
    [txTypeByMethodByContractName.curveDao__gauge__yCrv.deposit]:
      'Deposit to y Liquidity gauge',
    [txTypeByMethodByContractName.curveDao__gauge__yCrv.withdraw]:
      'Withdraw from y Liquidity gauge',
    [txTypeByMethodByContractName.curveDao__gauge__cCrv.deposit]:
      'Deposit to compound Liquidity gauge',
    [txTypeByMethodByContractName.curveDao__gauge__cCrv.withdraw]:
      'Withdraw from compound Liquidity gauge',
    [txTypeByMethodByContractName.curveDao__gauge__yBCrv.deposit]:
      'Deposit to busd Liquidity gauge',
    [txTypeByMethodByContractName.curveDao__gauge__yBCrv.withdraw]:
      'Withdraw from busd Liquidity gauge',
    [txTypeByMethodByContractName.curveDao__gauge__crvPlain3AndSUsd.deposit]:
      'Deposit to susdv2 Liquidity gauge',
    [txTypeByMethodByContractName.curveDao__gauge__crvPlain3AndSUsd.withdraw]:
      'Withdraw from susdv2 Liquidity gauge',
    [txTypeByMethodByContractName.curveDao__gauge__yPaxCrv.deposit]:
      'Deposit to pax Liquidity gauge',
    [txTypeByMethodByContractName.curveDao__gauge__yPaxCrv.withdraw]:
      'Withdraw from pax Liquidity gauge',
    [txTypeByMethodByContractName.curveDao__gauge__crvRenWBtc.deposit]:
      'Deposit to ren Liquidity gauge',
    [txTypeByMethodByContractName.curveDao__gauge__crvRenWBtc.withdraw]:
      'Withdraw from ren Liquidity gauge',
    [txTypeByMethodByContractName.curveDao__gauge__crvRenWSBtc.deposit]:
      'Deposit to sbtc Liquidity gauge',
    [txTypeByMethodByContractName.curveDao__gauge__crvRenWSBtc.withdraw]:
      'Withdraw from sbtc Liquidity gauge',
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

export const textByPeriod = {
  '24h': '24h',
};
