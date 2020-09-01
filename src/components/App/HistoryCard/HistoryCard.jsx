import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import { Paper, Typography } from '@material-ui/core';
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

const HistoryCard = (props) => {
  const { className, isFetching, gasPrices } = props;

  const last24HrGasPrices = [...gasPrices]
    .slice(0, 24 * 60)
    .reverse()
    .filter((_, idx) => idx % 60 === 0)
    .map((v) => ({
      ...v,
      hr: `${new Date(1000 * v.timestamp).getHours()}:00`,
    }));

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
        </div>
        {isFetching ? (
          <Skeleton variant="rect" animation="wave" width="100%" height={200} />
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart
              data={last24HrGasPrices}
              css={css`
                margin-left: -20px;
              `}
            >
              <XAxis dataKey="hr" />
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
      </Paper>
    </div>
  );
};

HistoryCard.propTypes = {
  className: PropTypes.string,
  isFetching: PropTypes.bool.isRequired,
  gasPrices: PropTypes.array.isRequired,
};

HistoryCard.defaultProps = {
  className: '',
};

export default HistoryCard;
