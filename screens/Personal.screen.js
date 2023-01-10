import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useCallback, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Image,
  Dimensions,
  ScrollView,
  Alert,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import {
  BirthDateIcon,
  AddNewIcon,
  GenderIcon,
  AddressIcon,
  UpdateProfileIcon,
  OptionIcon,
} from "../components/IconBottomTabs";
import { ApiProfile, ApiUser } from "../api/ApiUser";
import Modal from "react-native-modal";
import LoadingCircle from "../components/LoadingCircle";
import DateTimePicker from "@react-native-community/datetimepicker";
import { apiFirebase } from "../api/ApiFirebase";
import { firebase } from "../config";
import * as ImagePicker from "expo-image-picker";
import GlobalStyles from "../components/GlobalStyles";

const { width } = Dimensions.get("window");
const size = 24;

const deviceWidth = Dimensions.get("window").width;
const deviceHeight =
  Platform.OS === "ios"
    ? Dimensions.get("window").height
    : require("react-native-extra-dimensions-android").get(
        "REAL_WINDOW_HEIGHT"
      );

export const Personal = ({ navigation }) => {
  const [name, setName] = useState("");
  const [introduceYourself, setIntroduceYourself] = useState("");
  const [gender, setGender] = useState("");
  const [male, setMale] = React.useState(false);
  const [female, setFemale] = React.useState(false);
  const [genderOther, setGenderOther] = React.useState(false);
  const [birthDate, setBirthDate] = useState("");
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState();
  const [coverImg, setCoverImg] = useState();
  const [modalLoading, setModalLoading] = useState(false);
  const [modalLogOut, setModalLogOut] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [modalDate, setModalDate] = useState(false);
  const [dateFinal, setDateFinal] = useState(new Date());
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const eventMale = () => {
    setMale(true);
    setFemale(false);
    setGenderOther(false);
    setGender("Nam");
  };

  const eventFemale = () => {
    setMale(false);
    setFemale(true);
    setGenderOther(false);
    setGender("Nữ");
  };

  const eventGenderOther = () => {
    setMale(false);
    setFemale(false);
    setGenderOther(true);
    setGender("Khác");
  };

  const handleLogout = async () => {
    const temp = await AsyncStorage.getItem("isRememberPassword");
    const username = await AsyncStorage.getItem("username");
    const password = await AsyncStorage.getItem("password");
    console.log(JSON.parse(temp));
    AsyncStorage.clear();
    setModalLogOut(false);
    if (JSON.parse(temp) === true) {
      console.log(username);
      await AsyncStorage.setItem("username", username);
      await AsyncStorage.setItem("password", password);
      await AsyncStorage.setItem("isRememberPassword", JSON.stringify(true));
    } else {
      await AsyncStorage.setItem("isRememberPassword", JSON.stringify(false));
    }
    navigation.replace("SC_Login");
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);

    let tempDate = new Date(currentDate);

    let day =
      tempDate.getDate() < 10
        ? `0${tempDate.getDate()}`
        : `${tempDate.getDate()}`;

    let month =
      tempDate.getMonth() + 1 < 10
        ? `0${tempDate.getMonth() + 1}`
        : `${tempDate.getMonth() + 1}`;

    let dDate = day + "-" + month + "-" + tempDate.getFullYear();
    setBirthDate(dDate);
    setDateFinal(
      new Date(
        tempDate.getFullYear(),
        tempDate.getMonth(),
        tempDate.getDate() + 1
      )
    );
    console.log(
      new Date(
        tempDate.getFullYear(),
        tempDate.getMonth(),
        tempDate.getDate() + 1
      )
    );
  };

  const openModalDate = () => {
    setModalDate(!modalDate);
  };

  const callApiProfile = useCallback(async () => {
    setModalLoading(true);
    const token = await AsyncStorage.getItem("token");

    await ApiProfile.profile2(token)
      .then((res) => {
        const date = new Date(res.data.birthDate);
        let day = date.getDate() - 1;
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        if (day < 10) {
          day = "0" + day;
        }
        if (month < 10) {
          month = "0" + month;
        }
        console.log(new Date(year, month, day));
        setDateFinal(new Date(year, date.getMonth(), date.getDate()));
        setDate(new Date(year, date.getMonth(), day));
        setName(res.data.name);
        setIntroduceYourself(res.data.introducePersonal);
        setGender(res.data.gender);
        setAddress(res.data.address);
        setBirthDate(day + "-" + month + "-" + year);
        setAvatar(res.data.avatar);
        setCoverImg(res.data.coverImg);
      })
      .catch((err) => {
        console.log("3");
      });
    setModalLoading(false);
  }, []);

  useEffect(() => {
    callApiProfile();
    var today = new Date(birthDate);
    console.log(today.toLocaleDateString("en-US"));
  }, []);

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

    const ref = firebase.storage().ref().child(`Avatar/${fileName}`);
    const snapshot = await ref.put(blob);

    // We're done with the blob, close and release it
    blob.close();

    return await snapshot.ref.getDownloadURL();
  }

  const chooseAvatar = async () => {
    let rs = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      // base64: true,
    });

    if (!rs.canceled) {
      const uri = rs.assets[0].uri;
      setAvatar(uri);

      // const uploadUrl = await uploadImageAsync(uri, fileName);

      // if (uploadUrl.length !== 0) {

      // } else {
      //   Alert.alert("Khong gui duoc hinh anh");
      // }
    }
  };

  const openModalLogOut = () => {
    setModalLogOut(!modalLogOut);
  };

  const askLogOut = () => {
    Alert.alert(`Bạn có chắc là đăng xuất không ?`, "", [
      {
        text: "Không!",
        onPress: () => setModalLogOut(false),
        style: "cancel",
      },
      { text: "Có", onPress: () => handleLogout() },
    ]);
  };

  const btnUpdate = () => {
    setIsUpdate(true);
    if (gender === "Nam") {
      eventMale();
    } else if (gender === "Nữ") {
      eventFemale();
    } else {
      eventGenderOther();
    }
  };

  const btnNone = async () => {
    const token = await AsyncStorage.getItem("token");
    const fileName = avatar.substring(
      avatar.lastIndexOf("/") + 1,
      avatar.length
    );
    const uploadUrl = await uploadImageAsync(avatar, fileName);
    if (uploadUrl.length !== 0) {
      console.log("up load thanh cong");
      const data = {
        name,
        birthDate: dateFinal,
        gender,
        avatar: uploadUrl,
        address,
        introducePersonal: introduceYourself,
      };
      console.log(data);
      const rs = await ApiProfile.updateProfile(token, data);
      if (rs.status === 200) {
        console.log("than cong");
        callApiProfile();
      } else {
        console.log("that bai");
      }
    } else {
      Alert.alert("Upload hinh anh that bai!");
    }

    setIsUpdate(false);
  };

  const btnCancel = () => {
    setIsUpdate(false);
    callApiProfile();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, GlobalStyles.droidSafeArea]}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <>
          <View style={styles.profileHeader}>
            <View style={styles.wrapImage}>
              <View style={styles.coverImage}>
                <Image
                  style={styles.image}
                  source={{ uri: coverImg }}
                  resizeMode={"stretch"}
                />
                <View style={styles.option}>
                  <TouchableOpacity
                    style={styles.btnOption}
                    onPress={openModalLogOut}
                  >
                    <OptionIcon color="black" size={40} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.avatarProfile}>
                {isUpdate === true ? (
                  <TouchableOpacity
                    disabled={!isUpdate}
                    onPress={() => chooseAvatar()}
                  >
                    <View
                      style={{
                        height: 120,
                        width: 120,
                        borderRadius: 60,
                        overflow: "hidden",
                        position: "absolute",
                        bottom: 0,
                        zIndex: 1,
                      }}
                    >
                      <View
                        style={{
                          // backgroundColor: "red",
                          height: 60,
                          width: 120,
                        }}
                      />
                      <View
                        style={{
                          backgroundColor: "rgba(52, 52, 52, 0.6)",
                          height: 60,
                          width: 120,
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
                          width: 120,
                          height: 120,
                          borderRadius: 120,
                          borderWidth: 4,
                        },
                      ]}
                      resizeMode={"stretch"}
                    />
                  </TouchableOpacity>
                ) : (
                  <Image
                    style={[
                      styles.image,
                      {
                        width: 120,
                        height: 120,
                        borderRadius: 120,
                        borderWidth: 4,
                      },
                    ]}
                    source={{ uri: avatar }}
                    resizeMode={"contain"}
                  />
                )}
              </View>
            </View>
            <View style={styles.inforProfile}>
              <View
                style={{ position: "absolute", top: 70, flexDirection: "row" }}
              >
                <TextInput
                  style={
                    isUpdate === true
                      ? [
                          styles.inputProfile,
                          {
                            color: "red",
                            borderBottomColor: "grey",
                            borderBottomWidth: 1,
                          },
                        ]
                      : styles.inputProfile
                  }
                  value={name}
                  onChangeText={(text) => setName(text)}
                  editable={isUpdate}
                />

                {isUpdate === true ? (
                  <Image
                    source={require("../assets/signature.png")}
                    style={{ marginLeft: 12 }}
                  />
                ) : (
                  ""
                )}
              </View>

              <View
                style={{ position: "absolute", top: 105, flexDirection: "row" }}
              >
                <TextInput
                  style={
                    isUpdate === true
                      ? [
                          {
                            fontSize: 18,
                            fontWeight: "500",
                            color: "red",
                            borderBottomColor: "grey",
                            borderBottomWidth: 1,
                          },
                        ]
                      : { fontSize: 18, fontWeight: "500" }
                  }
                  value={introduceYourself}
                  onChangeText={(text) => setIntroduceYourself(text)}
                  editable={isUpdate}
                />
                {isUpdate === true ? (
                  <Image
                    source={require("../assets/signature.png")}
                    style={{ marginLeft: 12 }}
                  />
                ) : (
                  ""
                )}
              </View>
            </View>
          </View>
          <ScrollView style={styles.profileContent}>
            <View style={styles.warpContent}>
              <Text style={{ fontSize: 20, marginBottom: 10 }}>
                {" "}
                Thông tin cá nhân{" "}
              </Text>
              <View style={styles.wrapInformationPerson}>
                <Pressable
                  style={styles.xxxHi}
                  disabled={!isUpdate}
                  onPress={() => openModalDate()}
                >
                  <BirthDateIcon color="black" size={size} />
                  <Text
                    style={
                      isUpdate === true
                        ? [
                            {
                              fontSize: 16,
                              color: "red",
                              marginLeft: 15,
                            },
                          ]
                        : { fontSize: 16, marginLeft: 15 }
                    }
                  >
                    Sinh nhật: {birthDate}
                  </Text>
                  {isUpdate === true ? (
                    <Image
                      source={require("../assets/signature.png")}
                      style={{ marginLeft: 12 }}
                    />
                  ) : (
                    ""
                  )}
                </Pressable>
                <View style={styles.xxxHi}>
                  {isUpdate === true ? (
                    <View
                      style={[
                        {
                          flexDirection: "row",
                          justifyContent: "space-between",
                          width: "100%",
                        },
                      ]}
                    >
                      <Pressable
                        style={{ flexDirection: "row", alignItems: "center" }}
                        onPress={eventMale}
                      >
                        {male === true ? (
                          <View
                            style={{
                              width: 20,
                              height: 20,
                              backgroundColor: "#4eac6d",
                              borderWidth: 2,
                              borderColor: "red",
                              borderRadius: 20,
                              marginRight: 10,
                            }}
                          ></View>
                        ) : (
                          <View
                            style={{
                              width: 20,
                              height: 20,
                              backgroundColor: "#fff",
                              borderWidth: 2,
                              borderColor: "#4eac6d",
                              borderRadius: 20,
                              marginRight: 10,
                            }}
                          ></View>
                        )}
                        <Image
                          source={require("../assets/mars.png")}
                          style={{ width: 16, height: 16, marginRight: 5 }}
                        />
                        <Text>Nam</Text>
                      </Pressable>
                      <Pressable
                        style={{ flexDirection: "row", alignItems: "center" }}
                        onPress={eventFemale}
                      >
                        {female === true ? (
                          <View
                            style={{
                              width: 20,
                              height: 20,
                              backgroundColor: "#4eac6d",
                              borderWidth: 2,
                              borderColor: "red",
                              borderRadius: 20,
                              marginRight: 10,
                            }}
                          ></View>
                        ) : (
                          <View
                            style={{
                              width: 20,
                              height: 20,
                              backgroundColor: "#fff",
                              borderWidth: 2,
                              borderColor: "#4eac6d",
                              borderRadius: 20,
                              marginRight: 10,
                            }}
                          ></View>
                        )}
                        <Image
                          source={require("../assets/femenine.png")}
                          style={{ width: 16, height: 16, marginRight: 5 }}
                        />
                        <Text>Nữ</Text>
                      </Pressable>
                      <Pressable
                        style={{ flexDirection: "row", alignItems: "center" }}
                        onPress={eventGenderOther}
                      >
                        {genderOther === true ? (
                          <View
                            style={{
                              width: 20,
                              height: 20,
                              backgroundColor: "#4eac6d",
                              borderWidth: 2,
                              borderColor: "red",
                              borderRadius: 20,
                              marginRight: 10,
                            }}
                          ></View>
                        ) : (
                          <View
                            style={{
                              width: 20,
                              height: 20,
                              backgroundColor: "#fff",
                              borderWidth: 2,
                              borderColor: "#4eac6d",
                              borderRadius: 20,
                              marginRight: 10,
                            }}
                          ></View>
                        )}
                        <GenderIcon color="black" size={26} />
                        <Text>Khác</Text>
                      </Pressable>
                    </View>
                  ) : (
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <GenderIcon color="black" size={26} />
                      <Text
                        style={{
                          fontSize: 16,
                          marginLeft: 15,
                        }}
                      >
                        {gender}
                      </Text>
                    </View>
                  )}
                </View>
                <View style={styles.xxxHi}>
                  <AddressIcon color="black" size={26} />
                  <TextInput
                    style={
                      isUpdate === true
                        ? [
                            {
                              fontSize: 16,
                              color: "red",
                              borderBottomColor: "grey",
                              borderBottomWidth: 1,
                              marginLeft: 15,
                            },
                          ]
                        : { fontSize: 16, marginLeft: 15 }
                    }
                    value={address}
                    onChangeText={(text) => setAddress(text)}
                    editable={isUpdate}
                  />
                  {isUpdate === true ? (
                    <Image
                      source={require("../assets/signature.png")}
                      style={{ marginLeft: 12 }}
                    />
                  ) : (
                    ""
                  )}
                </View>
              </View>
            </View>

            <View style={styles.wrapUpdateProfile}>
              <View style={styles.updateProfile}>
                {isUpdate === true ? (
                  <View
                    style={{
                      width: "100%",
                      flexDirection: "row",
                      justifyContent: "space-around",
                    }}
                  >
                    <TouchableOpacity
                      style={styles.btnUpdateProfile}
                      onPress={() => btnCancel()}
                    >
                      <Image source={require("../assets/cancel.png")} />
                      <Text
                        style={{
                          fontSize: 16,
                          marginLeft: 15,
                        }}
                      >
                        Huỷ bỏ
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.btnUpdateProfile}
                      onPress={() => btnNone()}
                    >
                      <Image source={require("../assets/checked.png")} />
                      <Text
                        style={{
                          fontSize: 16,
                          marginLeft: 15,
                        }}
                      >
                        Xong
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.btnUpdateProfile}
                    onPress={() => btnUpdate()}
                  >
                    <UpdateProfileIcon color="black" size={26} />
                    <Text
                      style={{
                        fontSize: 16,
                        marginLeft: 15,
                      }}
                    >
                      Cập nhật thông tin các nhân
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </ScrollView>
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

          {/* modal dang xuat */}
          <View>
            <Modal
              isVisible={modalLogOut}
              onBackdropPress={() => setModalLogOut(false)}
              deviceWidth={deviceWidth}
              deviceHeight={deviceHeight}
              style={{
                justifyContent: "flex-start",
                alignItems: "flex-end",
                marginTop: 120,
                marginRight: 20,
              }}
            >
              <View
                style={{
                  width: 200,
                  // height: 120,
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
                  // onPress={askLogOut}
                >
                  <Image source={require("../assets/changePassword.png")} />
                  <Text
                    style={{ fontSize: 16, fontWeight: "500", marginLeft: 15 }}
                  >
                    Đổi mật khẩu
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    // backgroundColor: "red",
                    paddingVertical: 5,
                    borderBottomWidth: 1,
                  }}
                  onPress={askLogOut}
                >
                  <Image source={require("../assets/logout.png")} />
                  <Text
                    style={{ fontSize: 16, fontWeight: "500", marginLeft: 15 }}
                  >
                    Đăng xuất
                  </Text>
                </TouchableOpacity>
              </View>
            </Modal>
          </View>

          {/* modal date */}
          <View>
            <Modal
              isVisible={modalDate}
              onBackdropPress={() => setModalDate(false)}
              deviceWidth={deviceWidth}
              deviceHeight={deviceHeight}
              style={{
                justifyContent: "flex-start",
                alignItems: "flex-end",
                marginTop: 50,
                // marginRight: "20%",
                shadowColor: "#4eac6d",
                shadowOpacity: 0.9,
                shadowRadius: 5,
                shadowOffset: {
                  height: 2,
                  width: 2,
                },
                elevation: 10,
              }}
            >
              <View
                style={{
                  width: "100%",
                  height: "30%",
                  backgroundColor: "#fff",
                  padding: 12,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "20%",
                }}
              >
                <View>
                  <Text
                    style={{
                      fontSize: 24,
                      fontWeight: "700",
                      marginVertical: 24,
                    }}
                  >
                    Chọn ngày tháng năm sinh
                  </Text>
                </View>
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode={"date"}
                  display={Platform.OS === "ios" ? "spinner" : "spinner"}
                  onChange={onChange}
                  style={{
                    width: "100%",
                    height: "90%",
                    marginBottom: 12,
                  }}
                  themeVariant="light"
                />
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

  profileHeader: {
    // flex: 1,
    width: "100%",
    height: "40%",
  },

  profileContent: {
    // flex: 1,
    width: "100%",
    // borderTopColor: "black",
    // borderWidth: 2,
    borderTopWidth: 1,
    borderColor: "#b0aeae",
    // backgroundColor: "blue",
    height: "60%",
    // justifyContent: "flex-end",
    marginTop: 100,
  },

  wrapImage: {
    flex: 1,
    flexGrow: 7,
  },

  inforProfile: {
    flex: 1,
    flexGrow: 3,
    alignItems: "center",
    justifyContent: "flex-end",
  },

  coverImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },

  avatarProfile: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    top: "60%",
    left: "35%",
    position: "absolute",
  },

  image: {
    width,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  warpContent: {
    flex: 1,
    padding: 24,
  },

  button: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "orange",
    borderRadius: 5,
    marginTop: 25,
  },
  textButton: {
    color: "white",
    fontWeight: "700",
  },

  xxxHi: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    padding: 10,
    // borderBottomWidth: 0.5,
  },

  wrapUpdateProfile: {
    flex: 1,
    // padding: 24,
    justifyContent: "flex-start",
  },

  updateProfile: {
    justifyContent: "center",
    alignItems: "center",
  },

  btnUpdateProfile: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
  },

  option: {
    position: "absolute",
    top: 10,
    right: 20,
  },

  btnOption: {
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.6,
    // backgroundColor: "rgba(158, 150, 150, .0)",
    // padding: 5,
    paddingTop: 10,
    paddingLeft: 10,
    borderRadius: 100,
  },

  inputProfile: {
    fontSize: 24,
    fontWeight: "700",
  },
});
