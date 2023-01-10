import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Image,
  SafeAreaView,
  Alert,
  FlatList,
  TextInput,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import {
  BackIcon,
  PhoneIcon,
  VideoIcon,
  OptionIcon,
  SendIcon,
  ImgIcon,
  FileIcon,
} from "../components/IconBottomTabs";
import { GiftedChat } from "react-native-gifted-chat";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ApiProfile, ApiUser } from "../api/ApiUser";
import { chatApi } from "../api/ApiChat";
import { messageApi } from "../api/ApiMessage";
import axios from "axios";
import MessageComponent from "../components/MessageComponent";
import ModalMemberGroupChat from "../components/ModalMemberGroupChat";
import socket from "../utils/socket";
import * as ImagePicker from "expo-image-picker";
import GlobalStyles from "../components/GlobalStyles";
import { firebase } from "../config";
import Modal from "react-native-modal";
import LoadingCircle from "../components/LoadingCircle";
import { apiFirebase } from "../api/ApiFirebase";
import LoadingCircleSnail from "../components/LoadingCircleSnail";
import uuid from "uuid";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ListItemSubtitle } from "@rneui/base/dist/ListItem/ListItem.Subtitle";
// import SimpleToast from "react-native-simple-toast";

const size = 24;

const items = [
  {
    key: 1,
    name: "Nhan",
  },
  {
    key: 2,
    name: "Nhan 2",
  },
  {
    key: 3,
    name: "Nhan 3",
  },
];

const SC_Chat = ({ navigation, route }) => {
  const [currentName, setCurrentName] = useState("");
  const [avatar, setAvatar] = useState();
  const [idUser, setIdUser] = useState("");
  const [idFriend, setIdFriend] = useState("");
  const [chatId, setChatId] = useState("");
  const [receivedMessage, setReceivedMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [visible, setVisible] = useState(false);
  const [statusInputMess, setStatusInputMess] = useState(false);
  const [image, setImage] = useState(null);
  const [token, setToken] = useState("");
  const [groupChatId, setGroupChatId] = useState("");
  const { statusG } = route.params;
  const [wellCome, setWellCome] = useState("");
  const [sttWell, setSttWell] = useState();
  const messagesEndRef = useRef(null);
  const [sendMessImg, setSendMessImg] = useState();
  const [modalLoading, setModalLoading] = useState(false);
  const [messageGetFromSocket, setMessageGetFromSocket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  let listViewRef;
  let valueInverted = true;

  // const handleOpenMemberChat = () => setVisible(true);

  const getId = async () => {
    setGroupChatId(await AsyncStorage.getItem("idGroupChat"));
    setToken(await AsyncStorage.getItem("token"));
    setCurrentName(await AsyncStorage.getItem("currentName"));
    setAvatar(await AsyncStorage.getItem("avatar"));
    setIdFriend(await AsyncStorage.getItem("idFriend"));
    setIdUser(await AsyncStorage.getItem("idUser"));
  };

  useEffect(() => {
    getId();
  }, [idFriend]);

  useEffect(() => {
    socket.emit("new-user-add", idUser);
    socket.on("get-users", (users) => {
      setOnlineUsers(users);
    });
  }, [idUser]);

  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState("");
  const [messageDis, setMessageDis] = useState([]);

  const scrollToEnd = () => {
    listViewRef.scrollToEnd({ animated: true });
    // Toast.show("Hihi");
  };

  const handleNewMessage = async () => {
    const messageSender = {
      chatId,
      senderId: idUser,
      text: message,
    };

    const data = await messageApi.addMessage(messageSender);

    const hour =
      new Date().getHours() < 10
        ? `0${new Date().getHours()}`
        : `${new Date().getHours()}`;

    const mins =
      new Date().getMinutes() < 10
        ? `0${new Date().getMinutes()}`
        : `${new Date().getMinutes()}`;

    const time = `${hour}:${mins}`;

    if (data.status === 200) {
      if (message !== null) {
        socket.emit("send-message", {
          chatId,
          senderId: idUser,
          text: message,
          receiverId: idFriend,
          time,
          isImg: false,
        });
      }

      // setChatMessages((chatMessages) => [
      //   ...chatMessages,
      //   { ...messageSender, time },
      // ]);
      setMessage("");
    }

    setMessage("");
  };

  async function uploadImageAsync(uri, fileName) {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        // console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    const ref = firebase.storage().ref().child(`MessageImage/${fileName}`);
    const snapshot = await ref.put(blob);

    // We're done with the blob, close and release it
    blob.close();

    return await snapshot.ref.getDownloadURL();
  }

  const chooseImg = async () => {
    let rs = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      // base64: true,
    });

    if (!rs.canceled) {
      setIsLoadingImage(true);
      const hour =
        new Date().getHours() < 10
          ? `0${new Date().getHours()}`
          : `${new Date().getHours()}`;

      const mins =
        new Date().getMinutes() < 10
          ? `0${new Date().getMinutes()}`
          : `${new Date().getMinutes()}`;

      const time = `${hour}:${mins}`;
      const uri = rs.assets[0].uri;

      let fileExtension = uri.substring(uri.lastIndexOf(".") + 1);
      const isImg = rs.assets[0].type == "image" ? true : false;
      const type = fileExtension;

      const token = await AsyncStorage.getItem("token");
      const fileName = uri.substring(uri.lastIndexOf("/") + 1, uri.length);

      const uploadUrl = await uploadImageAsync(uri, fileName);

      if (uploadUrl.length !== 0) {
        const data = {
          chatId,
          text: uploadUrl,
          type,
          fileName,
        };

        const messageSender = {
          chatId,
          senderId: idUser,
          text: uploadUrl,
          isImg: true,
        };
        const result = await apiFirebase.uploadMessageImage(token, data);
        if (result.status === 200) {
          socket.emit("send-message", {
            chatId,
            senderId: idUser,
            text: uploadUrl,
            receiverId: idFriend,
            isImg: true,
            time,
          });
        } else {
          Alert.alert("Khong gui duoc hinh anh!");
        }
        // setChatMessages((chatMessages) => [
        //   ...chatMessages,
        //   { ...messageSender, time },
        // ]);
      } else {
        Alert.alert("Khong gui duoc hinh anh");
      }

      setIsLoadingImage(false);
    }
  };

  // cach cu
  // const chooseImg = async () => {
  //   let rs = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.All,
  //     // allowsEditing: true,
  //     aspect: [4, 3],
  //     quality: 1,
  //     base64: true,
  //   });

  //   let uri = rs.uri;

  //   let fileExtension = uri.substring(uri.lastIndexOf(".") + 1);
  //   const isImg = rs.type == "image" ? true : false;
  //   const type = fileExtension;

  //   const base64Img = `data:image/jpg;base64,${rs.base64}`;
  //   const token = await AsyncStorage.getItem("token");
  //   const fileName = rs.uri.substring(
  //     rs.uri.lastIndexOf("/") + 1,
  //     rs.uri.length
  //   );

  //   if (rs.canceled === false) {
  //     const data = await cloudinaryApi.cloudinaryUpload(
  //       base64Img,
  //       token,
  //       chatId,
  //       type,
  //       fileName
  //     );

  //     const hour =
  //       new Date().getHours() < 10
  //         ? `0${new Date().getHours()}`
  //         : `${new Date().getHours()}`;

  //     const mins =
  //       new Date().getMinutes() < 10
  //         ? `0${new Date().getMinutes()}`
  //         : `${new Date().getMinutes()}`;

  //     const time = `${hour}:${mins}`;
  //     const messageSender = {
  //       chatId,
  //       senderId: idUser,
  //       text: message,
  //       isImg,
  //     };
  //     if (data.status === 200) {
  //       socket.emit("send-message", {
  //         chatId,
  //         senderId: idUser,
  //         text: data.data.result.text,
  //         receiverId: idFriend,
  //         isImg,
  //         time,
  //       });
  //     }

  //     // setChatMessages((messages) => [
  //     //   ...messages,
  //     //   { ...messageSender, time, text: data.data.result.text },
  //     // ]);
  //     setMessage("");
  //   }
  // };

  const handleNewImg = async () => {};

  const handleNewFile = async () => {
    Alert.alert(
      "Chức năng gửi file sẽ được cập nhật ở phiên bản tiếp theo!" +
        `\n Cảm ơn.`
    );
  };

  const idRoomChat = async () => {
    // const roomChat = await chatApi.getChat(idUser, idFriend);
    // setChatId(roomChat.data._id);
    await chatApi
      .getChat(idUser, idFriend)
      .then((res) => {
        setChatId(res.data._id);
        setWellCome("");
        setSttWell(true);
      })
      .catch((err) => {
        setWellCome("Các bạn hiện chưa kết nối với nhau!");
        setSttWell(false);
      });
  };

  const getGroupChat = async () => {
    setSttWell(true);
    setChatId(await AsyncStorage.getItem("idFriend"));
  };

  // get id room chat
  useEffect(() => {
    if (idUser === "" || idFriend === "") {
    } else {
      //idRoomChat();
      if (statusG === 0) {
        idRoomChat();
      } else {
        getGroupChat();
      }
    }
  }, [idUser, idFriend]);

  // get all messages from chat id
  const getAllMessages = useCallback(async (chatId) => {
    setLoading(true);
    valueInverted = true;
    if (!chatId) {
      setChatId(null);
      return;
    }
    const messagesData = await messageApi.getMessages(chatId);
    console.log("messagesData.data");
    // console.log(messagesData.data);
    setChatMessages(messagesData.data);
    setLoading(false);
  }, []);
  useEffect(() => {
    getAllMessages(chatId);
    // scrollToEnd();
  }, [chatId]);

  // Get the message from socket server
  useEffect(() => {
    socket.on("recieve-message", (data) => {
      console.log("socket online");
      setMessageGetFromSocket(data);
    });
  }, [socket]);

  useEffect(() => {
    messageGetFromSocket &&
      setChatMessages((prev) => [...prev, messageGetFromSocket]);
  }, [messageGetFromSocket]);

  const touchMess = (item) => {};

  const informationChat = () => {
    if (statusG === 0) {
      navigation.navigate("InformationFriendChat", {
        idFriend: idFriend,
        chatId: chatId,
      });
    } else {
      navigation.navigate("InformationGroupChat", { idGroup: chatId, avatar });
    }
  };

  useEffect(() => {
    console.log("-----------------chatMessages");
    // console.log(chatMessages);
    setMessageDis([...chatMessages].reverse());
    console.log("-----------------------[...chatMessages].reverse()");
    // console.log([...chatMessages].reverse());
  }, [chatMessages]);

  const renderLoading = () => {
    return (
      <View
        style={{
          width: "100%",
          alignItems: "flex-end",
        }}
      >
        {isLoadingImage === true ? (
          <View
            style={{
              width: 150,
              height: 150,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size="large" />
          </View>
        ) : (
          ""
        )}
      </View>
    );
  };

  const loadMoreMessages = () => {
    console.log("dang load");
  };

  const handleCall = () => {
    Alert.alert(
      "Chức năng  thoại sẽ được cập nhật ở phiên bản tiếp theo!" + `\n Cảm ơn.`
    );
  };

  const handleCallVideo = () => {
    Alert.alert(
      "Chức năng gọi video sẽ được cập nhật ở phiên bản tiếp theo!" +
        `\n Cảm ơn.`
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, GlobalStyles.droidSafeArea]}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <>
          <View style={styles.tabBarChat}>
            <TouchableOpacity
              style={styles.icon}
              onPress={() => navigation.goBack()}
            >
              <BackIcon color="white" size={size} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.aMess_avt}
              onPress={() => informationChat()}
            >
              <Image source={{ uri: avatar }} style={styles.wrapAvatarZL} />
              <View style={styles.wrapNameAndStatus}>
                <Text
                  numberOfLines={1}
                  style={{ fontSize: 16, fontWeight: "600", marginBottom: 5 }}
                >
                  {currentName}
                </Text>
                <Text>Dang hoat dong</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.wrapIconPhoneVideoCall}>
              <TouchableOpacity
                onPress={() => handleCall()}
                style={[styles.icon, { paddingHorizontal: 15 }]}
              >
                <PhoneIcon color="white" size={size} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleCallVideo()}
                style={[
                  styles.icon,
                  { marginLeft: 10, paddingHorizontal: 15, marginRight: 20 },
                ]}
              >
                <VideoIcon color="white" size={size} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.contentChat}>
            <View style={styles.messagingScreen}>
              <View
                style={[
                  styles.messagingScreen,
                  { paddingVertical: 15, paddingHorizontal: 10 },
                ]}
              >
                {messageDis[0] ? (
                  <View>
                    <FlatList
                      data={messageDis}
                      inverted={valueInverted}
                      showsVerticalScrollIndicator={false}
                      keyExtractor={(item) => item._id}
                      renderItem={({ item }) => (
                        <MessageComponent
                          item={item}
                          idUser={idUser}
                          statusG={statusG}
                          onPress={() => touchMess(item)}
                        />
                      )}
                      ListHeaderComponent={renderLoading}
                      ref={(ref) => {
                        listViewRef = ref;
                      }}
                    />
                  </View>
                ) : (
                  // render use ScrollView
                  // <ScrollView
                  //   style={{ flex: 1 }}
                  // >
                  //   {messageDis.map((item) => {
                  //     return (
                  //       <View key={item._id}>
                  //         <MessageComponent
                  //           item={item}
                  //           idUser={idUser}
                  //           statusG={statusG}
                  //           isLoadingImage={isLoadingImage}
                  //           onPress={() => touchMess(item)}
                  //         />
                  //       </View>
                  //     );
                  //   })}
                  //   <View
                  //     style={{
                  //       width: "100%",
                  //       alignItems: "flex-end",
                  //     }}
                  //   >
                  //     {isLoadingImage === true ? (
                  //       <View
                  //         style={{
                  //           width: 150,
                  //           height: 150,
                  //           justifyContent: "center",
                  //           alignItems: "center",
                  //         }}
                  //       >
                  //         <ActivityIndicator size="large" />
                  //       </View>
                  //     ) : (
                  //       ""
                  //     )}
                  //   </View>
                  // </ScrollView>
                  <View
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                      position: "absolute",
                      top: "50%",
                    }}
                  >
                    {sttWell ? (
                      <Text
                        style={{
                          textAlign: "center",
                          fontSize: 18,
                          color: "#949494",
                        }}
                      >
                        Hãy bắt đầu trò truyện với nhau đi nào!
                      </Text>
                    ) : (
                      <Text
                        style={{
                          textAlign: "center",
                          fontSize: 18,
                          color: "#949494",
                        }}
                      >
                        Các bạn hiện giờ chưa kết nối với nhau! Hãy kết bạn với
                        nhau đi nào!
                      </Text>
                    )}
                  </View>
                )}
              </View>

              <View style={styles.messagingScreenContainer}>
                {sttWell ? (
                  <TextInput
                    style={styles.messagingInput}
                    value={message}
                    onChangeText={(value) => setMessage(value)}
                    placeholder="Nhập tin nhắn!"
                  />
                ) : (
                  <TextInput
                    style={[
                      styles.messagingInput,
                      { backgroundColor: "#949494" },
                    ]}
                    value={message}
                    onChangeText={(value) => setMessage(value)}
                    placeholder="Nhập tin nhắn!"
                    editable={false}
                    selectTextOnFocus={false}
                  />
                )}

                {message !== "" ? (
                  <TouchableOpacity
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 5,
                    }}
                    onPress={handleNewMessage}
                  >
                    <SendIcon color="#4eac6dd4" size={40} />
                  </TouchableOpacity>
                ) : (
                  <View
                    style={{
                      justifyContent: "center",
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 5,
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onPress={() => handleNewFile()}
                    >
                      <FileIcon color="#4eac6dd4" size={40} />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        marginLeft: 10,
                      }}
                      onPress={() => chooseImg()}
                    >
                      <ImgIcon color="#4eac6dd4" size={40} />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </View>
          {/* {visible ? <ModalMemberGroupChat setVisible={setVisible} /> : ""} */}
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
                <LoadingCircle />
              </View>
            </Modal>
          </View>
        </>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    width: "10%",
    padding: 10,
    marginRight: 5,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: 'red',
  },

  aMess_avt: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: "65%",
    // justifyContent: "center",
    // flexGrow: 1,
  },

  wrapAvatarZL: {
    width: 50,
    height: 50,
    borderRadius: 500,
    borderWidth: 1,
    borderColor: "black",
    // marginVertical: 10,
  },

  wrapNameAndStatus: {
    marginLeft: 10,
    marginRight: 40,
    maxWidth: "60%",
  },

  wrapIconPhoneVideoCall: {
    position: "absolute",
    right: 0,
    flexDirection: "row",
    justifyContent: "flex-end",
    // backgroundColor: "red",
  },

  contentChat: {
    flex: 1,
    marginTop: 1,
  },

  // new
  messagingScreen: {
    flex: 1,
  },

  messagingScreenContainer: {
    width: "100%",
    // minHeight: 100,
    // backgroundColor: "white",
    // paddingVertical: 10,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  messagingInput: {
    borderWidth: 1,
    padding: 15,
    flex: 1,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: "white",
    marginBottom: 10,
  },
  messagingButtonContainer: {
    // width: "30%",
    paddingHorizontal: 10,
    backgroundColor: "green",
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },
});

export default SC_Chat;
