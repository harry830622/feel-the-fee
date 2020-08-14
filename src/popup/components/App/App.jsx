/** @jsx jsx */
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { jsx, css } from '@emotion/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import {
  Paper,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
} from '@material-ui/core';
import { Refresh as RefreshIcon } from '@material-ui/icons';

const { ORIGIN } = process.env;

const App = () => {
  const [isFetching, setIsFetching] = useState(true);
  const [gas, setGas] = useState({});
  useEffect(() => {
    if (isFetching) {
      axios.get(`${ORIGIN}/api/gas/now`).then((res) => {
        setGas(res.data);
        setIsFetching(false);
      });
    }
  }, [isFetching]);

  const handleRefreshClick = useCallback(() => {
    setIsFetching(true);
  }, []);

  return (
    <>
      <CssBaseline />
      <div
        css={css`
          width: 300px;
        `}
      >
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6">⛽</Typography>
            <div
              css={css`
                flex-grow: 1;
              `}
            />
            <IconButton color="inherit" onClick={handleRefreshClick}>
              <RefreshIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <div
          css={css`
            display: flex;
            justify-content: space-evenly;
            padding: 10px 0px;
          `}
        >
          {isFetching ? null : (
            <>
              {[
                {
                  key: 'fast',
                  title: 'FAST',
                },
                {
                  key: 'average',
                  title: 'AVG',
                },
                {
                  key: 'safeLow',
                  title: 'SAFE',
                },
              ].map(({ key, title }) => (
                <Paper
                  key={key}
                  css={css`
                    flex-basis: 30%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    padding: 10px 0;
                  `}
                >
                  <div>{gas[key]}</div>
                  <Typography variant="subtitle1">{title}</Typography>
                </Paper>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default App;
