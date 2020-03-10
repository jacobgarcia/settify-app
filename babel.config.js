const path = require('path');

const paths = {
  assets: path.resolve(__dirname, 'assets'),
  src: path.resolve(__dirname, 'src'),
  styles: path.resolve(__dirname, 'styles'),
};

module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      'babel-preset-expo',
      'module:metro-react-native-babel-preset',
      'module:react-native-dotenv',
    ],
    plugins: [
      [
        'module-resolver',
        {
          extensions: ['.js', '.jsx', '.android.js', '.ios.js', '.web.js'],
          root: ['./src'],
          alias: paths,
        },
      ],
    ],
  };
};
