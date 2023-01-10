import React from "react";
import { useState, useEffect } from "react";
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  View,
  Image,
  ImageBackground,
} from "react-native";
import { chatApi } from "../api/ApiChat";
import { messageApi } from "../api/ApiMessage";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GroupBar = ({ listInfor, onPress }) => {
  const [chatId, setChatId] = useState();
  const [disMess, setDisMess] = useState();
  const [disTime, setDisTime] = useState("");
  const getOneMess = async () => {
    console.log("GROUP BAR HOAT DONG 2");
    const idUser = await AsyncStorage.getItem("idUser");

    if (idUser === "") {
    } else {
      setChatId(listInfor._id);

      const messagesData = await messageApi.getOneMessage(chatId);

      if (messagesData.data === null) {
        setDisMess("Các bạn chưa có cuộc trò chuyện nào !");
        setDisTime("");
      } else {
        const date = new Date(messagesData.data.createdAt);
        let hour = date.getHours();
        let minute = date.getMinutes();
        if (hour < 10) {
          hour = "0" + hour;
        }
        if (minute < 10) {
          minute = "0" + minute;
        }
        setDisTime(hour + ":" + minute);

        if (messagesData.data.senderId === idUser) {
          if (messagesData.data.isImg === true) {
            setDisMess("Bạn đã gửi 1 hình ảnh!");
          } else if (
            (messagesData.data.isImg === undefined &&
              messagesData.data.isFileWord === true) ||
            messagesData.data.isFilePdf === true ||
            messagesData.data.isFilePowP === true ||
            messagesData.data.isFileExel === true
          ) {
            setDisMess("Bạn đã gửi 1 file!");
          } else {
            setDisMess("Bạn: " + messagesData.data.text);
          }
        } else {
          if (messagesData.data.isImg === true) {
            setDisMess("Đã gửi 1 hình ảnh!");
          } else if (
            (messagesData.data.isImg === undefined &&
              messagesData.data.isFileWord === true) ||
            messagesData.data.isFilePdf === true ||
            messagesData.data.isFilePowP === true ||
            messagesData.data.isFileExel === true
          ) {
            setDisMess("Đã gửi 1 file!");
          } else {
            setDisMess(messagesData.data.text);
          }
        }
      }
    }
  };

  useEffect(() => {
    console.log("GROUP BAR HOAT DONG 1");
    getOneMess();
  }, [chatId]); // ?

  return (
    <TouchableOpacity style={styles.aMess} onPress={onPress}>
      <View style={styles.aMess_avt}>
        <Image
          source={{ uri: listInfor.imgGroupChat }}
          style={styles.wrapAvatarZL}
        />
      </View>
      <View style={styles.aMess_right}>
        <View style={styles.name_and_disMess}>
          <Text style={styles.txtNameMess}>{listInfor.nameGroupChat}</Text>
          <Text numberOfLines={1} style={styles.txtDisMess}>
            {disMess}
          </Text>
        </View>
        <View style={styles.xxxDiff}>
          <Text style={styles.txtTimeMess}>{disTime}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  aMess: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
  },

  aMess_avt: {
    justifyContent: "center",
    alignItems: "center",
    width: "15%",
  },

  aMess_right: {
    flexDirection: "row",
    width: "80%",
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
    width: "85%",
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
    width: "15%",
    maxWidth: 60,
    alignItems: "center",
    justifyContent: "center",
  },

  txtTimeMess: {
    textAlign: "center",
  },
  // end list message
});

export default GroupBar;
