const path = require('path');

// --mode=development → template/js/main.dev.js
// --mode=production  → template/js/main.min.js
module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';
  return {
    mode: isProd ? 'production' : 'development',
    entry: './ts/index.ts',
    output: {
      filename: isProd ? 'main.min.js' : 'main.dev.js',
      path: path.resolve(__dirname, 'template/js'),
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
  };
};
