import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';

/* eslint no-underscore-dangle: ["error", { "allow": ["__dirname"] }] */
const __dirname = dirname(fileURLToPath(import.meta.url));

const config = {
  entry: resolve(__dirname, 'src/index.js'),
  output: {
    filename: '[name].[contenthash].js',
    path: resolve(__dirname, 'dist'),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Jack and the mazestalk',
	  scriptLoading: 'module',
    }),
  ],
  devServer: {
    static: resolve(__dirname, 'dist'),
    open: true,
    hot: false,
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  performance: {
    maxEntrypointSize: 1024000,
    maxAssetSize: 1024000,
  },
  experiments: {
    topLevelAwait: true,
  },
};

export default (env, argv) => {
  if (argv.mode === 'development') {
    config.mode = 'development';
    config.devtool = 'source-map';
  } else if (argv.mode === 'production') {
    config.mode = 'production';
    config.optimization.minimize = true;
    config.optimization.minimizer = [new TerserPlugin()];
  }
  return config;
};
