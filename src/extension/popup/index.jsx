import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { css } from '@emotion/core';

import App from '../../components/App';

ReactDOM.render(
  <>
    <CssBaseline />
    <App
      css={css`
        width: 400px;
        padding: 10px 0;
      `}
    />
  </>,
  document.querySelector('#react'),
);
