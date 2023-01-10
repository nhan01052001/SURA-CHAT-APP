import React from "react";
import { StyleSheet, View, Text } from "react-native";
import * as Progress from "react-native-progress";

const LoadingCircleSnail = () => {
  return (
    <View style={[StyleSheet.absoluteFillObject, styles.container]}>
      <Progress.CircleSnail color={["red", "green", "blue"]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // justifyContent: "center",
    marginTop: 50,
    alignItems: "center",
    backgroundColor: "rgb(0,0,0,0.3)",
    zIndex: 1,
  },
});

export default LoadingCircleSnail;
