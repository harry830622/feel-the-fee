import React, { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import {
  Paper,
  Typography,
  FormControl,
  Select,
  MenuItem,
  TextField,
  Button,
  Grid,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { textByPeriod } from 'constants';

const HistoryCard = (props) => {
  const { className, isFetching, gasPrices, onEmailSubscribe } = props;

  const [periodGasPrices, setPeriodGasPrices] = useState([]);
  const [period, setPeriod] = useState('24h');
  useEffect(() => {
    if (localStorage.getItem('period')) {
      setPeriod(localStorage.getItem('period'));
    }
  }, []);
  const handlePeriodSelectChange = useCallback((e) => {
    setPeriod(e.target.value);
    localStorage.setItem('period', e.target.value);
  }, []);
  useEffect(() => {
    const now = new Date();
    const endTime = new Date(now.getTime());
    switch (period) {
      case '24h': {
        endTime.setHours(now.getHours() - 1);
        endTime.setMinutes(0);
        endTime.setSeconds(0);
        endTime.setMilliseconds(0);
        let i = 0;
        let gasPricesWithinPeriod = [];
        gasPrices.every((gasPrice) => {
          const gasPriceTime = new Date(gasPrice.timestamp);
          const isWithinPeriod =
            gasPriceTime.getTime() <= endTime.getTime() &&
            gasPriceTime.getTime() > endTime.getTime() - 24 * 60 * 60 * 1000;
          if (isWithinPeriod) {
            gasPricesWithinPeriod = [...gasPricesWithinPeriod, gasPrice];
          }
          return (
            gasPriceTime.getTime() > endTime.getTime() - 24 * 60 * 60 * 1000
          );
        });
        setPeriodGasPrices(
          [...gasPricesWithinPeriod]
            .reduce((prev, gasPrice) => {
              const gasPriceTime = new Date(gasPrice.timestamp);
              const result = [...prev];
              if (
                gasPriceTime.getTime() >
                endTime.getTime() - i * 60 * 60 * 1000
              ) {
                result[result.length - 1].push(gasPrice);
              } else {
                result.push([]);
                i += 1;
              }
              return result;
            }, [])
            .map((gasPricesWithinDay) => {
              const result = gasPricesWithinDay.reduce(
                (prev, gasPrice) => ({
                  instant: prev.instant + gasPrice.instant,
                  fast: prev.fast + gasPrice.fast,
                  standard: prev.standard + gasPrice.standard,
                  slow: prev.slow + gasPrice.slow,
                }),
                { instant: 0, fast: 0, standard: 0, slow: 0 },
              );
              if (gasPricesWithinDay.length === 0) {
                return result;
              }
              return {
                instant: Math.ceil(result.instant / gasPricesWithinDay.length),
                fast: Math.ceil(result.fast / gasPricesWithinDay.length),
                standard: Math.ceil(
                  result.standard / gasPricesWithinDay.length,
                ),
                slow: Math.ceil(result.slow / gasPricesWithinDay.length),
              };
            })
            .map(({ instant, fast, standard, slow }, idx) => {
              const time = new Date(endTime);
              time.setHours(endTime.getHours() - idx);
              return {
                instant,
                fast,
                standard,
                slow,
                h: `${time.getHours() < 10 ? '0' : ''}${time.getHours()}:00`,
              };
            })
            .reverse(),
        );
        break;
      }
      default: {
        break;
      }
    }
  }, [period, gasPrices]);

  const [email, setEmail] = useState('');
  const emailTextFieldRef = useRef();
  const handleEmailTextFieldChange = useCallback((e) => {
    setEmail(e.target.value);
  }, []);
  const handleEmailBtnClick = useCallback(() => {
    if (!emailTextFieldRef.current.querySelector('input').reportValidity()) {
      return;
    }
    onEmailSubscribe(email);
    setEmail('');
  }, [email, onEmailSubscribe]);

  return (
    <div className={className}>
      <Paper
        variant="outlined"
        css={css`
          padding: 10px;
        `}
      >
        <div
          css={css`
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
          `}
        >
          <Typography component="h2" variant="h6">
            History
          </Typography>
          <FormControl variant="outlined" size="small">
            <Select value={period} onChange={handlePeriodSelectChange}>
              {Object.entries(textByPeriod).map(([k, text]) => (
                <MenuItem key={k} value={k}>
                  {text}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        {isFetching ? (
          <Skeleton variant="rect" animation="wave" width="100%" height={200} />
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart
              data={periodGasPrices}
              css={css`
                margin-left: -20px;
              `}
            >
              <XAxis
                dataKey={(() => {
                  switch (period) {
                    case '24h': {
                      return 'h';
                    }
                    default: {
                      return 'h';
                    }
                  }
                })()}
              />
              <YAxis />
              <CartesianGrid vertical={false} />
              <Line type="monotone" dataKey="instant" stroke="#7400b8" />
              <Line type="monotone" dataKey="fast" stroke="#6930c3" />
              <Line type="monotone" dataKey="standard" stroke="#5e60ce" />
              <Line type="monotone" dataKey="slow" stroke="#5390d9" />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        )}
        <Grid container spacing={1} justify="flex-end" alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              variant="outlined"
              size="small"
              fullWidth
              ref={emailTextFieldRef}
              type="email"
              placeholder="Your email"
              required
              value={email}
              onChange={handleEmailTextFieldChange}
              css={css`
                flex-grow: 0;
              `}
            />
          </Grid>
          <Grid item xs={8} md={2}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleEmailBtnClick}
              css={css`
                white-space: nowrap;
              `}
            >
              Notify when 24h-low
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

HistoryCard.propTypes = {
  className: PropTypes.string,
  isFetching: PropTypes.bool.isRequired,
  gasPrices: PropTypes.array.isRequired,
  onEmailSubscribe: PropTypes.func.isRequired,
};

HistoryCard.defaultProps = {
  className: '',
};

export default HistoryCard;
