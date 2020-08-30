import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import {
  Paper,
  FormControl,
  Select,
  MenuItem,
  Typography,
  Grid,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';

import {
  symbolByCurrency,
  contractNameAndMethodByTxType,
  textByCategory,
  textByTxTypeByCategory,
  textBySpeed,
} from 'constants';

const FeeCard = (props) => {
  const { className, isFetching, gas, ethPrice, currency } = props;

  const [txType, setTxType] = useState('yearn__vault__yCrv__deposit');
  const [gasLimitByTxType, setGasLimitByTxType] = useState({
    'transfer--eth': 21000,
  });
  useEffect(() => {
    setGasLimitByTxType((prev) => ({
      ...prev,
      ...Object.entries(contractNameAndMethodByTxType).reduce(
        (pprev, [t, [contractName, method]]) => ({
          ...pprev,
          [t]: gas?.limit?.[contractName][method],
        }),
        {},
      ),
    }));
  }, [gas]);
  const handleTxTypeSelectChange = useCallback((e) => {
    setTxType(e.target.value);
  }, []);

  const [category, setCategory] = useState('yearn');
  const handleCategorySelectChange = useCallback((e) => {
    setCategory(e.target.value);
    setTxType(Object.keys(textByTxTypeByCategory[e.target.value])[0]);
  }, []);

  const [speed, setSpeed] = useState('average');
  useEffect(() => {
    if (localStorage.getItem('speed')) {
      setSpeed(localStorage.getItem('speed'));
    }
  }, []);
  const handleSpeedSelectChange = useCallback((e) => {
    setSpeed(e.target.value);
    localStorage.setItem('speed', e.target.value);
  }, []);

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
          <Typography variant="h6">Fee</Typography>
          <FormControl variant="outlined" size="small">
            <Select value={speed} onChange={handleSpeedSelectChange}>
              {Object.entries(textBySpeed).map(([k, text]) => (
                <MenuItem key={k} value={k}>
                  {text}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <Grid container>
          <Grid item xs={12} md={4}>
            <FormControl variant="outlined" size="small" fullWidth>
              <Select value={category} onChange={handleCategorySelectChange}>
                {Object.entries(textByCategory).map(([k, text]) => (
                  <MenuItem key={k} value={k}>
                    {text}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={8}>
            <FormControl variant="outlined" size="small" fullWidth>
              <Select value={txType} onChange={handleTxTypeSelectChange}>
                {Object.entries(textByTxTypeByCategory[category]).map(
                  ([k, text]) => (
                    <MenuItem key={k} value={k}>
                      {text}
                    </MenuItem>
                  ),
                )}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <div
          css={css`
            display: flex;
            justify-content: flex-end;
            align-items: center;
            margin-top: 10px;
          `}
        >
          {isFetching ? (
            <Skeleton variant="text" animation="wave" width="40%">
              <Typography variant="h4">Fetching...</Typography>
            </Skeleton>
          ) : (
            <Typography variant="h5">
              {`${symbolByCurrency[currency]}${(
                gasLimitByTxType[txType] *
                gas.price[speed] *
                1e-9 *
                ethPrice
              ).toFixed(2)}`}
            </Typography>
          )}
        </div>
      </Paper>
    </div>
  );
};

FeeCard.propTypes = {
  className: PropTypes.string.isRequired,
  isFetching: PropTypes.bool.isRequired,
  gas: PropTypes.shape({
    price: PropTypes.shape({
      fastest: PropTypes.number.isRequired,
      fast: PropTypes.number.isRequired,
      average: PropTypes.number.isRequired,
      safeLow: PropTypes.number.isRequired,
    }).isRequired,
    waitTimeInSec: PropTypes.shape({
      fastest: PropTypes.number.isRequired,
      fast: PropTypes.number.isRequired,
      average: PropTypes.number.isRequired,
      safeLow: PropTypes.number.isRequired,
    }).isRequired,
    limit: PropTypes.object.isRequired,
  }).isRequired,
  ethPrice: PropTypes.number.isRequired,
  currency: PropTypes.string.isRequired,
};

export default FeeCard;
