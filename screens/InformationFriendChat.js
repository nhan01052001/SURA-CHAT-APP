import React, { useEffect, useState } from "react";
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
  Alert,
} from "react-native";
import FileComponent from "../components/FileComponent";
import {
  BackIcon,
  BellIcon,
  BlockIcon,
  FileIcon,
  GeneralGroupIcon,
  NextIcon,
  NotificationIcon,
  PersonalIcon,
  SearchICon,
} from "../components/IconBottomTabs";
import ImageComponent from "../components/ImageComponent";
import { ApiGetUser } from "../api/ApiUser";
import GlobalStyles from "../components/GlobalStyles";
import { TestGetFromHeroku } from "../api/ApiUser";
import ApiLoadFriend from "../api/ApiLoadFriend";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

export const InformationFriendChat = ({ navigation, route }) => {
  const idFriend = route.params;
  const [name, setName] = useState();
  const [bio, setBio] = useState();
  const [avatar, setAvatar] = useState();

  useEffect(() => {
    const getProfile = async () => {
      if (idFriend.idFriend === "") {
        console.log("id null");
      } else {
        const data = await ApiGetUser.getProfileUserFromId(idFriend.idFriend);
        if (data.data === null) {
          console.log("Khong lay duoc du lieu");
        } else {
          setAvatar(data.data.avatar);
          setName(data.data.name);
          setBio(data.data.introducePersonal);
        }
      }
    };
    getProfile();
  }, []);

  const handleDeleteFriend = async () => {
    const token = await AsyncStorage.getItem("token");
    if (idFriend.idFriend === "") {
      console.log("id null");
    } else {
      const deleteFriend = await ApiLoadFriend.deleteFriend(
        token,
        idFriend.idFriend
      );
      if (deleteFriend.status === 200) {
        Alert.alert("Xoa thanh cong");
        navigation.replace("BottomTabsNavigator");
      } else {
        console.log("Xoa Khong Thanh Cong!");
      }
    }
  };

  const askDeleteFriend = () => {
    Alert.alert(`Bạn có chắc là muốn xoá kết bạn không?`, "", [
      {
        text: "Không xoá",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "Xoá", onPress: () => handleDeleteFriend() },
    ]);
  };

  const handleSearchMessage = () => {
    Alert.alert(
      "Chức năng tìm tin nhắn sẽ được cập nhật ở phiên bản tiếp theo!" +
        `\n Cảm ơn.`
    );
  };

  const handleXemTrangCaNhan = () => {
    Alert.alert(
      "Chức năng xem trang cá nhân của bạn bè sẽ được cập nhật ở phiên bản tiếp theo!" +
        `\n Cảm ơn.`
    );
  };

  const handleTurnOffNotification = () => {
    Alert.alert(
      "Chức năng tắt thông báo sẽ được cập nhật ở phiên bản tiếp theo!" +
        `\n Cảm ơn.`
    );
  };

  const handleBlockFriend = () => {
    Alert.alert(
      "Chức năng chặn sẽ được cập nhật ở phiên bản tiếp theo!" + `\n Cảm ơn.`
    );
  };

  return (
    <View style={[styles.container, GlobalStyles.droidSafeArea]}>
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
            <Text>{name}</Text>
            <Text>{bio}</Text>
          </View>
          <View
            style={{
              width: "100%",
              justifyContent: "space-evenly",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <TouchableOpacity
              onPress={() => handleSearchMessage()}
              style={{
                justifyContent: "center",
                alignItems: "center",

                width: "20%",
              }}
            >
              <SearchICon color="#000" size={size} />
              <Text style={{ textAlign: "center" }}>Tìm tin nhắn</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleXemTrangCaNhan()}
              style={{
                justifyContent: "center",
                alignItems: "center",

                width: "20%",
              }}
            >
              <PersonalIcon color="#000" size={size} />
              <Text style={{ textAlign: "center" }}>Trang cá nhân</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleTurnOffNotification()}
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
              onPress={() => handleBlockFriend()}
              style={{
                justifyContent: "center",
                alignItems: "center",
                width: "20%",
              }}
            >
              <BlockIcon color="#000" size={size} />
              <Text style={{ textAlign: "center" }}>Chặn</Text>
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
          // marginBottom: 50,
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
            Tuỳ chỉnh
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
                <Text style={styles.textCustomIn4Chat}>Chủ đề</Text>
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
          {/* Anh va file da gui */}
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
            onPress={() =>
              navigation.navigate("SC_ImageAndFilesSent", {
                chatId: route.params.chatId,
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

          {/* an cuoc tro chuyen */}
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
                <Image source={require("../assets/hide.png")} />
              </View>
              <View style={styles.wrapTextCustomIn4Chat}>
                <Text style={styles.textCustomIn4Chat}>Ẩn cuộc trò chuyện</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* xoa tro truyen */}
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
            onPress={() => askDeleteFriend()}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View style={[styles.wrapIconCustomIn4Chat]}>
                <Image source={require("../assets/bin.png")} />
              </View>
              <View
                style={[styles.wrapTextCustomIn4Chat, { borderBottomWidth: 0 }]}
              >
                <Text style={styles.textCustomIn4Chat}>Xoá bạn bè</Text>
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
            marginBottom: 24,
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
      </ScrollView>

      {/* <View style={styles.content}></View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    // height: 1000,
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
    height: "35%",
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
