import path from 'path';
import CopyPlugin from 'copy-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const config = {
  mode: 'development',
  target: ['web'],
  entry: {
    background: './src/js/background.js',
    content: './src/js/content.js',
    localStorage: './src/js/localStorage.js',
  },
  output: {
    path: path.resolve(process.cwd(), 'build'),
    filename: './js/[name].js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: './css/[name].css',
      chunkFilename: '[id].css',
    }),
    new CopyPlugin({
      patterns: [
        {
          from: './src/manifest.json',
          to: './manifest.json',
        },
        {
          from: './src/images',
          to: './images',
        },
        {
          from: './src/icons',
          to: './icons',
        },
      ],
    }),
  ],
  devtool: 'inline-cheap-source-map',
};

export default env => {
  if (env && env.production) {
    config.mode = 'production';
    config.devtool = 'eval';
  }

  return config;
}
