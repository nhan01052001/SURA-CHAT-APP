import React from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";

const ContactFound = () => {
  return (
    <TouchableOpacity style={styles.wrap}>
      <Image
        source={require("../assets/avatar.jpg")}
        style={{
          backgroundColor: "black",
          width: 80,
          height: 80,
          borderRadius: 90,
        }}
        resizeMode="cover"
      />
      <Text style={{ fontSize: "16", fontWeight: "500" }}>Nhân</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrap: {
    height: 150,
    width: 100,
    marginHorizontal: 24,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
});

export default ContactFound;
