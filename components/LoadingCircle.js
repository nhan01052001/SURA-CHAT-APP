import React from "react";
import { StyleSheet, View, Text } from "react-native";
import LottieView from "lottie-react-native";

const LoadingCircle = () => {
  return (
    <View style={[StyleSheet.absoluteFillObject, styles.container]}>
      <LottieView
        source={require("../assets/96898-loader-animation.json")}
        autoPlay
        loop
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(0,0,0,0.3)",
    zIndex: 1,
  },
});

export default LoadingCircle;
