import { StyleSheet, Platform, Dimensions } from "react-native";
export default StyleSheet.create({
  droidSafeArea: {
    // flex: 1,
    // paddingTop: Platform.OS === "android" ? 30 : 0,
    paddingTop: 35,
  },
  iosPD: {
    bottom: Platform.OS === "android" ? 10 : 20,
  },
  test: {
    height:
      Dimensions.get("window").height > 800
        ? Dimensions.get("window").width * 1.6
        : Dimensions.get("window").width * 1.5,
  },

  test2: {
    height:
      Dimensions.get("window").height > 800
        ? Dimensions.get("window").width * 1.6
        : Dimensions.get("window").width * 1.5,
  },

  test4: {
    height:
      Dimensions.get("window").height > 800
        ? Dimensions.get("window").width * 2.15
        : Dimensions.get("window").width * 1.9,
  },

  test3: {
    marginBottom: Dimensions.get("window").height > 800 ? 24 : 15,
  },
});
