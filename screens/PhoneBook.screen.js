import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Button,
  Platform,
  Image,
} from "react-native";
import { increment } from "../redux/testRedux";

export const PhoneBook = () => {
  const reduxTest = () => {
    console.log(increment.toString());
    console.log(increment.type);
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>...</Text>
      <TouchableOpacity
        style={{
          paddingVertical: 10,
          paddingHorizontal: 10,
          backgroundColor: "pink",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 10,
        }}
        onPress={reduxTest}
      >
        <Text>Test Redux</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
  },
});
