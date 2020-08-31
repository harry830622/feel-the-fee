import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import {
  Grid,
  Paper,
  Typography,
  useTheme,
  useMediaQuery,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';

import { textBySpeed, waitTimeTextBySpeed } from 'constants';

const PriceCard = (props) => {
  const { className, isFetching, gasPriceBySpeed } = props;

  const theme = useTheme();
  const isLargerThanSm = useMediaQuery(theme.breakpoints.up('sm'));
  const visibleSpeeds = isLargerThanSm
    ? ['instant', 'fast', 'standard', 'slow']
    : ['instant', 'standard', 'slow'];

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
            margin-bottom: 10px;
          `}
        >
          <Typography variant="h6">
            Price
            <Typography
              variant="caption"
              css={css`
                margin-left: 5px;
              `}
            >
              (in Gwei)
            </Typography>
          </Typography>
        </div>
        <Grid container spacing={2}>
          {visibleSpeeds.map((speed) => (
            <Grid key={speed} item xs={12 / visibleSpeeds.length}>
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
                {isFetching ? (
                  <Skeleton variant="text" animation="wave" width="40%">
                    <Typography variant="subtitle1">Fetching...</Typography>
                  </Skeleton>
                ) : (
                  <Typography variant="subtitle1">
                    {`${gasPriceBySpeed[speed]}`}
                  </Typography>
                )}
                <Typography variant="caption">{textBySpeed[speed]}</Typography>
                <Typography variant="caption">
                  {waitTimeTextBySpeed[speed]}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </div>
  );
};

PriceCard.propTypes = {
  className: PropTypes.string,
  isFetching: PropTypes.bool.isRequired,
  gasPriceBySpeed: PropTypes.shape({
    instant: PropTypes.number.isRequired,
    fast: PropTypes.number.isRequired,
    standard: PropTypes.number.isRequired,
    slow: PropTypes.number.isRequired,
  }).isRequired,
};

PriceCard.defaultProps = {
  className: '',
};

export default PriceCard;
