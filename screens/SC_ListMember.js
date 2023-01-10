import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  FlatList,
  Pressable,
  TextInput,
  Alert,
} from "react-native";
import FileComponent from "../components/FileComponent";
import { BackIcon, SearchICon } from "../components/IconBottomTabs";
import ImageComponent from "../components/ImageComponent";
import { ApiGetUser } from "../api/ApiUser";
import ApiLoadGroupChat from "../api/LoadGroupChat";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GlobalStyles from "../components/GlobalStyles";
import Modal from "react-native-modal";
import { XIcon } from "../components/IconBottomTabs";
import FriendBar from "../components/FriendBar";
import SearchFriendBar from "../components/SearchFriendBar";
import ApiLoadFriend from "../api/ApiLoadFriend";
import MemberChatComponent from "../components/MemberChatComponent";
import LoadingCircle from "../components/LoadingCircle";
import LoadingCircleSnail from "../components/LoadingCircleSnail";

const size = 22;

const SC_ListMember = ({ navigation, route }) => {
  const idGroup = route.params;
  const transferRights = route.params.transferRights;
  const [valueSearch, setValueSearch] = useState("");
  const [listMember, setListMember] = useState([]);
  const [idAdmin, setIdAdmin] = useState("");
  const [idUser, setIdUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [listMemberNotAdmin, setListMemberNotAdmin] = useState([]);
  // console.log();

  const getProfile = useCallback(async () => {
    setLoading(true);
    console.log("loading: true");
    setIdUser(await AsyncStorage.getItem("idUser"));

    if (idGroup.idGroup.idGroup === "") {
      console.log("id null");
    } else {
      const data = await ApiLoadGroupChat.getInforGroupChat(
        idGroup.idGroup.idGroup
      );
      if (data.data === null) {
        console.log("Khong lay duoc du lieu");
      } else {
        setIdAdmin(data.data.adminGroup);
        await ApiLoadGroupChat.getMemberGroupChat(data.data._id)
          .then((res) => {
            setListMember(
              res.data.filter((element) => {
                return element !== null;
              })
            );
          })
          .catch((err) => {
            console.log("410 " + err);
          });
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    getProfile();
  }, []);

  const getListMemberNotAdmin = () => {
    console.log("getListMemberNotAdmin: " + transferRights);
    //setLoading(true);
    const rs = listMember.filter((user) => user._id !== idAdmin);
    setListMemberNotAdmin(rs);
    //setLoading(false);
  };

  useEffect(() => {
    getListMemberNotAdmin();
  }, [listMember]);

  const chooseDeleteUser = async (item) => {
    console.log(item.name);
    const rs = await ApiLoadGroupChat.deleteMemberFromGroup(
      idGroup.idGroup.idGroup,
      item._id
    );
    if (rs.status === 200) {
      Alert.alert("Đã xoá " + item.name + " ra khỏi nhóm!");
      getProfile();
    } else {
      Alert.alert("Xoa khong thanh cong");
    }
  };

  const chooseAdmin = async (item) => {
    console.log(item.name);

    const rs = await ApiLoadGroupChat.franchiesAdmin(
      idGroup.idGroup.idGroup,
      item._id
    );
    if (rs.status === 200) {
      Alert.alert("Nhường quyền admin thành công cho " + item.name);
      navigation.replace("InformationGroupChat", {
        idGroup: idGroup.idGroup.idGroup,
      });
    }
  };

  const askDelete = (item) => {
    if (transferRights === 0) {
      Alert.alert(`Bạn có chắc là xoá ${item.name} ra khỏi nhóm ?`, "", [
        {
          text: "Không xoá",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Xoá", onPress: () => chooseDeleteUser(item) },
      ]);
    } else {
      Alert.alert(
        `Bạn có chắc là nhường quyền quản trị nhóm cho ${item.name} không ?`,
        "",
        [
          {
            text: "Không",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "Có", onPress: () => chooseAdmin(item) },
        ]
      );
    }
  };

  return (
    <View style={[styles.container, { paddingTop: 35 }]}>
      <View style={styles.tabBarChat}>
        <TouchableOpacity
          style={[styles.icon, { flexDirection: "row" }]}
          onPress={() => navigation.goBack()}
        >
          <BackIcon color="white" size={size} />
          <Text style={{ fontSize: 20, fontWeight: "500", color: "#fff" }}>
            Quay lại
          </Text>
        </TouchableOpacity>
      </View>

      {/* content */}
      <View style={{ padding: 24 }}>
        <View style={{ alignItems: "center", marginVertical: 24 }}>
          {transferRights === 0 ? (
            <Text style={{ fontSize: "22", fontWeight: "700" }}>
              Danh sách thành viên
            </Text>
          ) : (
            <Text style={{ fontSize: "22", fontWeight: "700" }}>
              Nhường quyền quản trị nhóm
            </Text>
          )}
        </View>
        <View
          style={{
            backgroundColor: "#fff",
            flexDirection: "row",
            alignItems: "center",
            borderRadius: 20,
            paddingLeft: 10,
            width: "100%",
            borderColor: "#ccc",
            borderWidth: 1,
            marginVertical: 24,
          }}
        >
          <SearchICon color="#000" size={22} />
          <TextInput
            value={valueSearch}
            onChangeText={(obj) => setValueSearch(obj)}
            placeholder="Tìm thành viên"
            placeholderTextColor="#939995"
            style={{
              fontSize: 16,
              fontWeight: "500",
              color: "#000",
              padding: 12,
              width: "80%",
            }}
          />
        </View>

        {/* List */}

        <View style={{ height: "100%" }}>
          <Text>Danh sách</Text>
          {loading === true ? (
            <LoadingCircleSnail />
          ) : (
            <View>
              {transferRights === 0 ? (
                <FlatList
                  data={listMember}
                  keyExtractor={(item) => item._id}
                  renderItem={({ item }) => (
                    <MemberChatComponent
                      members={item}
                      admin={idAdmin}
                      user={idUser}
                      transferRights={transferRights}
                      // onPress={() => chooseDeleteUser(item)}
                      onPress={() => askDelete(item)}
                    />
                  )}
                />
              ) : (
                <FlatList
                  data={listMemberNotAdmin}
                  keyExtractor={(item) => item._id}
                  renderItem={({ item }) => (
                    <MemberChatComponent
                      members={item}
                      admin={idAdmin}
                      user={idUser}
                      transferRights={transferRights}
                      // onPress={() => chooseDeleteUser(item)}
                      onPress={() => askDelete(item)}
                    />
                  )}
                />
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  tabBarChat: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: "#4eac6dd4",
    paddingVertical: 5,
  },

  icon: {
    // width: "10%",
    padding: 10,
    marginRight: 5,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SC_ListMember;
