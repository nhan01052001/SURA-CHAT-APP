import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
  Image,
  TextInput,
  FlatList,
} from "react-native";
import { ApiProfile, ApiUser } from "../api/ApiUser";
import ContactFound from "../components/ContactFound";
import FriendBar from "../components/FriendBar";
import GlobalStyles from "../components/GlobalStyles";
import {
  SearchICon,
  AddNewIcon,
  QRIcon,
  BackIcon,
} from "../components/IconBottomTabs";
import SearchedKeyword from "../components/SearchedKeyword";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ApiLoadFriend from "../api/ApiLoadFriend";

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

const SC_Search = ({ navigation, route }) => {
  const [valueSearch, setValueSearch] = useState("");
  const [checkValueIsNumber, setCheckValueIsNumber] = useState(false);
  const [listSearch, setListSearch] = useState([]);
  const { id } = route.params;
  const [listUser, setListUser] = useState([]);
  const [friendList, setFriendList] = useState([]);
  const [user, setUser] = useState();

  useEffect(() => {
    const getFriendList = async () => {
      const token = await AsyncStorage.getItem("token");

      await ApiLoadFriend.getFriend(token)
        .then((res) => {
          // console.log(
          //   res.data.listFriend.filter((element) => {
          //     return element !== null;
          //   })
          // );
          setFriendList(
            res.data.listFriend.filter((element) => {
              return element !== null;
            })
          );
        })
        .catch((err) => {
          console.log("405");
        });

      await ApiProfile.profile2(token)
        .then((res) => {
          console.log(res.data._id);
          setUser(res.data);
        })
        .catch((err) => {
          console.log("3");
        });
    };

    getFriendList();
  }, []);

  useEffect(() => {
    // const id = user._id;
    const getAllUser = async () => {
      const token = await AsyncStorage.getItem("token");

      if (id === "" || id === null || id === undefined) {
      } else {
        const data = await ApiUser.getAllUser(token);
        setListUser(data.data.users);
      }
    };
    getAllUser();
  }, [id]);

  useEffect(() => {
    if (isNaN(valueSearch)) {
      setCheckValueIsNumber(false);
    } else {
      setCheckValueIsNumber(true);
    }
  }, [valueSearch]);

  useEffect(() => {
    if (valueSearch === "") {
      setListSearch([]);
    } else {
      var makeQuery = function (property, regexp) {
        // return a callback function for filter, see MDC docs for Array.filter
        return function (elem, index, array) {
          return elem[property].search(regexp) !== -1;
        };
      };

      var re = new RegExp(valueSearch, "i");

      if (isNaN(valueSearch)) {
        setCheckValueIsNumber(false);
        var q = makeQuery("name", re);
        let length = friendList.filter(q).length;
        setListSearch(friendList.filter(q));
      } else {
        setCheckValueIsNumber(true);
        let obj = listUser.find((o) => o.username === valueSearch);
        if (obj === undefined) {
          setListSearch([]);
        } else {
          setListSearch([obj]);
        }
      }
    }
  }, [valueSearch]);

  return (
    <View style={[styles.container]}>
      {/* tab search */}
      <View style={styles.tabBarSearch}>
        <TouchableOpacity
          style={[styles.icon]}
          onPress={() => navigation.goBack()}
        >
          <BackIcon color="#fff" size={size} />
        </TouchableOpacity>
        <TextInput
          style={styles.wrapTextSearch}
          placeholder="Tìm kiếm"
          value={valueSearch}
          placeholderTextColor="#000"
          onChangeText={(obj) => setValueSearch(obj)}
        />
        <TouchableOpacity style={styles.icon}>
          <QRIcon color="#fff" size={size} />
        </TouchableOpacity>
      </View>

      {valueSearch === "" ? (
        <View>
          {/* lien he da tim */}
          <View style={{ width: "100%" }}>
            <Text style={{ margin: 12, fontSize: 16, fontWeight: "700" }}>
              Liên hệ đã tìm
            </Text>
            <ContactFound />
            <View
              style={{ width: "100%", height: 2, backgroundColor: "#ccc" }}
            ></View>
          </View>

          {/* tu khoa tim kiem */}
          <View style={{ width: "100%" }}>
            <Text style={{ margin: 12, fontSize: 16, fontWeight: "700" }}>
              Từ khoá đã tìm
            </Text>
            <View>
              <View style={{ paddingHorizontal: 24 }}>
                <FlatList
                  data={DATA}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => <SearchedKeyword />}
                />
              </View>
            </View>
            <View
              style={{
                width: "100%",
                height: 2,
                backgroundColor: "#ccc",
                marginTop: 12,
              }}
            ></View>
          </View>
          <View style={{ margin: 12 }}>
            <TouchableOpacity>
              <Text style={{ fontSize: 16, color: "blue" }}>
                Xoá lịch sử tìm kiếm
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          {checkValueIsNumber === false ? (
            <Text style={{ margin: 12, fontSize: 16, fontWeight: "700" }}>
              Tìm bạn bè qua từ khoá
            </Text>
          ) : (
            <Text style={{ margin: 12, fontSize: 16, fontWeight: "700" }}>
              Tìm bạn bè qua số điện thoại
            </Text>
          )}
          <View>
            {valueSearch === "" ? (
              ""
            ) : (
              <View>
                {listSearch.length === 0 ? (
                  <View style={{ alignItems: "center" }}>
                    <Image
                      source={require("../assets/no-results.png")}
                      style={{ marginVertical: 24 }}
                    />
                    <Text style={{ fontSize: "18", fontWeight: "500" }}>
                      Không tìm thấy!
                    </Text>
                  </View>
                ) : (
                  <FlatList
                    data={listSearch}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                      <FriendBar users={item} idUser={user._id} me={user} />
                    )}
                  />
                )}
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  tabBarSearch: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingTop: 35,
    backgroundColor: "#69b4f5",
  },

  icon: {
    width: "10%",
    // padding: 10,
    paddingVertical: 15,
    marginRight: 5,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: 'red',
  },

  wrapTextSearch: {
    width: "70%",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginHorizontal: 10,
  },

  txtSearch: {
    fontSize: 16,
    color: "white",
    // opacity: 0.5,
    fontWeight: "500",
  },
});

export default SC_Search;
