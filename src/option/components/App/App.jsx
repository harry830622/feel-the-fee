/** @jsx jsx */
import React, { useState, useEffect, useCallback } from 'react';
import { jsx, css } from '@emotion/core';
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
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
    chrome.storage.sync.get(null, (result) => {
      if (result.currency) {
        setCurrency(result.currency);
      }
    });
  }, []);
  const handleCurrencySelectChange = useCallback((e) => {
    setCurrency(e.target.value);
    chrome.storage.sync.set({
      currency: e.target.value,
    });
  }, []);

  return (
    <div>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6">⛽ EGS Settings</Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <main
          css={css`
            padding: 88px 0 20px;
          `}
        >
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
        </main>
      </Container>
    </div>
  );
};

export default App;
