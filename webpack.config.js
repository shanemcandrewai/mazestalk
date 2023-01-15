import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';

/* eslint no-underscore-dangle: ["error", { "allow": ["__dirname"] }] */
const __dirname = dirname(fileURLToPath(import.meta.url));

const config = {
  entry: resolve(__dirname, 'src/index.js'),
  output: {
    filename: '[name].bundle.js',
    path: resolve(__dirname, 'dist'),
    clean: true,
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Jack and the mazestalk',
    }),
  ],
  devServer: {
    static: resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        loader: 'babel-loader',
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset',
      },

    ],
  },
};

export default (env, argv) => {
  if (argv.mode === 'development') {
    config.mode = 'development';
    config.devtool = 'source-map';
  }

  if (argv.mode === 'production') {
    config.mode = 'production';
    config.optimization = {
      minimize: true,
      minimizer: [new TerserPlugin()],
      splitChunks: {
        chunks: 'all',
      },
    };
  }

  return config;
};
