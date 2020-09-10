import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import Web3 from 'web3';
import { css } from '@emotion/core';
import {
  Container,
  Typography,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  Grid,
  Tooltip,
  Button,
  Snackbar,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import {
  GitHub as GitHubIcon,
  Twitter as TwitterIcon,
  Extension as ExtensionIcon,
} from '@material-ui/icons';

import {
  symbolByCurrency,
  txTypeByMethodByContractName,
  contractNameAndMethodsByTxType,
} from 'constants';
import PriceCard from './PriceCard';
import FeeCard from './FeeCard';
import HistoryCard from './HistoryCard';

const App = (props) => {
  const { className } = props;

  const ref = useRef({
    supportBtnTooltipTimeoutId: null,
    snackbarTimeoutId: null,
  });

  const [snackbar, setSnackbar] = useState({
    isVisible: false,
    severity: 'error',
    message: '',
  });

  const [currency, setCurrency] = useState('usd');
  useEffect(() => {
    if (localStorage.getItem('currency')) {
      setCurrency(localStorage.getItem('currency'));
    }
  }, []);
  const handleCurrencySelectChange = useCallback((e) => {
    setCurrency(e.target.value);
    localStorage.setItem('currency', e.target.value);
  }, []);

  const [
    isFetchingEthPriceByCurrency,
    setIsFetchingEthPriceByCurrency,
  ] = useState(true);
  const [ethPriceByCurrency, setEthPriceByCurrency] = useState(
    Object.keys(symbolByCurrency).reduce(
      (prev, curr) => ({
        ...prev,
        [curr]: 0,
      }),
      {},
    ),
  );
  useEffect(() => {
    setIsFetchingEthPriceByCurrency(true);
    axios
      .get(
        `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=${Object.keys(
          symbolByCurrency,
        ).join(',')}`,
      )
      .then((res) => {
        setEthPriceByCurrency((prev) => ({ ...prev, ...res.data.ethereum }));
      })
      .then(() => {
        setIsFetchingEthPriceByCurrency(false);
      });
  }, []);

  const [isFetchingGasPrices, setIsFetchingGasPrices] = useState(true);
  const [gasPrices, setGasPrices] = useState([]);
  useEffect(() => {
    const fetchGasPrices = () => {
      setIsFetchingGasPrices(true);
      axios
        .get(`${process.env.API_ORIGIN}/api/gas-price`)
        .then((res) => {
          setGasPrices(res.data);
        })
        .then(() => {
          setIsFetchingGasPrices(false);
        });
    };
    const intervalId = setInterval(fetchGasPrices, 60 * 1000);
    fetchGasPrices();
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const [isFetchingContracts, setIsFetchingContracts] = useState(true);
  const [contracts, setContracts] = useState([]);
  useEffect(() => {
    setIsFetchingContracts(true);
    axios
      .get(`${process.env.API_ORIGIN}/api/contract`)
      .then((res) => {
        setContracts(
          res.data.filter((contract) =>
            Object.keys(txTypeByMethodByContractName).includes(contract.name),
          ),
        );
      })
      .then(() => {
        setIsFetchingContracts(false);
      });
  }, []);

  const [isFetchingTransactions, setIsFetchingTransactions] = useState(true);
  const [transactions, setTransactions] = useState([]);
  useEffect(() => {
    setIsFetchingTransactions(true);
    Promise.all(
      contracts.map(async ({ address }) => {
        const res = await axios.get(
          `${process.env.API_ORIGIN}/api/transaction?to=${address}&limit=1000`,
        );
        return res.data;
      }),
    )
      .then((txss) => {
        setTransactions(txss.flat());
      })
      .then(() => {
        setIsFetchingTransactions(false);
      });
  }, [contracts]);

  const handleEmailSubscribe = useCallback((email) => {
    if (ref.current.snackbarTimeoutId) {
      clearTimeout(ref.current.snackbarTimeoutId);
    }
    ref.current.snackbarTimeoutId = setTimeout(() => {
      setSnackbar({
        isVisible: false,
        severity: 'error',
        message: '',
      });
    }, 3 * 1000);
    axios
      .post(`${process.env.API_ORIGIN}/api/user`, {
        email,
        isToNotifyWhen24HLow: true,
      })
      .then(() => {
        setSnackbar({
          isVisible: true,
          severity: 'success',
          message: 'You will be notified when the gas fee is at 24h low',
        });
      })
      .catch((err) => {
        setSnackbar({
          isVisible: true,
          severity: 'error',
          message: `Failed: ${err}`,
        });
      });
  }, []);

  const [isSupportBtnTooltipOpen, setIsSupportBtnTooltipOpen] = useState(false);
  const addrTextareaRef = useRef();
  const handleSupportBtnClick = useCallback(() => {
    addrTextareaRef.current.style.display = 'block';
    addrTextareaRef.current.select();
    document.execCommand('copy');
    addrTextareaRef.current.style.display = 'none';
    setIsSupportBtnTooltipOpen(true);
    if (ref.current.supportBtnTooltipTimeoutId) {
      clearTimeout(ref.current.supportBtnTooltipTimeoutId);
    }
    ref.current.supportBtnTooltipTimeoutId = setTimeout(() => {
      setIsSupportBtnTooltipOpen(false);
    }, 1 * 1000);
  }, []);

  const gasPriceBySpeed = useMemo(
    () => ({
      instant: gasPrices[0]?.instant ?? 0,
      fast: gasPrices[0]?.fast ?? 0,
      standard: gasPrices[0]?.standard ?? 0,
      slow: gasPrices[0]?.slow ?? 0,
    }),
    [gasPrices],
  );

  const web3 = useMemo(() => new Web3(process.env.INFURA_API_URL), []);
  const contractByName = useMemo(
    () =>
      contracts.reduce(
        (prev, { address, abi, name }) => ({
          ...prev,
          [name]: new web3.eth.Contract(JSON.parse(abi), address),
        }),
        {},
      ),
    [contracts, web3],
  );
  const contractNameByAddress = useMemo(
    () =>
      contracts.reduce(
        (prev, { address, name }) => ({
          ...prev,
          [address]: name,
        }),
        {},
      ),
    [contracts],
  );
  const sigByMethodByContractName = useMemo(
    () =>
      Object.entries(contractByName).reduce(
        (prev, [contractName, contract]) => ({
          ...prev,
          [contractName]: contract.options.jsonInterface
            .filter((i) => i.type === 'function')
            .reduce(
              (pprev, { name, signature }) => ({
                ...pprev,
                [name]: signature,
              }),
              {},
            ),
        }),
        {},
      ),
    [contractByName],
  );
  const methodBySigByContractName = useMemo(
    () =>
      Object.entries(sigByMethodByContractName).reduce(
        (prev, [contractName, sigByMethod]) => ({
          ...prev,
          [contractName]: Object.entries(sigByMethod).reduce(
            (pprev, [method, signature]) => ({
              ...pprev,
              [signature]: method,
            }),
            {},
          ),
        }),
        {},
      ),
    [sigByMethodByContractName],
  );
  const txsByMethodByContractName = useMemo(
    () =>
      transactions.reduce((prev, tx) => {
        const contractName = contractNameByAddress[tx.to];
        const method =
          methodBySigByContractName[contractName]?.[tx.input.slice(0, 10)];
        if (!method || !txTypeByMethodByContractName[contractName]?.[method]) {
          return prev;
        }
        return {
          ...prev,
          [contractName]: {
            ...(prev[contractName] ?? {}),
            [method]: [...(prev[contractName]?.[method] ?? []), tx],
          },
        };
      }, {}),
    [transactions, methodBySigByContractName, contractNameByAddress],
  );
  const gasUsedByTxType = useMemo(() => {
    const now = new Date();
    return {
      ...{
        eth__transfer: 21000,
      },
      ...Object.entries(contractNameAndMethodsByTxType).reduce(
        (prev, [txType, contractNameAndMethods]) => {
          let numValidMethods = 0;
          const result = contractNameAndMethods.reduce(
            (pprev, { contractName, method }) => {
              const txs =
                txsByMethodByContractName?.[contractName]?.[method] ?? [];
              let txsWithinPeriod = [];
              txs.every((tx) => {
                const txTime = new Date(tx.timestamp);
                const isWithinPeriod =
                  txTime.getTime() > now.getTime() - 60 * 60 * 1000;
                if (isWithinPeriod) {
                  txsWithinPeriod = [...txsWithinPeriod, tx];
                }
                return isWithinPeriod;
              });
              if (txsWithinPeriod.length === 0) {
                return pprev;
              }
              const sum = txsWithinPeriod.reduce(
                (ppprev, tx) => ppprev + tx.gas.used,
                0,
              );
              const avg = sum / txsWithinPeriod.length;
              numValidMethods += 1;
              return pprev + avg;
            },
            0,
          );
          return {
            ...prev,
            [txType]: result / numValidMethods,
          };
        },
        {},
      ),
    };
  }, [txsByMethodByContractName]);

  return (
    <>
      <Helmet>
        <title>Feel the Fee</title>
        <meta name="title" content="Feel the Fee" />
        <meta
          name="description"
          content="How much gas fee will it cost to do some yield farming on Yearn/Curve/Balancer? How much gas fee do I need to pay to swap a coin on Uniswap? Check out real-time gas fees on Ethereum in whatever currency you like right now!"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fee.finance/" />
        <meta property="og:title" content="Feel the Fee" />
        <meta
          property="og:description"
          content="How much gas fee will it cost to do some yield farming on Yearn/Curve/Balancer? How much gas fee do I need to pay to swap a coin on Uniswap? Check out real-time gas fees on Ethereum in whatever currency you like right now!"
        />
        {/* <meta property="og:image" content="" /> */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://fee.finance/" />
        <meta property="twitter:title" content="Feel the Fee" />
        <meta
          property="twitter:description"
          content="How much gas fee will it cost to do some yield farming on Yearn/Curve/Balancer? How much gas fee do I need to pay to swap a coin on Uniswap? Check out real-time gas fees on Ethereum in whatever currency you like right now!"
        />
        {/* <meta property="twitter:image" content="" /> */}

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />

        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />

        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GA_TRACKING_ID}`}
        />
        <script>
          {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', '${process.env.GA_TRACKING_ID}');
          `}
        </script>
      </Helmet>

      <div className={className}>
        <Container>
          <div
            css={css`
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 10px;
              padding: 20px 0;
            `}
          >
            <Typography component="h1" variant="h5" align="center">
              ⛽ Feel the Fee
            </Typography>
            <FormControl variant="outlined" size="small">
              <Select value={currency} onChange={handleCurrencySelectChange}>
                {Object.keys(symbolByCurrency).map((k) => (
                  <MenuItem key={k} value={k}>
                    {k.toUpperCase()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <main>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <PriceCard
                  isFetching={isFetchingGasPrices}
                  gasPriceBySpeed={gasPriceBySpeed}
                />
              </Grid>
              <Grid item xs={12}>
                <FeeCard
                  isFetching={
                    isFetchingGasPrices ||
                    isFetchingContracts ||
                    isFetchingTransactions ||
                    isFetchingEthPriceByCurrency
                  }
                  gasPriceBySpeed={gasPriceBySpeed}
                  gasUsedByTxType={gasUsedByTxType}
                  ethPrice={ethPriceByCurrency[currency]}
                  currency={currency}
                />
              </Grid>
              <Grid item xs={12}>
                <HistoryCard
                  isFetching={isFetchingGasPrices}
                  gasPrices={gasPrices}
                  onEmailSubscribe={handleEmailSubscribe}
                />
              </Grid>
            </Grid>
          </main>
          <div
            css={css`
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-top: 20px;
            `}
          >
            <div
              css={css`
                display: flex;
                align-items: center;
              `}
            >
              <IconButton
                size="small"
                href="https://chrome.google.com/webstore/detail/feel-the-fee/ogajfoicbmjoggcpkmhddokjoipjbnkg"
                target="_blank"
                rel="noopener"
              >
                <ExtensionIcon />
              </IconButton>
              <IconButton
                size="small"
                href="https://twitter.com/harry830622"
                target="_blank"
                rel="noopener"
              >
                <TwitterIcon />
              </IconButton>
              <IconButton
                size="small"
                href="https://github.com/harry830622/feel-the-fee"
                target="_blank"
                rel="noopener"
              >
                <GitHubIcon />
              </IconButton>
              <Tooltip
                title="Address Copied"
                placement="top"
                arrow
                disableFocusListener
                disableHoverListener
                disableTouchListener
                open={isSupportBtnTooltipOpen}
              >
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleSupportBtnClick}
                  css={css`
                    margin-left: 5px;
                  `}
                >
                  Donate
                </Button>
              </Tooltip>
              <textarea
                value="0x07b0C5E79da1bF72699cBa4bA49d9C06A15EA40e"
                readOnly
                ref={addrTextareaRef}
                css={css`
                  display: none;
                `}
              />
            </div>
            <div>&copy; fff 2020</div>
          </div>
          <div
            dangerouslySetInnerHTML={{
              __html: `<a href="https://www.producthunt.com/posts/feel-the-fee?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-feel-the-fee" target="_blank" rel="noopener"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=247917&theme=light" alt="Feel the Fee - Show gas fees for smart contract transactions in fiat | Product Hunt Embed" style="width: 100%; height: 100%;" width="250px" height="54px" /></a>`,
            }}
            css={css`
              margin-top: 20px;
              width: 250px;
              height: 54px;
            `}
          />
        </Container>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={snackbar.isVisible}
        >
          <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>
      </div>
    </>
  );
};

App.propTypes = {
  className: PropTypes.string,
};

App.defaultProps = {
  className: '',
};

export default App;
