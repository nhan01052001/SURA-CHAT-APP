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
import SearchFriendBar from "./SearchFriendBar";

const CreateGroupChat2 = ({ setVisible }) => {
  const [groupName, setGroupName] = useState("");
  const [infor, setInfor] = useState([]);
  let aMembers = [];

  const getFriend = useCallback(async () => {
    const token = await AsyncStorage.getItem("token");
    await ApiLoadFriend.getFriend(token)
      .then((res) => {
        console.log("get friend 2");
        console.log(res.data.listFriend);
        setInfor(
          res.data.listFriend.filter((element) => {
            return element !== null;
          })
        );
      })
      .catch((err) => {
        console.log("405");
      });
  }, []);

  useEffect(() => {
    getFriend();
  }, []);

  const closeModal = () => {
    setGroupName("");
    aMembers = [];
    console.log("clear aMembers: ");
    console.log(aMembers);
    setVisible(false);
  };

  const handleCreateRoom = async () => {
    const id = await AsyncStorage.getItem("idUser");
    const token = await AsyncStorage.getItem("token");
    aMembers.unshift({ id: id });
    const data = {
      nameGroupChat: groupName,
      memberChat: aMembers,
    };

    if (aMembers.length < 3) {
      console.log("2");
      console.log(aMembers);
      Alert.alert("So luong thanh vien phai lon hon 2");
    } else {
      for (let i = 0; i < aMembers.length; i++) {
        console.log(aMembers[i]);
        console.log("hihi");
        // ngày mai code tiếp
      }
      try {
        await ApiLoadGroupChat.createGroup(token, data).then(async (res) => {
          console.log("tao group thanh cong");
          console.log(res.data._id);
          const arr = [];
          const idAdmin = res.data.adminGroup;
          const group = res.data;
          console.log("group");
          console.log(group);
          console.log("idAdmin");
          console.log(idAdmin);
          // tao group
          socket.emit("send-notication-group", {
            listIdUser: res.data.memberChat,
            group,
          });
        });
      } catch (error) {
        console.log("Khong tao duoc group: " + error);
      }
      closeModal();
    }
  };

  const handleClick = (item) => {
    // for(let i = 0;)
    aMembers.push({
      id: item._id,
    });
    console.log("item id");
    console.log(item._id);
    console.log("aMembers");
    console.log(aMembers);
  };

  return (
    <View style={styles.modalContainer}>
      <Text style={styles.modalsubheading}>Enter your Group name</Text>
      <TextInput
        style={styles.modalinput}
        placeholder="Group name"
        onChangeText={(value) => setGroupName(value)}
      />
      <View style={{ marginTop: 20 }}>
        <FlatList
          data={infor}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <SearchFriendBar
              onPress={() => handleClick(item)}
              listInfor={item}
            />
          )}
        />
      </View>
      <View style={styles.modalbuttonContainer}>
        <TouchableOpacity style={styles.modalbutton} onPress={handleCreateRoom}>
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

export default CreateGroupChat2;
