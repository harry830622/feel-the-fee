import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import { Grid, Paper, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';

import { textBySpeed } from 'constants';

const visibleSpeeds = ['fast', 'average', 'safeLow'];

const PriceCard = (props) => {
  const { className, isFetching, gasNow } = props;

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
          Price
        </Typography>
        <Grid container spacing={2}>
          {visibleSpeeds.map((speed) => (
            <Grid key={speed} item xs={4}>
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
                    <Typography variant="subtitle2">Fetching...</Typography>
                  </Skeleton>
                ) : (
                  <Typography variant="subtitle2">
                    {`${gasNow.price[speed]}`}
                  </Typography>
                )}
                <Typography variant="body2">{textBySpeed[speed]}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </div>
  );
};

PriceCard.propTypes = {
  className: PropTypes.string.isRequired,
  isFetching: PropTypes.bool.isRequired,
  gasNow: PropTypes.shape({
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
  }).isRequired,
};

export default PriceCard;
