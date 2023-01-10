import React, { useEffect } from "react";
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
import { AddNewIcon, XIcon } from "./IconBottomTabs";
import friendApi from "../api/ApiRequestFriend";
import socket from "../utils/socket";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Modal from "react-native-modal";
import LoadingCircle from "../components/LoadingCircle";
import { chatApi } from "../api/ApiChat";

const FriendBar = ({ users, idUser, me }) => {
  const [sttCheckFriend, setSttCheckFriend] = useState();
  const [isRequired, setIsRequired] = useState(false);
  const [requestFriends, setRequestFriends] = useState([]);
  const [requestFriends2, setRequestFriends2] = useState([]);
  const [isClickRequest, setIsClickRequest] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [isAccept, setIsAccept] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    socket.emit("new-user-add", idUser);
    socket.on("get-users", (me) => {
      setOnlineUsers(me);
    });
  }, [idUser]);

  // lay danh sach gui loi moi ket ban
  const getRequestFriend = async () => {
    const token = await AsyncStorage.getItem("token");
    if (token === "" || token === null || token === undefined) {
      setRequestFriends2([]);
    } else {
      const data = await friendApi.getInvitesFriend(token);
      if (data) {
        setRequestFriends2(data.data.listUser);
        console.log(data.data.listUser);
      } else {
        console.log("khong co du lieu");
      }
    }
  };
  useEffect(() => {
    getRequestFriend();
  }, []);

  // lay danh sach gui loi moi ket ban
  const getAllRequestSentWithSenderId = async () => {
    const token = await AsyncStorage.getItem("token");
    if (token === "" || token === null || token === undefined) {
      setRequestFriends([]);
    } else {
      const data = await friendApi.getAllRequestSentWithSenderId(token);
      if (data) {
        // console.log(data.data.listUser);
        setRequestFriends(data.data.listUser);
      } else {
        console.log("khong co du lieu");
      }
    }
  };
  useEffect(() => {
    getAllRequestSentWithSenderId();
  }, []);

  const requestFriendHandle = async () => {
    // Call API
    // gửi request senderId, receiverId
    const senderId = idUser;
    const receiverId = users._id;

    // Kiem tra kb

    //
    try {
      const data = await friendApi.requestFriend(senderId, receiverId);

      //Gửi user và id user socket
      socket.emit("send-require-friend", {
        userFind: users,
        user: { ...me, idRequest: data.data.idRequest },
      });
      setIsAccept(false);
      setIsRequired(true);
      // Thông báo gửi thành công
      console.log("Gửi yêu cầu thành công");
    } catch (error) {
      console.log(error);
    }
  };

  const revokeRequestFriendHandle = () => {
    const getIdRequest = async () => {
      const token = await AsyncStorage.getItem("token");
      const receiverId = users._id;
      console.log(receiverId);

      const data = await friendApi.getIdRequestFinal(token, receiverId);
      if (data.status === 204) {
        setIsRequired(false);
        setIsAccept(false);
        console.log("Thu hoi thanh cong!");
      } else {
        console.log("Thu hoi khong thanh cong!");
      }
    };
    getIdRequest();
  };

  useEffect(() => {
    socket.on("declined-require-friend", (data) => {
      setIsRequired(false);
      setIsAccept(false);
    });
  }, [socket]);

  useEffect(() => {
    socket.on("accept-require-friend", (data) => {
      console.log(data.user.name);
      setIsAccept(true);
    });
  }, [socket]);

  function checkFriend(arr) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id === idUser) {
        console.log(arr[i].name);
        return true;
      }
    }
    return false;
  }

  function checkRequestFriend(arr) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i]._id === users._id) {
        console.log(arr[i].name);
        return true;
      }
    }
    return false;
  }

  function checkRequestFriend2(arr) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i]._id === users._id) {
        console.log(arr[i].name);
        return true;
      }
    }
    return false;
  }

  const declineFriend_diff = async () => {
    setModalLoading(true);
    const token = await AsyncStorage.getItem("token");
    const senderId = users._id;
    const data = await friendApi.declineFriend_diff(token, senderId);
    if (data.status === 204) {
      getRequestFriend();
      checkRequestFriend2(requestFriends2);
      setIsAccept(false);
      console.log("tu choi loi moi ket ban! ");
    } else {
      console.log("co loi r ");
    }
    setModalLoading(false);
  };

  const acceptFriend_diff = async () => {
    setModalLoading(true);
    const token = await AsyncStorage.getItem("token");
    const senderId = users._id;
    const data = await friendApi.acceptFriend_diff(token, senderId);
    if (data.status === 200) {
      const dataChat = {
        senderId: senderId,
        receiveId: idUser,
      };
      const creChat = await chatApi.createChat(dataChat);
      if (creChat.status === 200) {
        setIsAccept(true);
        console.log("Kết bạn thành công");
      } else {
        console.log("chua tao phong chat");
      }
    }
    setModalLoading(false);
  };

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
          <Image source={{ uri: users.avatar }} style={styles.wrapAvatarZL} />
        </View>
        <View style={styles.aMess_right}>
          <View style={styles.name_and_disMess}>
            <Text style={styles.txtNameMess}>{users.name}</Text>
          </View>
        </View>
      </View>
      <View
        style={{
          width: "30%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {checkFriend(users.friends) === true ? (
          ""
        ) : (
          <View>
            {isAccept === true ? (
              ""
            ) : (
              <View>
                {isRequired === true ? (
                  <TouchableOpacity
                    style={styles.xxxDiff}
                    onPress={revokeRequestFriendHandle}
                  >
                    <Image source={require("../assets/revoke.png")} />
                  </TouchableOpacity>
                ) : (
                  <View>
                    {checkRequestFriend(requestFriends) === true ? (
                      <View>
                        {checkRequestFriend2(requestFriends2) === true ? (
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-evenly",
                              width: "100%",
                            }}
                          >
                            <TouchableOpacity onPress={acceptFriend_diff}>
                              <Image source={require("../assets/accept.png")} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={declineFriend_diff}>
                              <Image source={require("../assets/cancel.png")} />
                            </TouchableOpacity>
                          </View>
                        ) : (
                          <TouchableOpacity
                            style={styles.xxxDiff}
                            onPress={revokeRequestFriendHandle}
                          >
                            <Image source={require("../assets/revoke.png")} />
                          </TouchableOpacity>
                        )}
                      </View>
                    ) : (
                      <View>
                        {checkRequestFriend2(requestFriends2) === true ? (
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-evenly",
                              width: "100%",
                            }}
                          >
                            <TouchableOpacity
                              // onPress={() =>
                              onPress={acceptFriend_diff}
                              //   acceptRequestFriendHandle(idRequest, requestFriends)
                              // }
                            >
                              <Image source={require("../assets/accept.png")} />
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={declineFriend_diff}
                              // onPress={() =>
                              //   deninedRequestFriendHandle(idRequest, requestFriends)
                              // }
                            >
                              <Image source={require("../assets/cancel.png")} />
                            </TouchableOpacity>
                          </View>
                        ) : (
                          <TouchableOpacity
                            style={styles.xxxDiff}
                            onPress={requestFriendHandle}
                          >
                            <Image source={require("../assets/add-user.png")} />
                          </TouchableOpacity>
                        )}
                      </View>
                    )}
                  </View>
                )}
              </View>
            )}
          </View>
        )}
      </View>
      {/* modal */}
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
  aMess: {
    width: "70%",
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
});

export default FriendBar;
