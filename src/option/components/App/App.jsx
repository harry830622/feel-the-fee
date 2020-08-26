/** @jsx jsx */
import React, { useState, useEffect, useCallback } from 'react';
import { jsx, css } from '@emotion/core';
import {
  Container,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';

const textByCurrency = {
  eth: 'Ether',
  btc: 'Bitcoin',
  twd: 'New Taiwan Dollar',
  usd: 'US Dollar',
  cad: 'Canadian Dollar',
  aud: 'Australian Dollar',
  cny: 'Chinese Yuan',
  jpy: 'Japanese Yen',
  sgd: 'Singapore Dollar',
  thb: 'Thai Baht',
  vnd: 'Vietnamese Don',
  eur: 'Euro',
  gbp: 'Pound',
  inr: 'Indian Rupee',
  krw: 'South Korean Won',
  hkd: 'Hong Kong Dollar',
};

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
  const handleCurrencySelectChange = useCallback((e) => {
    setCurrency(e.target.value);
    chrome.storage.sync.set({
      currency: e.target.value,
    });
  }, []);

  return (
    <div
      css={css`
        padding: 10px 0;
      `}
    >
      <Typography
        variant="h4"
        align="center"
        css={css`
          margin-bottom: 10px;
        `}
      >
        Settings
      </Typography>
      <Container>
        <main>
          <Paper
            variant="outlined"
            css={css`
              padding: 10px;
            `}
          >
            <Typography
              variant="h6"
              css={css`
                margin-bottom: 10px;
              `}
            >
              General
            </Typography>
            <FormControl variant="outlined">
              <InputLabel id="currency-select">Display in</InputLabel>
              <Select
                labelId="currency-select"
                label="Display in"
                value={currency}
                onChange={handleCurrencySelectChange}
                css={css`
                  width: 200px;
                `}
              >
                {Object.entries(textByCurrency).map(([c, text]) => (
                  <MenuItem key={c} value={c}>
                    {text}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>
        </main>
      </Container>
    </div>
  );
};

export default App;
