import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  useWindowDimensions,
  FlatList,
  Alert,
  Dimensions,
} from "react-native";
import { BackIcon, SearchICon, XIcon } from "../components/IconBottomTabs";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import SearchFriendBar from "../components/SearchFriendBar";
import socket from "../utils/socket";
import ApiLoadFriend from "../api/ApiLoadFriend";
import ApiLoadGroupChat from "../api/LoadGroupChat";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GlobalStyles from "../components/GlobalStyles";
import LoadingCircleSnail from "../components/LoadingCircleSnail";
import { messageApi } from "../api/ApiMessage";
import FileComponent from "../components/FileComponent";

const size = 22;
const deviceWidth = Dimensions.get("window").width;
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

const SC_ImageAndFilesSent = ({ navigation, route }) => {
  const chatId = route.params;
  const [imgSent, setImgSent] = useState([]);
  const [fileSent, setFileSent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingFile, setLoadingFile] = useState(false);

  const getAllMessages = async () => {
    setLoading(true);
    let arrMess = [];
    setImgSent([]);
    const messagesData = await messageApi.getMessages(chatId.chatId);
    arrMess.push(...messagesData.data);
    for (let i = 0; i < arrMess.length; i++) {
      if (arrMess[i].isImg === true) {
        // console.log(arrMess[i].text);
        setImgSent((prev) => [...prev, arrMess[i]]);
      }
    }
    setLoading(false);
  };
  useEffect(() => {
    getAllMessages();
  }, []);

  const ListImageSent = ({ lsImg }) => {
    return (
      <View
        style={{
          width: deviceWidth / 3,
          height: deviceWidth / 3,
          borderWidth: 1,
        }}
      >
        <Image
          source={{ uri: lsImg.text }}
          style={{ width: "100%", height: "100%" }}
        />
      </View>
    );
  };

  const Images = () => (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ flex: 1 }}>
        {loading === true ? (
          <View style={{ width: "100%", height: "100%" }}>
            <LoadingCircleSnail />
          </View>
        ) : (
          <View>
            {imgSent.length === 0 ? (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <Text
                  style={{ fontSize: "18", fontWeight: "700", opacity: 0.7 }}
                >
                  Không có ảnh nào
                </Text>
              </View>
            ) : (
              <View style={{ height: "100%" }}>
                <FlatList
                  data={imgSent}
                  numColumns={3}
                  keyExtractor={(item) => item._id}
                  renderItem={({ item }) => <ListImageSent lsImg={item} />}
                />
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
  const Files = () => (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ flex: 1 }}>
        {loadingFile === true ? (
          <View style={{ width: "100%", height: "100%" }}>
            <LoadingCircleSnail />
          </View>
        ) : (
          <View>
            {fileSent.length == 0 ? (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <Text
                  style={{ fontSize: "18", fontWeight: "700", opacity: 0.7 }}
                >
                  Không có file nào
                </Text>
              </View>
            ) : (
              <View style={{ height: "100%" }}>
                <FlatList
                  data={DATA}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => <FileComponent />}
                />
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );

  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "image", title: "Hình ảnh" },
    { key: "file", title: "Files" },
  ]);

  const renderScene = SceneMap({
    image: Images,
    file: Files,
  });

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      activeColor={"red"}
      inactiveColor={"black"}
      style={{ backgroundColor: "#fff" }}
      //   tabStyle={{ backgroundColor: "#000" }}
    />
  );

  return (
    <View style={[styles.container, GlobalStyles.droidSafeArea]}>
      <View style={styles.tabBarChat}>
        <TouchableOpacity
          style={[styles.icon, { flexDirection: "row" }]}
          onPress={() => navigation.goBack()}
        >
          <BackIcon color="white" size={size} />
        </TouchableOpacity>
        <View
          style={{
            marginLeft: 50,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "500", color: "#fff" }}>
            Ảnh và files đã gửi
          </Text>
        </View>
      </View>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />
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
    // justifyContent: "space-between",
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

export default SC_ImageAndFilesSent;
