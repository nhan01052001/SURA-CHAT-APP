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

const { width } = Dimensions.get("window");
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

const deviceWidth = Dimensions.get("window").width;
const deviceHeight =
  Platform.OS === "ios"
    ? Dimensions.get("window").height
    : require("react-native-extra-dimensions-android").get(
        "REAL_WINDOW_HEIGHT"
      );

export const InformationGroupChat = ({ navigation, route }) => {
  const idGroup = route.params;
  console.log(idGroup.idGroup);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState();
  const [idUser, setIdUser] = useState("");
  const [idAdmin, setIdAdmin] = useState("");
  const [modalUpdateGroup, setModalUpdateGroup] = useState(false);
  const [newName, setNewName] = useState("");

  // const getFriend = useCallback(async () => {
  //   const token = await AsyncStorage.getItem("token");
  //   await ApiLoadFriend.getFriend(token)
  //     .then((res) => {
  //       // console.log("get friend 2");
  //       // console.log(res.data.listFriend);
  //       setInfor(
  //         res.data.listFriend.filter((element) => {
  //           return element !== null;
  //         })
  //       );
  //     })
  //     .catch((err) => {
  //       console.log("405");
  //     });
  // }, []);

  // useEffect(() => {
  //   getFriend();
  // }, []);

  useEffect(() => {
    const getProfile = async () => {
      setIdUser(await AsyncStorage.getItem("idUser"));
      console.log(idGroup.idGroup);
      if (idGroup.idGroup === "") {
        console.log("id null");
      } else {
        const data = await ApiLoadGroupChat.getInforGroupChat(idGroup.idGroup);
        if (data.data === null) {
          console.log("Khong lay duoc du lieu");
        } else {
          setAvatar(data.data.imgGroupChat);
          setName(data.data.nameGroupChat);
          setIdAdmin(data.data.adminGroup);
          // await ApiLoadGroupChat.getMemberGroupChat(data.data._id)
          //   .then((res) => {
          //     console.log("-=-=--=-=-=-=-=-=-");
          //     console.log(res.data.length);
          //     setListMember(
          //       res.data.filter((element) => {
          //         return element !== null;
          //       })
          //     );
          //   })
          //   .catch((err) => {
          //     console.log("410 " + err);
          //   });
        }
      }
    };
    getProfile();
  }, []);

  const openModalUpdateGroup = () => {
    setModalUpdateGroup(!modalUpdateGroup);
  };

  const leaveGroup = async () => {
    const token = await AsyncStorage.getItem("token");
    if (idUser === "" || idAdmin === "" || idGroup.idGroup == "") {
      console.log("khong co idUer or idAdmin");
    } else {
      if (idUser === idAdmin) {
        Alert.alert(
          "Bạn đang là trưởng nhóm." +
            `\n Hãy nhường quyền trưởng nhóm cho 1 thành viên khác trước khi rời nhóm!`
        );
        navigation.navigate("SC_ListMember", {
          idGroup,
          transferRights: 1,
        });
      } else {
        const sttLeaveGroup = await ApiLoadGroupChat.leaveGroup(
          token,
          idGroup.idGroup
        );
        if (sttLeaveGroup.status === 201) {
          Alert.alert("Roi nhom thanh cong");
          navigation.replace("BottomTabsNavigator");
        }
      }
    }
  };

  const deleteGroup = async () => {
    if (idGroup.idGroup === "") {
    } else {
      const data = await ApiLoadGroupChat.deleteGroup(idGroup.idGroup);
      if (data.status === 204) {
        Alert.alert("Giải tán nhóm thành công");
        navigation.replace("BottomTabsNavigator");
      }
    }
  };

  const askDeleteGroup = () => {
    Alert.alert(`Bạn có chắc là muốn giải tán nhóm này không?`, "", [
      {
        text: "Không",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "Có", onPress: () => deleteGroup() },
    ]);
  };

  const askLeaveGroup = () => {
    Alert.alert(`Bạn có chắc là muốn rời khỏi nhóm này không?`, "", [
      {
        text: "Không",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "Có", onPress: () => leaveGroup() },
    ]);
  };

  return (
    <View style={[styles.container, GlobalStyles.droidSafeArea]}>
      <View style={styles.tabBarChat}>
        <TouchableOpacity
          style={[styles.icon, { flexDirection: "row" }]}
          onPress={() => navigation.goBack("SC_Chat")}
        >
          <BackIcon color="white" size={size} />
          <Text style={{ fontSize: 20, fontWeight: "500", color: "#fff" }}>
            Quay lại
          </Text>
        </TouchableOpacity>
        {idAdmin === idUser ? (
          <View style={{ position: "absolute", right: 10 }}>
            <TouchableOpacity
              style={[styles.icon, { flexDirection: "row" }]}
              onPress={openModalUpdateGroup}
            >
              <Image source={require("../assets/signature.png")} />
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "500",
                  color: "#fff",
                  marginLeft: 15,
                }}
              >
                Sửa
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          ""
        )}
      </View>
      <View style={styles.informationMain}>
        <View style={styles.wrapAvatar_Name_Bio}>
          <Image
            source={{ uri: avatar }}
            style={[
              styles.image,
              {
                width: 100,
                height: 100,
                borderRadius: 120,
                borderWidth: 4,
              },
            ]}
            resizeMode={"stretch"}
          />
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Pressable>
              <Text style={{ fontSize: 16, fontWeight: "500", color: "#000" }}>
                {name}
              </Text>
            </Pressable>
          </View>
          <View
            style={{
              width: "100%",
              justifyContent: "space-evenly",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            {idAdmin === idUser ? (
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignItems: "center",

                  width: "20%",
                }}
                onPress={() =>
                  navigation.navigate("SC_ListMember", {
                    idGroup,
                    transferRights: 1,
                  })
                }
              >
                <Image source={require("../assets/software-engineer.png")} />
                <Text style={{ textAlign: "center" }}>Nhường quyền </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignItems: "center",

                  width: "20%",
                }}
              >
                <SearchICon color="#000" size={size} />
                <Text style={{ textAlign: "center" }}>Tìm tin nhắn</Text>
              </TouchableOpacity>
            )}

            {idAdmin === idUser ? (
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignItems: "center",

                  width: "20%",
                }}
                onPress={() =>
                  navigation.navigate("AddMemberToTheGroup", { idGroup })
                }
              >
                <AddNewIcon color="#000" size={size} />
                <Text style={{ textAlign: "center" }}>Thêm thành viên</Text>
              </TouchableOpacity>
            ) : (
              ""
            )}

            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignItems: "center",

                width: "20%",
              }}
            >
              <BellIcon color="#000" size={size} />
              <Text style={{ textAlign: "center" }}>Tắt thông báo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignItems: "center",
                width: "20%",
              }}
              onPress={() => askLeaveGroup()}
            >
              <LeaveGroup color="#000" size={size} />
              <Text style={{ textAlign: "center" }}>Rời nhóm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View
        style={{ width: "100%", height: 5, backgroundColor: "#ccc" }}
      ></View>

      <ScrollView
        style={{
          paddingHorizontal: 24,
          height: "100%",
        }}
      >
        {/* tuy chinh */}
        <View style={{ marginTop: 24 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#6e6d6d",
            }}
          >
            Tuỳ chỉnh nhóm
          </Text>
        </View>
        <View
          style={{
            marginTop: 5,
            backgroundColor: "#dbdbdb",
            borderRadius: 10,
          }}
        >
          {/* chu de */}
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
            // onPress={openModalSearch}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {/* <ListMember color="#009EFF" size={50} /> */}
              <View style={styles.wrapIconCustomIn4Chat}>
                <Image source={require("../assets/colour.png")} />
              </View>
              <View style={styles.wrapTextCustomIn4Chat}>
                <Text style={styles.textCustomIn4Chat}>Chủ đề nhóm</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* bieu tuong cam xuc */}
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
            // onPress={openModalSearch}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View style={styles.wrapIconCustomIn4Chat}>
                <Image source={require("../assets/like.png")} />
              </View>
              <View style={styles.wrapTextCustomIn4Chat}>
                <Text style={styles.textCustomIn4Chat}>Biểu tượng cảm xúc</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* biet danh */}
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              // marginBottom: 12,
            }}
            // onPress={openModalSearch}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View style={[styles.wrapIconCustomIn4Chat]}>
                <Image source={require("../assets/blocks.png")} />
              </View>
              <View
                style={[styles.wrapTextCustomIn4Chat, { borderBottomWidth: 0 }]}
              >
                <Text style={styles.textCustomIn4Chat}>Biệt danh</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* khac */}

        <View style={{ marginTop: 24 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#6e6d6d",
            }}
          >
            Khác
          </Text>
        </View>
        <View
          style={{
            marginTop: 5,
            backgroundColor: "#dbdbdb",
            borderRadius: 10,
          }}
        >
          {/* Xem danh sach thanh vien chat */}
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
            onPress={() =>
              navigation.navigate("SC_ListMember", {
                idGroup,
                transferRights: 0,
              })
            }
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View style={styles.wrapIconCustomIn4Chat}>
                <Image source={require("../assets/skill.png")} />
              </View>
              <View style={styles.wrapTextCustomIn4Chat}>
                <Text style={styles.textCustomIn4Chat}>
                  Danh sách thành viên
                </Text>
              </View>
              <View
                style={{
                  position: "absolute",
                  right: 0,
                  top: "33%",
                }}
              >
                <NextIcon size={50} color="#000" />
              </View>
            </View>
          </TouchableOpacity>

          {/* Anh va file da gui */}
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
            onPress={() =>
              navigation.navigate("SC_ImageAndFilesSent", {
                chatId: idGroup.idGroup,
              })
            }
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View style={styles.wrapIconCustomIn4Chat}>
                <Image source={require("../assets/image.png")} />
              </View>
              <View style={styles.wrapTextCustomIn4Chat}>
                <Text style={styles.textCustomIn4Chat}>Ảnh và file đã gửi</Text>
              </View>
              <View
                style={{
                  position: "absolute",
                  right: 0,
                  top: "33%",
                }}
              >
                <NextIcon size={50} color="#000" />
              </View>
            </View>
          </TouchableOpacity>
        </View>
        {/* ---- */}

        {/* ho tro */}
        <View style={{ marginTop: 24 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#6e6d6d",
            }}
          >
            Hỗ trợ
          </Text>
        </View>
        <View
          style={{
            marginTop: 5,
            backgroundColor: "#dbdbdb",
            borderRadius: 10,
            // marginBottom: 24,
          }}
        >
          {/* bao cao */}
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View style={[styles.wrapIconCustomIn4Chat]}>
                <Image source={require("../assets/warning.png")} />
              </View>
              <View
                style={[styles.wrapTextCustomIn4Chat, { borderBottomWidth: 0 }]}
              >
                <Text style={styles.textCustomIn4Chat}>Báo cáo</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        {/* --- */}

        {/* giai than nhom */}
        {idAdmin === idUser ? (
          <View
            style={{
              marginTop: 24,
              // marginTop: 5,
              backgroundColor: "#dbdbdb",
              borderRadius: 10,
              marginBottom: 48,
            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => askDeleteGroup()}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View style={[styles.wrapIconCustomIn4Chat]}>
                  <Image source={require("../assets/cancel.png")} />
                </View>
                <View
                  style={[
                    styles.wrapTextCustomIn4Chat,
                    { borderBottomWidth: 0 },
                  ]}
                >
                  <Text style={styles.textCustomIn4Chat}>Giải tán nhóm</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ marginBottom: 48 }}></View>
        )}
      </ScrollView>

      {/* {idAdmin === idUser ? (
        <View style={{ paddingHorizontal: 24, marginTop: 15 }}>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 5,
              borderBottomWidth: 1,
              justifyContent: "center",
            }}
            onPress={deleteGroup}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image source={require("../assets/cancel.png")} />
              <Text
                style={{
                  fontSize: 18,
                  color: "#000",
                  fontWeight: "600",
                  marginLeft: 10,
                }}
              >
                Giải tán nhóm
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      ) : (
        ""
      )} */}

      {/* modal update group */}
      <View>
        <Modal
          isVisible={modalUpdateGroup}
          onBackdropPress={() => setModalUpdateGroup(false)}
          deviceWidth={deviceWidth}
          deviceHeight={deviceHeight}
        >
          <View
            style={{
              height: "40%",
              backgroundColor: "#fff",
              padding: 24,
              alignItems: "center",
              borderRadius: 30,
            }}
          >
            <View style={{ width: "100%" }}>
              <View style={{ width: "100%", alignItems: "center" }}>
                <TouchableOpacity>
                  <View
                    style={{
                      height: 100,
                      width: 100,
                      borderRadius: 50,
                      overflow: "hidden",
                      position: "absolute",
                      bottom: 0,
                      zIndex: 1,
                    }}
                  >
                    <View
                      style={{
                        // backgroundColor: "red",
                        height: 50,
                        width: 100,
                      }}
                    />
                    <View
                      style={{
                        backgroundColor: "rgba(52, 52, 52, 0.6)",
                        height: 50,
                        width: 100,
                        // opacity: 0.5,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ color: "#fff", fontWeight: "700" }}>
                        Sửa
                      </Text>
                    </View>
                  </View>
                  <Image
                    source={{ uri: avatar }}
                    style={[
                      styles.image,
                      {
                        width: 100,
                        height: 100,
                        borderRadius: 120,
                        borderWidth: 4,
                      },
                    ]}
                    resizeMode={"stretch"}
                  />
                </TouchableOpacity>
              </View>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <TextInput
                  style={styles.inputBorderBottom}
                  placeholder="Tên mới"
                  placeholderTextColor="#ccc"
                  value={newName}
                  onChangeText={setNewName}
                />
              </View>
            </View>
            <View>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  backgroundColor: "#4eac6d",
                  padding: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 10,
                }}
              >
                <Image source={require("../assets/accept.png")} />
                <Text style={{ fontSize: 16, fontWeight: "500" }}>Xong</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 1000,
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

  informationMain: {
    justifyContent: "center",
    alignItems: "center",
    height: "30%",
    // borderBottomWidth: 1,
  },

  wrapAvatar_Name_Bio: {
    width: "100%",
    height: "100%",
    justifyContent: "space-around",
    alignItems: "center",
  },

  image: {
    // width,
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  content: {
    flex: 1,
    padding: 24,
  },

  textXXX: {
    fontSize: 20,
    color: "#000",
    fontWeight: "500",
    marginBottom: 10,
  },

  wrapImg: {
    height: 80,
    width: 80,
    marginLeft: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  wrapFile: {
    height: 50,
    width: 50,
    marginLeft: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  listImg: {
    marginBottom: 20,
    flex: 1,
  },

  tabBarSearch: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: "#4eac6d",
  },

  wrapTextSearch: {
    width: "100%",
    padding: 10,
    // backgroundColor: 'black',
  },

  txtSearch: {
    fontSize: 16,
    color: "white",
    opacity: 0.5,
  },

  aMess: {
    width: "80%",
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
    height: "100%",
    marginLeft: 5,
    width: "70%",
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
    width: "90%",
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

  inputBorderBottom: {
    fontSize: 18,
    fontWeight: "500",
    color: "black",
    borderBottomColor: "grey",
    borderBottomWidth: 2,
    padding: 10,
    width: "100%",
    marginVertical: 20,
  },

  wrapImg: {
    height: 80,
    width: 80,
    marginLeft: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  wrapFile: {
    height: 50,
    width: 50,
    marginLeft: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  listImg: {
    marginBottom: 20,
    flex: 1,
  },

  wrapIconCustomIn4Chat: {
    width: "20%",
    justifyContent: "center",
    alignItems: "center",
  },

  wrapTextCustomIn4Chat: {
    width: "80%",
    borderBottomWidth: 1,
    paddingVertical: 16,
  },

  textCustomIn4Chat: {
    fontSize: 18,
    color: "#000",
    fontWeight: "600",
    marginLeft: 10,
  },
});
