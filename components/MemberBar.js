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

const MemberBar = ({ listInfor, onPress }) => {
  return (
    <View style={styles.aMess}>
      <View style={styles.aMess_avt}>
        <Image source={{ uri: listInfor.avatar }} style={styles.wrapAvatarZL} />
      </View>
      <View style={styles.aMess_right}>
        <View style={styles.name_and_disMess}>
          <Text style={styles.txtNameMess}>{listInfor.name}</Text>
        </View>
        <TouchableOpacity style={styles.xxxDiff} onPress={onPress}>
          <XIcon color="black" size={22} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  aMess: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: "white",
  },

  aMess_avt: {
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
  },

  aMess_right: {
    flexDirection: "row",
    flexGrow: 9,
    height: "100%",
    marginLeft: 10,
    borderColor: "#b6b9ba",
    borderBottomWidth: 1,
  },

  wrapAvatarZL: {
    width: 50,
    height: 50,
    borderRadius: 500,
    borderWidth: 1,
    borderColor: "black",
    marginVertical: 10,
  },

  name_and_disMess: {
    flexDirection: "column",
    justifyContent: "center",
    flexGrow: 5,
    backgroundColor: "white",
  },

  txtNameMess: {
    fontSize: 16,
    fontWeight: "500",
  },

  txtDisMess: {
    fontSize: 15,
    opacity: 0.5,
  },

  xxxDiff: {
    flexGrow: 2,
    maxWidth: 60,
    alignItems: "center",
    justifyContent: "center",
  },

  txtTimeMess: {
    textAlign: "center",
  },
});

export default MemberBar;
