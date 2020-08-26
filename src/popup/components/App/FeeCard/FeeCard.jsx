/** @jsx jsx */
import React, { useState, useEffect, useCallback } from 'react';
import { jsx, css } from '@emotion/core';
import {
  Paper,
  FormControl,
  Select,
  MenuItem,
  Typography,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';

import {
  symbolByCurrency,
  contractNameAndMethodByTxType,
  textByTxType,
} from 'constants';

const FeeCard = (props) => {
  const { className, isFetching, gas, ethPrice, currency } = props;

  const [txType, setTxType] = useState('transfer');
  const [gasLimitByTxType, setGasLimitByTxType] = useState({
    transfer: 21000,
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

  return (
    <div className={className}>
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
          Fee
        </Typography>
        <FormControl variant="outlined" size="small" fullWidth>
          <Select value={txType} onChange={handleTxTypeSelectChange} autoWidth>
            {Object.entries(textByTxType).map(([k, text]) => (
              <MenuItem key={k} value={k}>
                {text}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <div
          css={css`
            display: flex;
            justify-content: flex-end;
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
                gas.price.average *
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

export default FeeCard;
