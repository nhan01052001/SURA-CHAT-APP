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

const FileComponent = ({ listInfor, onPress }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
      }}
    >
      <View style={styles.wrapFile}>
        <Image
          source={require("../assets/google-docs.png")}
          style={{ height: "100%", width: "100%" }}
        />
      </View>
      <View
        style={{
          height: "100%",
          width: "80%",
          borderBottomWidth: 1,
          paddingVertical: 10,
        }}
      >
        <Text
          numberOfLines={1}
          style={{ fontSize: 16, fontWeight: "600", marginBottom: 5 }}
        >
          Ten File
        </Text>
        <Text style={{ fontSize: 12 }}>Dung Luong</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapFile: {
    height: 50,
    width: 50,
    marginLeft: 10,
    flexDirection: "row",
    alignItems: "center",
  },
});

export default FileComponent;
