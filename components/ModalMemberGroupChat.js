import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import socket from "../utils/socket";
import { styles } from "../utils/styles";
import MessageBar from "./MessageBar";
import ApiLoadFriend from "../api/ApiLoadFriend";
import ApiLoadGroupChat from "../api/LoadGroupChat";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MemberBar from "./MemberBar";

const ModalMemberGroupChat = ({ setVisible }) => {
  const [member, setMember] = useState("");
  const [infor, setInfor] = useState([]);
  let aMembers = [];

  const getListMember = useCallback(async () => {
    const idGroupChat = await AsyncStorage.getItem("idGroupChat");

    await ApiLoadGroupChat.getMemberGroupChat(idGroupChat)
      .then((res) => {
        console.log("-=-=--=-=-=-=-=-=-");
        console.log(res.data);
        setInfor(
          res.data.filter((element) => {
            return element !== null;
          })
        );
      })
      .catch((err) => {
        console.log("410 " + err);
      });
  }, []);

  useEffect(() => {
    getListMember();
  }, []);

  const closeModal = () => {
    setMember("");
    aMembers = [];
    console.log("clear aMembers: ");
    console.log(aMembers);
    setVisible(false);
  };

  const deleteMember = async (item) => {
    console.log("runnnnnn");
    const idGroupChat = await AsyncStorage.getItem("idGroupChat");

    const idUser = await AsyncStorage.getItem("idUser");
    const adminGroup = await AsyncStorage.getItem("adminGroup");
    console.log("admin");
    console.log(adminGroup);

    const data = {
      _id: idGroupChat,
      idUserDeleted: item._id,
    };

    if (idUser === adminGroup) {
      await ApiLoadGroupChat.deleteUserFromGroupChat(data)
        .then((res) => {
          console.log(res.data);
          closeModal();
        })
        .catch((err) => {
          console.log("411 " + err);
        });
    } else {
      Alert.alert("bạn không có quyền xoá thành viên !");
    }

    console.log(item._id);
  };

  return (
    <View style={styles.modalContainer}>
      <Text style={styles.modalsubheading}>Tìm thành viên chat</Text>
      <TextInput
        style={styles.modalinput}
        placeholder="Tìm kiếm"
        onChangeText={(value) => setMember(value)}
      />
      <View style={{ marginTop: 20 }}>
        <FlatList
          data={infor}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <MemberBar onPress={() => deleteMember(item)} listInfor={item} />
          )}
        />
      </View>
      <View style={styles.modalbuttonContainer}>
        <TouchableOpacity style={styles.modalbutton}>
          <Text style={styles.modaltext}>CREATE</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modalbutton, { backgroundColor: "#E14D2A" }]}
          onPress={closeModal}
        >
          <Text style={styles.modaltext}>CANCEL</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ModalMemberGroupChat;
