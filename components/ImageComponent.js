import React from "react";
import { useState } from "react";
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  View,
  Image,
  ImageBackground,
} from "react-native";
import { XIcon } from "./IconBottomTabs";

const ImageComponent = ({ listInfor, onPress }) => {
  return (
    <View style={styles.wrapImg}>
      <Image
        source={require("../assets/cute.png")}
        style={{
          height: "100%",
          width: "100%",
          borderWidth: 1,
          marginRight: 5,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapImg: {
    height: 80,
    width: 80,
    marginLeft: 10,
    flexDirection: "row",
    alignItems: "center",
  },
});

export default ImageComponent;
