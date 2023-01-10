import React from "react";
import { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
  Alert,
  Image,
  FlatList,
  RefreshControl,
  Dimensions,
  TextInput,
  ImageBackground,
} from "react-native";
import GlobalStyles from "../components/GlobalStyles";
import {
  SearchICon,
  QRIcon,
  AddNewIcon,
  XIcon,
} from "../components/IconBottomTabs";
import MessageBar from "../components/MessageBar";
import GroupBar from "../components/GroupBar";
import { PhoneBook } from "./PhoneBook.screen";
import { ApiProfile, ApiUser } from "../api/ApiUser";
import ApiLoadFriend from "../api/ApiLoadFriend";
import ApiLoadGroupChat from "../api/LoadGroupChat";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CreateGroupChat from "../components/CreateGroupChat2";
import socket from "../utils/socket";
import Modal from "react-native-modal";
import FriendBar from "../components/FriendBar";
import friendApi from "../api/ApiRequestFriend";
import { chatApi } from "../api/ApiChat";
import LoadingCircle from "../components/LoadingCircle";

const size = 22;

const deviceWidth = Dimensions.get("window").width;
const deviceHeight =
  Platform.OS === "ios"
    ? Dimensions.get("window").height
    : require("react-native-extra-dimensions-android").get(
        "REAL_WINDOW_HEIGHT"
      );

export const Home = ({ navigation, route }) => {
  const [infor, setInfor] = useState([]);
  const [listGroup, setListGroup] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  // const { token } = route.params;
  const [temp, setTemp] = useState("");
  const [user, setUser] = useState();
  const [visible, setVisible] = useState(false);
  let temp1 = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalSearch, setModalSearch] = useState(false);
  const [valueSearch, setValueSearch] = useState();
  const [listUser, setListUser] = useState([]);
  const [listSearch, setListSearch] = useState([]);
  const [id, setId] = useState("");
  const [modalNotification, setModalNotification] = useState(false);
  const [requestFriends, setRequestFriends] = useState([]);
  const [notification, setNotification] = useState("");
  const [listAll, setListAll] = useState();
  const [modalLoading, setModalLoading] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [avatarAccepted, setAvatarAccepted] = useState();

  console.log(
    "------------------------------------------------------------------"
  );

  const handleCreateGroupChat = () => setVisible(true);

  const handleClick = async (item) => {
    navigation.navigate("SC_Chat", { statusG: 0 });
    await AsyncStorage.setItem("idUser", user._id);
    await AsyncStorage.setItem("idFriend", item._id);
    await AsyncStorage.setItem("currentName", item.name);
    await AsyncStorage.setItem("avatar", item.avatar);
  };

  const handleClick2 = async (item) => {
    navigation.navigate("SC_Chat", { statusG: 1 });
    await AsyncStorage.setItem("idUser", user._id);
    await AsyncStorage.setItem("idFriend", item._id);
    await AsyncStorage.setItem("currentName", item.nameGroupChat);
    await AsyncStorage.setItem("avatar", item.imgGroupChat);
    await AsyncStorage.setItem("idGroupChat", item._id);
    await AsyncStorage.setItem("adminGroup", item.adminGroup);
  };

  const callApiProfile = useCallback(async () => {
    const token = await AsyncStorage.getItem("token");
    setTemp(token);

    await ApiProfile.profile2(token)
      .then((res) => {
        console.log("105");
        setId(res.data._id);

        setUser(res.data);
      })
      .catch((err) => {
        console.log("3");
      });
  }, []);

  useEffect(() => {
    callApiProfile();
  }, []);

  useEffect(() => {
    socket.emit("new-user-add", id);
    socket.on("get-users", (users) => {
      setOnlineUsers(users);
    });
  }, [id]);

  const getFriend = useCallback(async () => {
    const token = await AsyncStorage.getItem("token");
    setModalLoading(true);
    await ApiLoadFriend.getFriend(token)
      .then((res) => {
        console.log("122");
        setInfor(
          res.data.listFriend.filter((element) => {
            return element !== null;
          })
        );
      })
      .catch((err) => {
        console.log("405");
      });

    await ApiLoadGroupChat.getGroupChat(token)
      .then((res) => {
        console.log("135");
        const ff = res.data.listGroup.filter((element) => {
          return element !== null;
        });

        setListGroup(
          res.data.listGroup.filter((element) => {
            return element !== null;
          })
        );
      })
      .catch((err) => {
        console.log("406: " + err);
      });
    setModalLoading(false);
  }, []);

  const reGetFriend = async () => {
    const token = await AsyncStorage.getItem("token");
    await ApiLoadFriend.getFriend(token)
      .then((res) => {
        console.log("155");
        setInfor(
          res.data.listFriend.filter((element) => {
            return element !== null;
          })
        );
      })
      .catch((err) => {
        console.log("405");
      });
  };

  useEffect(() => {
    getFriend();
  }, []);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await handleFetchPalettes();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  });

  useEffect(() => {
    console.log("SOCKET GROUP HOAT DONG");
    socket.on("receive-notication-group", (group) => {
      setListGroup((listGroup) => [
        ...listGroup,
        {
          _id: group._id,
          nameGroupChat: group.nameGroupChat,
          adminGroup: group.adminGroup,
          memberChat: group.memberChat,
          imgGroupChat: group.imgGroupChat,
        },
      ]);
      // console.log("socket group: ");
      // console.log(group);
    });
  }, [socket]);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const openCreateGroup = () => {
    navigation.navigate("CreateGroupChat", { id });
    setModalVisible(!isModalVisible);
  };

  const openModalNotification = () => {
    setModalNotification(!modalNotification);
  };

  const getRequestFriend = async () => {
    const token = await AsyncStorage.getItem("token");
    if (token === "" || token === null || token === undefined) {
      setRequestFriends([]);
    } else {
      const data = await friendApi.getInvitesFriend(token);

      if (data) {
        // console.log("get list request");
        // console.log(data.data.listUser);
        setRequestFriends(data.data.listUser);
      } else {
        console.log("khong co du lieu");
      }
    }
  };

  // lay danh sach gui loi moi ket ban
  useEffect(() => {
    getRequestFriend();
  }, []);

  // tu choi loi moi ket bạn
  const deninedRequestFriendHandle = async (idRequest, friend) => {
    const data = await friendApi.declineFriend(idRequest);
    try {
      if (data.status === 200) {
        console.log("Từ chối thành công");
        // Set lại list
        const listRemoveUserAccept = requestFriends.filter(
          (user) => user.username !== friend.username
        );
        setRequestFriends(listRemoveUserAccept);
        socket.emit("send-require-friend", {
          userFind: friend,
          user: user,
          isDeclined: true,
        });
        console.log("socket-----");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // chap nhan loi moi ket ban va tao phong chat
  const acceptRequestFriendHandle = async (idRequest, friend) => {
    console.log(friend._id + " " + user._id);
    try {
      const data = await friendApi.acceptFriend(idRequest);
      if (data.status === 200) {
        const dataChat = {
          senderId: friend._id,
          receiveId: user._id,
        };
        const creChat = await chatApi.createChat(dataChat);
        if (creChat.status === 200) {
          console.log("Kết bạn thành công");
          socket.emit("send-require-friend", {
            userFind: friend,
            user: user,
            isAccept: true,
          });
          reGetFriend();
        } else {
          console.log("chua tao phong chat");
        }

        // Set lại danh sách yêu cầu
        const listRemoveUserAccept = requestFriends.filter(
          (user) => user.username !== friend.username
        );
        setRequestFriends(listRemoveUserAccept);
        // Gửi thông báo bạn bè kb thành công socket
      }
    } catch (error) {
      console.log(error);
    }
  };

  const RequestFriendBar = ({ requestFriends }) => {
    const idRequest = requestFriends.idRequest;
    return (
      <View
        style={{
          flexDirection: "row",
          borderColor: "#b6b9ba",
          borderBottomWidth: 1,
        }}
      >
        <View style={styles.aMess}>
          <View style={styles.aMess_avt}>
            <Image
              source={{ uri: requestFriends.avatar }}
              style={styles.wrapAvatarZL}
            />
          </View>
          <View style={styles.aMess_right}>
            <View style={styles.name_and_disMess}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Text> {requestFriends.name} đã gửi lời mời kết bạn</Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                width: "40%",
                justifyContent: "space-evenly",
                //   backgroundColor: "red",
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  acceptRequestFriendHandle(idRequest, requestFriends)
                }
              >
                <Image source={require("../assets/accept.png")} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  deninedRequestFriendHandle(idRequest, requestFriends)
                }
              >
                <Image source={require("../assets/cancel.png")} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const AcceptFriend = ({ nameAccept }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          borderColor: "#b6b9ba",
          borderBottomWidth: 1,
        }}
      >
        <View style={styles.aMess}>
          <View style={styles.aMess_avt}>
            <Image
              source={{ uri: avatarAccepted }}
              style={styles.wrapAvatarZL}
            />
          </View>
          <View style={styles.aMess_right}>
            <View style={[styles.name_and_disMess, { width: "90%" }]}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Text style={{ fontSize: "15" }}>
                  {nameAccept} đã đồng ý lời mời kết bạn
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  useEffect(() => {
    socket.on("recieve-require-friend", (data) => {
      // setNotification(`${data.name} vừa mới gửi lời mời kết bạn`);
      // console.log("SOCKET KET BAN HOAT DONG");
      // console.log(data);
      getRequestFriend();
    });
  }, [socket]);

  useEffect(() => {
    socket.on("accept-require-friend", (data) => {
      setNotification(data.user.name);
      setAvatarAccepted(data.user.avatar);
      console.log("SOCKET KET BAN HOAT DONG");
      console.log(data.user.name);
    });
  }, [socket]);

  const openSearchFriend = () => {
    navigation.navigate("SC_Search", {
      id: id,
    });
    setModalVisible(false);
  };

  return (
    <View style={[styles.container]}>
      <View style={styles.tabBarSearch}>
        <TouchableOpacity style={styles.icon}>
          <SearchICon color="#fff" size={size} />
        </TouchableOpacity>
        <Pressable
          style={styles.wrapTextSearch}
          onPress={() => openSearchFriend()}
        >
          <Text style={styles.txtSearch}>Tìm kiếm</Text>
        </Pressable>
        <TouchableOpacity style={styles.icon} onPress={openModalNotification}>
          <Image source={require("../assets/bell.png")} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.icon} onPress={toggleModal}>
          <AddNewIcon color="#fff" size={size} />
        </TouchableOpacity>
      </View>

      {infor.length === 0 && listGroup.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ImageBackground
            source={{
              uri: "https://doot-light.react.themesbrand.com/static/media/pattern-05.ffd181cd.png",
            }}
            resizeMode="cover"
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={{ fontSize: 18, fontWeight: "700" }}>
              Chào mừng bạn đến với SURA CHAT
            </Text>
          </ImageBackground>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          {/* list message */}
          <View style={styles.listMess}>
            <FlatList
              data={infor}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <MessageBar
                  onPress={() => handleClick(item)}
                  listInfor={item}
                />
              )}
              // refreshControl={
              //   <RefreshControl
              //     refreshing={isRefreshing}
              //     onRefresh={handleRefresh}
              //   />
              // }
            />
          </View>
          <View style={styles.listMess}>
            <FlatList
              data={listGroup}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <GroupBar onPress={() => handleClick2(item)} listInfor={item} />
              )}
              // refreshControl={
              //   <RefreshControl
              //     refreshing={isRefreshing}
              //     onRefresh={handleRefresh}
              //   />
              // }
            />
          </View>
        </View>
      )}

      {visible ? <CreateGroupChat setVisible={setVisible} /> : ""}
      {/* modal */}
      <View>
        <Modal
          isVisible={isModalVisible}
          onBackdropPress={() => setModalVisible(false)}
          deviceWidth={deviceWidth}
          deviceHeight={deviceHeight}
          style={{
            justifyContent: "flex-start",
            alignItems: "flex-end",
            marginTop: 90,
            marginRight: 10,
          }}
        >
          <View
            style={{
              width: 200,
              height: 120,
              backgroundColor: "#fff",
              padding: 12,
              justifyContent: "center",
              borderRadius: 10,
            }}
          >
            <View
              style={{
                width: 0,
                height: 0,
                // backgroundColor: "red",
                position: "absolute",
                top: -12,
                right: 7,
                borderLeftWidth: 7,
                borderLeftColor: "rgba(158, 150, 150, .0)",
                borderRightWidth: 7,
                borderRightColor: "rgba(158, 150, 150, .0)",
                borderBottomColor: "#fff",
                borderBottomWidth: 14,
              }}
            ></View>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                // backgroundColor: "red",
                paddingVertical: 5,
                borderBottomWidth: 1,
              }}
              onPress={openCreateGroup}
            >
              <Image source={require("../assets/people.png")} />
              <Text style={{ fontSize: 16, fontWeight: "500", marginLeft: 15 }}>
                Tạo Group
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                // backgroundColor: "red",
                paddingVertical: 5,
                borderBottomWidth: 1,
                marginTop: 5,
              }}
              onPress={() => openSearchFriend()}
            >
              <Image source={require("../assets/add-user.png")} />
              <Text style={{ fontSize: 16, fontWeight: "500", marginLeft: 15 }}>
                Thêm bạn
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>

      {/* modal thong bao */}
      <View>
        <Modal
          isVisible={modalNotification}
          onBackdropPress={() => setModalNotification(false)}
          deviceWidth={deviceWidth}
          deviceHeight={deviceHeight}
          style={{
            justifyContent: "flex-start",
            alignItems: "flex-end",
            marginTop: 50,
            // marginRight: "20%",
          }}
        >
          <View
            style={{
              width: "100%",
              // height: auto,
              backgroundColor: "#fff",
              padding: 12,
              justifyContent: "center",
            }}
          >
            {requestFriends.length === 0 ? (
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                {notification === "" ? (
                  <Text>Không có thông báo nào !</Text>
                ) : (
                  <AcceptFriend nameAccept={notification} />
                )}
              </View>
            ) : (
              <View>
                <FlatList
                  data={requestFriends}
                  keyExtractor={(item) => item._id}
                  renderItem={({ item }) => (
                    <RequestFriendBar requestFriends={item} />
                  )}
                />
                {notification === "" ? "" : <Text>{notification}</Text>}
              </View>
            )}
            <View></View>
          </View>
        </Modal>
      </View>

      {/* modal loading */}
      <View>
        <Modal
          isVisible={modalLoading}
          onBackdropPress={() => setModalLoading(false)}
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <View
            style={{
              width: "100%",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* <LoadingCircle /> */}
            <LoadingCircle />
          </View>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // begin search
  tabBarSearch: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: "#69b4f5",
    paddingTop: 35,
  },

  icon: {
    width: "10%",
    padding: 10,
    marginRight: 5,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: 'red',
  },

  wrapTextSearch: {
    width: "68%",
    padding: 10,
    // backgroundColor: 'black',
  },

  txtSearch: {
    fontSize: 16,
    color: "white",
    // opacity: 0.5,
    fontWeight: "500",
  },
  // end search

  // begin list message
  listMess: {
    flex: 1,
    marginVertical: 2,
  },

  aMess: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },

  aMess_avt: {
    justifyContent: "center",
    alignItems: "center",
    width: "25%",
  },

  aMess_right: {
    flexDirection: "row",
    alignItems: "center",
    height: "100%",
    marginLeft: 5,
    width: "75%",
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
    width: "60%",
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
    width: "10%",
    alignItems: "center",
    justifyContent: "center",
  },

  txtTimeMess: {
    textAlign: "center",
  },
});
