const { BABEL_ENV } = process.env;

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'entry',
        corejs: 3,
      },
    ],
    [
      '@babel/preset-react',
      {
        development: BABEL_ENV === 'development',
      },
    ],
  ],
  plugins: [],
};
