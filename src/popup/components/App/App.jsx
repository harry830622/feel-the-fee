/** @jsx jsx */
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { jsx, css } from '@emotion/core';
import {
  Container,
  Grid,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import {
  Settings as SettingsIcon,
  Refresh as RefreshIcon,
} from '@material-ui/icons';

const { ORIGIN } = process.env;

const gasConfigs = [
  {
    key: 'fast',
    title: 'Fast',
  },
  {
    key: 'average',
    title: 'Average',
  },
  {
    key: 'safeLow',
    title: 'Slow',
  },
];

const gasLimitByTxType = {
  transfer: 21000,
};

const symbolByCurrency = {
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

const App = () => {
  const [isFetching, setIsFetching] = useState(true);
  const [gas, setGas] = useState({});
  const [ethPrice, setEthPrice] = useState(0);
  useEffect(() => {
    if (isFetching) {
      axios
        .get(`${ORIGIN}/api/gas/now`)
        .then((res) => {
          setGas(res.data);
        })
        .then(() =>
          axios
            .get(
              `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd`,
            )
            .then((res) => {
              setEthPrice(res.data.ethereum.usd);
            }),
        )
        .then(() => {
          setIsFetching(false);
        });
    }
  }, [isFetching]);

  const handleRefreshClick = useCallback(() => {
    setIsFetching(true);
  }, []);

  return (
    <div
      css={css`
        width: 400px;
      `}
    >
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6">⛽</Typography>
          <div
            css={css`
              flex-grow: 1;
            `}
          />
          <IconButton color="inherit">
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container>
        <main
          css={css`
            padding: 68px 0 20px;
          `}
        >
          <Paper
            variant="outlined"
            css={css`
              padding: 16px;
            `}
          >
            {isFetching ? (
              <Skeleton
                variant="rect"
                animation="wave"
                css={css`
                  height: 100px;
                `}
              />
            ) : (
              <>
                <div
                  css={css`
                    display: flex;
                    align-items: center;
                  `}
                >
                  <div
                    css={css`
                      flex-grow: 0;
                    `}
                  >
                    <Typography variant="subtitle1">
                      A transfer will cost you
                    </Typography>
                  </div>
                  <div
                    css={css`
                      flex-grow: 1;
                      display: flex;
                      flex-direction: row-reverse;
                    `}
                  >
                    <IconButton color="inherit" onClick={handleRefreshClick}>
                      <RefreshIcon />
                    </IconButton>
                  </div>
                </div>
                <Grid container spacing={2}>
                  {gasConfigs.map(({ key, title }) => (
                    <Grid key={key} item xs={4}>
                      <Paper
                        variant="outlined"
                        css={css`
                          display: flex;
                          flex-direction: column;
                          justify-content: center;
                          align-items: center;
                          padding: 10px 5px;
                        `}
                      >
                        <Typography variant="subtitle2">
                          {`${symbolByCurrency.usd}${(
                            gasLimitByTxType.transfer *
                            gas[key] *
                            1e-9 *
                            ethPrice
                          ).toFixed(2)}`}
                        </Typography>
                        <Typography variant="body2">{title}</Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </>
            )}
          </Paper>
        </main>
      </Container>
    </div>
  );
};

export default App;
