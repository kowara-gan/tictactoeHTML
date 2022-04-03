const {resolve}=require('path')

module.exports = {
  mode: 'development',
  entry: resolve(__dirname,'ts/index.ts'),
  output: {
    filename: 'index.js',
    path: resolve(__dirname,'docs'),
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

