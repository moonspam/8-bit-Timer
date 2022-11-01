const path = require('path');
const fs = require('fs');

const sourcePath = './src/';
const outputPath = './dist/';

const copyStateLibs = fs.existsSync('./src/libs') && fs.lstatSync('./src/libs').isDirectory();
const copyStateFont = fs.existsSync('./src/font') && fs.lstatSync('./src/font').isDirectory();

console.log(`CopyWebpackPlugin(libs) : ${copyStateLibs}`);
console.log(`CopyWebpackPlugin(font) : ${copyStateFont}`);

const VueLoaderPlugin = require('vue-loader/lib/plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlBeautifyPlugin = require('@nurminen/html-beautify-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

function generateHtmlPlugins(templateDir) {
  const templateFiles = fs.readdirSync(templateDir).filter((file) => file.substr(-5) === '.html');
  return templateFiles.map((file) => new HtmlWebpackPlugin({
    template: `./${file}`,
    filename: `${file}`,
    minify: false,
    hash: true,
    inject: 'body',
    chunks: 'all',
  }));
}

module.exports = (env, argv) => {
  // Webpack 플러그인
  const plugins = [
    new ESLintPlugin(),
    new VueLoaderPlugin(),
    new CleanWebpackPlugin({
      protectWebpackAssets: false,
    }),
    new MiniCssExtractPlugin({
      filename: 'css/style.css',
    }),
  ];

  // html의 개수에 따라 HtmlWebpackPlugin 생성
  const htmlList = generateHtmlPlugins(sourcePath);

  // HtmlWebpackPlugin 확장 플러그인
  const htmlPlugins = [
    new HtmlBeautifyPlugin({
      config: {
        html: {
          indent_size: 2,
          end_with_newline: true,
          preserve_newlines: true,
          unformatted: ['p', 'i', 'b', 'span'],
        },
      },
    }),
  ];

  function copyPlugin() {
    let val = [];
    if (copyStateLibs && !copyStateFont) {
      val = [
        new CopyWebpackPlugin({
          patterns: [
            {
              from: './libs/**/*',
            },
          ],
        }),
      ];
    }
    if (!copyStateLibs && copyStateFont) {
      val = [
        new CopyWebpackPlugin({
          patterns: [
            {
              from: './font/**/*',
            },
          ],
        }),
      ];
    }
    if (copyStateLibs && copyStateFont) {
      val = [
        new CopyWebpackPlugin({
          patterns: [
            {
              from: './libs/**/*',
            },
            {
              from: './font/**/*',
            },
          ],
        }),
      ];
    }
    return val;
  }

  console.log('\n********************************************************************************');
  console.log(`🚀 Build Mode: ${argv.mode}`);
  console.log('********************************************************************************\n');

  return {
    context: path.resolve(__dirname, sourcePath),
    entry: {
      app: ['./js/app.js'],
    },
    output: {
      filename: 'js/[name].js',
      path: path.resolve(__dirname, outputPath),
      publicPath: '/',
    },
    target: ['web', 'es5'],
    resolve: {
      alias: {
        vue$: 'vue/dist/vue.esm.js',
      },
      extensions: ['*', '.js', '.vue', '.json'],
    },
    devServer: {
      static: {
        directory: path.resolve(__dirname, sourcePath),
        watch: true,
      },
      open: true,
    },
    stats: {
      preset: 'errors-only',
      builtAt: true,
      timings: true,
      version: true,
    },
    mode: argv.mode === 'development' ? 'development' : 'production',
    devtool: argv.mode === 'development' ? 'source-map' : false,
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'all',
          },
        },
      },
      minimizer: [
        new TerserPlugin({
          extractComments: false,
        }),
      ],
    },
    performance: {
      hints: argv.mode === 'production' ? 'warning' : false,
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            argv.mode === 'development' ? 'style-loader'
              : {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  publicPath: '/',
                },
              },
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                // eslint-disable-next-line global-require
                implementation: require('sass'),
              },
            },
          ],
        },
        {
          test: /\.(gif|png|jpe?g)$/,
          include: /images/,
          type: 'asset/resource',
          generator: {
            filename: argv.mode === 'development' ? 'images/[name][ext]' : 'images/[name][ext]?[hash]',
          },
        },
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            configFile: './.babelrc',
          },
        },
      ],
    },
    plugins: plugins.concat(copyPlugin()).concat(htmlList).concat(htmlPlugins),
  };
};
