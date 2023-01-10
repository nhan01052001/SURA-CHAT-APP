module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    presets: ["module:metro-react-native-babel-preset"],
    plugins: ["react-native-reanimated/plugin"],
    // plugins: [
    //   [
    //     "expo-image-picker",
    //     {
    //       photosPermission:
    //         "The app accesses your photos to let you share them with your friends.",
    //     },
    //   ],
    // ],
  };
};
