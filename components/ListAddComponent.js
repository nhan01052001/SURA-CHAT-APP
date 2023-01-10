import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  FlatList,
  Pressable,
  TextInput,
  Alert,
} from "react-native";

const ListAddComponent = ({ users, onPress }) => {
  return (
    <View style={{ flex: 1, backgroundColor: "#fff", marginHorizontal: 10 }}>
      <View
        style={{
          width: 70,
          height: 70,
          marginVertical: 12,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <Image
          source={{ uri: users.avatar }}
          style={{
            width: 50,
            height: 50,
            borderRadius: 500,
            borderWidth: 1,
            borderColor: "black",
            marginVertical: 10,
          }}
        />
        <View
          style={{
            borderRadius: 32,
            position: "absolute",
            top: 0,
            right: -10,
          }}
        >
          <TouchableOpacity
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={onPress}
          >
            <Image
              source={require("../assets/cancel.png")}
              style={{ width: 30, height: 30 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ListAddComponent;
