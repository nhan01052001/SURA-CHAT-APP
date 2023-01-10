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
import FileComponent from "../components/FileComponent";
import {
  AddNewIcon,
  BackIcon,
  BellIcon,
  BlockIcon,
  FileIcon,
  GeneralGroupIcon,
  LeaveGroup,
  ListMember,
  NextIcon,
  NotificationIcon,
  PersonalIcon,
  SearchICon,
} from "../components/IconBottomTabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ApiLoadFriend from "../api/ApiLoadFriend";
import ApiLoadGroupChat from "../api/LoadGroupChat";
import SearchFriendBar from "../components/SearchFriendBar";
import LoadingCircleSnail from "../components/LoadingCircleSnail";
import ListAddComponent from "../components/ListAddComponent";

const size = 22;

const DATA = [
  {
    id: 1,
  },
  {
    id: 2,
  },
  {
    id: 3,
  },
  {
    id: 4,
  },
  {
    id: 5,
  },
];

const AddMemberToTheGroup = ({ navigation, route }) => {
  const idGroup = route.params;
  const [valueSearch, setValueSearch] = useState("");
  const [infor, setInfor] = useState([]);
  const [addListMember, setAddListMember] = useState([]);
  const [listMember, setListMember] = useState([]);
  const [loading, setLoading] = useState(true);
  const [temp, setTemp] = useState([]);
  let aMembers = [];
  let member = [];

  const handleClick = (item) => {
    if (temp.length === 0) {
      aMembers.push(item);
      setTemp((temp) => [...temp, ...aMembers]);
    } else {
      for (let i = 0; i < temp.length; i++) {
        if (item._id === temp[i]._id) {
          Alert.alert("Thành viên này đã được thêm vào danh sách!");
          return;
        }
      }
      aMembers.push(item);
      setTemp((temp) => [...temp, ...aMembers]);
    }

    // aMembers = aMembers.filter(
    //   (v, i, a) => a.findIndex((v2) => v2._id === v._id) === i
    // );

    // console.log(aMembers);
  };

  // cach 1
  function removeObjectWithId(arr, _id) {
    // Making a copy with the Array from() method
    const arrCopy = Array.from(arr);

    const objWithIdIndex = arrCopy.findIndex((obj) => obj._id === _id);
    arrCopy.splice(objWithIdIndex, 1);
    return arrCopy;
  }

  // cach 2
  // function removeObjectWithId(arr, _id) {
  //   return arr.filter((obj) => obj._id !== _id);
  // }

  // const newArr = removeObjectWithId(arr, 2);

  const handleDeleteInAddListMember = (item) => {
    const newList = removeObjectWithId(temp, item._id);
    setTemp(newList);
    console.log(newList);
  };

  const getFriend = useCallback(async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("token");
    await ApiLoadFriend.getFriend(token)
      .then((res) => {
        setInfor(
          res.data.listFriend.filter((element) => {
            return element !== null;
          })
        );
      })
      .catch((err) => {
        console.log("405");
      });
    setLoading(false);
  }, []);

  const getProfile = useCallback(async () => {
    setLoading(true);
    if (idGroup.idGroup.idGroup === "") {
      console.log("id null");
    } else {
      const data = await ApiLoadGroupChat.getInforGroupChat(
        idGroup.idGroup.idGroup
      );
      if (data.data === null) {
        console.log("Khong lay duoc du lieu");
      } else {
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
    getFriend();
  }, []);

  useEffect(() => {
    getProfile();
  }, []);

  const getFriendNotInGroup = () => {
    const results = infor.filter(
      ({ _id: id1 }) => !listMember.some(({ _id: id2 }) => id2 === id1)
    );
    setAddListMember(results);
  };

  useEffect(() => {
    getFriendNotInGroup();
  }, [infor, listMember]);

  const btnDone = async () => {
    if (temp.length === 0) {
      Alert.alert("hay bam vao dau + de them vao danh sach");
    } else {
      var arr = [];
      for (let i = 0; i < temp.length; i++) {
        arr.push({
          id: temp[i]._id,
        });
      }

      // console.log(arr);

      const rs = await ApiLoadGroupChat.addUsersToGroup(
        idGroup.idGroup.idGroup,
        arr
      );

      if (rs.status === 200) {
        Alert.alert("Them thanh cong");
        getProfile();
      }
    }
    setTemp([]);
    aMembers = [];
  };

  const ListFriend = () => (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ marginTop: 20, marginRight: 20 }}>
        <FlatList
          data={addListMember}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <SearchFriendBar
              onPress={() => handleClick(item)}
              listInfor={item}
            />
          )}
        />
      </View>
    </View>
  );

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
        <View style={{ position: "absolute", right: 10 }}>
          <TouchableOpacity
            style={[styles.icon, { flexDirection: "row" }]}
            onPress={btnDone}
          >
            <Image source={require("../assets/checked.png")} />
            <Text
              style={{
                fontSize: 20,
                fontWeight: "500",
                color: "#fff",
                marginLeft: 15,
              }}
            >
              Xong
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* content */}
      <View style={{ padding: 24 }}>
        <View style={{ alignItems: "center", marginVertical: 24 }}>
          <Text style={{ fontSize: "22", fontWeight: "700" }}>
            Thêm thành viên vào nhóm
          </Text>
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

        <View style={{ height: "95%" }}>
          <Text>Danh sách</Text>
          {loading === true ? <LoadingCircleSnail /> : <ListFriend />}

          {temp.length === 0 ? (
            ""
          ) : (
            <FlatList
              data={temp}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <ListAddComponent
                  users={item}
                  onPress={() => handleDeleteInAddListMember(item)}
                />
              )}
            />
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

export default AddMemberToTheGroup;
