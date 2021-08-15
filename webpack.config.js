'use strict'

const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')

module.exports = (env, args) => {
     const isDevelopment = args.mode === 'development'

     const optimization = () => {
          const config = {}

          if (!isDevelopment) {
               config.minimizer = [
                    new CssMinimizerPlugin({
                         minimizerOptions: {
                              preset: ['default', { discardComments: { removeAll: true } }],
                         },
                    }),
                    new TerserWebpackPlugin({
                         terserOptions: {
                              output: {
                                   comments: false
                              }
                         },
                         extractComments: false,
                    }),
               ]
          }
          return config
     }

     return {
          mode: isDevelopment ? 'development' : 'production',
          entry: {
               bundle: './src/index.js'
          },
          output: {
               path: path.resolve(__dirname, 'dist'),
               clean: true,
               filename: '[name].js',
               assetModuleFilename: 'assets/[name][ext][query]'
          },

          devtool: isDevelopment ? 'cheap-module-source-map' : false,
          watch: isDevelopment,
          watchOptions: {
               ignored: '**/node_modules',
          },

          optimization: optimization(),

          plugins: [
               new webpack.ProvidePlugin({
                    $: "jquery",
                    jQuery: "jquery"
               }),
               new MiniCssExtractPlugin({
                    filename: '[name].css',
               }),
          ],

          module: {
               rules: [
                    {
                         test: /\.m?js$/,
                         exclude: /(node_modules|bower_components)/,
                         use: {
                              loader: 'babel-loader',
                              options: {
                                   presets: [
                                        ['@babel/preset-env', { useBuiltIns: "usage", corejs: 3.15 }],
                                   ],
                                   plugins: ["@babel/plugin-transform-runtime"]
                              },
                         },
                    },
                    {
                         test: /\.(sa|sc|c)ss$/,
                         exclude: /\.module.(s[ac]ss)$/,
                         use: [
                              MiniCssExtractPlugin.loader,
                              {
                                   loader: 'css-loader',
                                   options: {
                                        url: false,
                                        sourceMap: isDevelopment,
                                   },
                              },
                              "postcss-loader",
                              {
                                   loader: 'sass-loader',
                                   options: {
                                        sourceMap: isDevelopment,
                                   },
                              },
                         ],
                    },
                    {
                         test: /\.(png|svg|jpg|jpeg|gif)$/i,
                         type: 'asset/resource',
                         generator: {
                              filename: 'assets/images/[name][ext][query]'
                         }
                    },
                    {
                         test: /\.(woff|woff2|eot|ttf|otf)$/i,
                         type: 'asset/resource',
                         generator: {
                              filename: 'assets/fonts/[name][ext][query]'
                         }
                    },
               ],
          },
     }

};
