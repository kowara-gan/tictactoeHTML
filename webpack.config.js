const {resolve}=require('path')

module.exports = {
  mode: 'development',
  entry: './index.ts',
  output: {
    filename: 'index.js',
    path: `${__dirname}/`,
  },
  module: {
    rules: [
      {
        test: /\.worker\.ts$/,
        loader: 'worker-loader',
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  devServer: {},
  experiments: {
    asyncWebAssembly: true,
  },
  
};
