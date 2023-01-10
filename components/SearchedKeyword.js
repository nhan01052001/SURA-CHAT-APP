import React from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { SearchICon } from "./IconBottomTabs";

const SearchedKeyword = () => {
  return (
    <TouchableOpacity style={styles.wrap}>
      <SearchICon color="#000" size={25} />
      <Text style={{ fontSize: "16", fontWeight: "500", marginLeft: 24 }}>
        Nhân
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    padding: 12,
  },
});

export default SearchedKeyword;
