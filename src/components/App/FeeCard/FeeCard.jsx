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
  Link,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';

import {
  symbolByCurrency,
  contractNameAndMethodByTxType,
  textByCategory,
  defaultCategory,
  textByTxTypeByCategory,
  textBySpeed,
} from 'constants';

const FeeCard = (props) => {
  const {
    className,
    isFetching,
    gasPriceBySpeed,
    gasUsedByMethodByContractName,
    ethPrice,
    currency,
  } = props;

  const [txType, setTxType] = useState(
    Object.keys(textByTxTypeByCategory[defaultCategory])[0],
  );
  const [gasUsedByTxType, setGasUsedByTxType] = useState({
    eth__transfer: 21000,
  });
  useEffect(() => {
    setGasUsedByTxType((prev) => ({
      ...prev,
      ...Object.entries(contractNameAndMethodByTxType).reduce(
        (pprev, [t, [contractName, method]]) => ({
          ...pprev,
          [t]: gasUsedByMethodByContractName?.[contractName]?.[method],
        }),
        {},
      ),
    }));
  }, [gasUsedByMethodByContractName]);
  const handleTxTypeSelectChange = useCallback((e) => {
    setTxType(e.target.value);
  }, []);

  const [category, setCategory] = useState(defaultCategory);
  const handleCategorySelectChange = useCallback((e) => {
    setCategory(e.target.value);
    setTxType(Object.keys(textByTxTypeByCategory[e.target.value])[0]);
  }, []);

  const [speed, setSpeed] = useState('standard');
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
          <Typography component="h2" variant="h6">
            Fee
          </Typography>
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
          <Grid item xs={12} sm={4}>
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
          <Grid item xs={12} sm={8}>
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
            justify-content: space-between;
            align-items: center;
            margin-top: 10px;
          `}
        >
          <Link
            href="https://forms.gle/hyzysABQ8sPHxuiH6"
            target="_blank"
            rel="noopener"
          >
            Can&apos;t find what you want?
          </Link>
          {isFetching ? (
            <Skeleton variant="text" animation="wave" width="40%">
              <Typography variant="h5">Fetching...</Typography>
            </Skeleton>
          ) : (
            <Typography component="p" variant="h5">
              {`${symbolByCurrency[currency]}${(
                gasUsedByTxType[txType] *
                gasPriceBySpeed[speed] *
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
  className: PropTypes.string,
  isFetching: PropTypes.bool.isRequired,
  gasPriceBySpeed: PropTypes.shape({
    instant: PropTypes.number.isRequired,
    fast: PropTypes.number.isRequired,
    standard: PropTypes.number.isRequired,
    slow: PropTypes.number.isRequired,
  }).isRequired,
  gasUsedByMethodByContractName: PropTypes.object.isRequired,
  ethPrice: PropTypes.number.isRequired,
  currency: PropTypes.string.isRequired,
};

FeeCard.defaultProps = {
  className: '',
};

export default FeeCard;
