/** @jsx jsx */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsx, css } from '@emotion/core';
import { Container, Typography, IconButton } from '@material-ui/core';
import {
  GitHub as GitHubIcon,
  Twitter as TwitterIcon,
} from '@material-ui/icons';

import { symbolByCurrency } from 'constants';
import PriceCard from './PriceCard';
import FeeCard from './FeeCard';

const { ORIGIN } = process.env;

const App = () => {
  const [currency, setCurrency] = useState('usd');
  useEffect(() => {
    chrome.storage.sync.get(
      {
        currency: 'usd',
      },
      (result) => {
        setCurrency(result.currency);
      },
    );
  }, []);

  const [
    isFetchingEthPriceByCurrency,
    setIsFetchingEthPriceByCurrency,
  ] = useState(true);
  const [ethPriceByCurrency, setEthPriceByCurrency] = useState({ usd: 400 });
  useEffect(() => {
    axios
      .get(
        `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=${Object.keys(
          symbolByCurrency,
        ).join(',')}`,
      )
      .then((res) => {
        setEthPriceByCurrency((prev) => ({ ...prev, ...res.data.ethereum }));
      })
      .then(() => {
        setIsFetchingEthPriceByCurrency(false);
      });
  }, []);

  const [isFetchingGasNow, setIsFetchingGasNow] = useState(true);
  const [gasNow, setGasNow] = useState({});
  useEffect(() => {
    axios
      .get(`${ORIGIN}/api/gas/now`)
      .then((res) => {
        setGasNow(res.data);
      })
      .then(() => {
        setIsFetchingGasNow(false);
      });
  }, []);

  const [isFetchingGass, setIsFetchingGass] = useState(true);
  const [gass, setGass] = useState([]);
  useEffect(() => {
    axios
      .get(`${ORIGIN}/api/gas`)
      .then((res) => {
        setGass(res.data);
      })
      .then(() => {
        setIsFetchingGass(false);
      });
  }, []);

  return (
    <div
      css={css`
        width: 400px;
        padding: 10px 0;
      `}
    >
      <Typography
        variant="h4"
        align="center"
        css={css`
          margin-bottom: 10px;
          padding: 20px 0;
        `}
      >
        ⛽ Feel the Fee
      </Typography>
      <Container>
        <main>
          <PriceCard isFetching={isFetchingGasNow} gasNow={gasNow} />
          <FeeCard
            isFetching={isFetchingGass || isFetchingEthPriceByCurrency}
            gas={gass[gass.length - 1]}
            ethPrice={ethPriceByCurrency[currency]}
            currency={currency}
            css={css`
              margin-top: 10px;
            `}
          />
        </main>
      </Container>
      <div
        css={css`
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 20px;
        `}
      >
        <IconButton
          size="small"
          href="https://github.com/harry830622/feel-the-fee"
          target="_blank"
          rel="noopener"
        >
          <GitHubIcon />
        </IconButton>
        <IconButton
          size="small"
          href="https://twitter.com/harry830622"
          target="_blank"
          rel="noopener"
        >
          <TwitterIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default App;
