import * as React from "react";
import { useState, useCallback, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Dimensions,
  Pressable,
  Animated,
  Platform,
  Appearance,
  Alert,
  Image,
} from "react-native";
import { CheckBox } from "@rneui/themed";
import GlobalStyles from "../components/GlobalStyles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DatePicker from "react-native-datepicker";
import { LinearGradient } from "expo-linear-gradient";
import { ApiRegisterUser } from "../api/ApiUser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ApiUser } from "../api/ApiUser";
import DateTimePicker from "@react-native-community/datetimepicker";
import Modal from "react-native-modal";
import * as Progress from "react-native-progress";
import LoadingBar from "../components/LoadingBar";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight =
  Platform.OS === "ios"
    ? Dimensions.get("window").height
    : require("react-native-extra-dimensions-android").get(
        "REAL_WINDOW_HEIGHT"
      );

const SC_Continue = ({ navigation, route }) => {
  const [name, setName] = useState("");
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [animatePress, setAnimatePress] = useState(new Animated.Value(1));
  const [gender, setGender] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [male, setMale] = React.useState(false);
  const [female, setFemale] = React.useState(false);
  const [genderOther, setGenderOther] = React.useState(false);
  const [introduceYourself, setIntroduceYourself] = useState("");
  const [errMessage, setErrMessage] = useState("");
  const { username, password } = route.params;
  const [textDate, setTextDate] = useState(
    new Date().getDate() +
      "/" +
      (new Date().getMonth() + 1) +
      "/" +
      new Date().getFullYear()
  );
  const [modalDate, setModalDate] = useState(false);
  const [dateFinal, setDateFinal] = useState(new Date());
  const [modalLoading, setModalLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const eventMale = () => {
    setMale(!male);
    setFemale(false);
    setGenderOther(false);
    setGender("Nam");
  };

  const eventFemale = () => {
    setMale(false);
    setFemale(!female);
    setGenderOther(false);
    setGender("Nữ");
  };

  const eventGenderOther = () => {
    setMale(false);
    setFemale(false);
    setGenderOther(!genderOther);
    setGender("Khác");
  };

  const showGender = () => {
    Alert.alert(gender);
  };

  const autoLogin = async () => {
    const data = {
      username: username,
      password: password,
    };
    try {
      await ApiUser.login(data).then(async (res) => {
        console.log(
          "dang nhap thanh cong voi token tra ve la: " + res.data.accessToken
        );
        await AsyncStorage.setItem("token", res.data.accessToken);
        navigation.replace("BottomTabsNavigator", {
          token: res.data.accessToken,
        });
      });
    } catch (error) {
      Alert.alert(error);
    }
  };

  const handleRegister = async () => {
    const data = {
      username: username,
      password: password,
      name: name,
      birthDate: dateFinal,
      gender: gender,
      address: address,
      introducePersonal: introduceYourself,
    };

    console.log(data);

    try {
      await ApiRegisterUser.register(data)
        .then(async (res) => {
          console.log(
            "dang ky thanh cong voi so dien thoai tra ve la: " +
              res.data.user.username
          );

          autoLogin();
          // navigation.navigate("SC_Login");
        })
        .catch((err) => {
          console.log("Dang ky khong thanh cong " + err);
        });
    } catch (error) {
      Alert.alert(error);
    }
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

    let dDate = day + "/" + month + "/" + tempDate.getFullYear();
    setTextDate(dDate);
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

  const showMode = (getCurrentMode) => {
    console.log(show);
    setMode(getCurrentMode);
    setShow(true);
  };

  const openModalDate = () => {
    console.log(date);
    setModalDate(!modalDate);
  };

  return (
    <LinearGradient
      start={{ x: 1, y: 1 }}
      end={{ x: 1, y: 0 }}
      colors={["#4eac6d", "#cfd1d0", "#cfd1d0"]}
      style={styles.container}
    >
      <KeyboardAwareScrollView style={{ flex: 1 }}>
        <View style={styles.wrapAllContent}>
          {/* content Register */}
          <View style={[styles.wrapContentVerify, GlobalStyles.test4]}>
            {/* begin title content Register */}
            <View style={styles.aboveFormVerify}>
              <Text style={[styles.txtTitleHeader, { color: "black" }]}>
                Thông tin cá nhân
              </Text>
              <Text
                style={[
                  styles.txtTitleHeaderSub,
                  { color: "black", opacity: 0.5 },
                ]}
              >
                Điền thông tin cá nhân của bạn
              </Text>
            </View>
            {/* end title content Register */}

            {/* begin content main Register with input, button checkbox,... */}
            <View style={styles.mainFormVerify}>
              {/* input so dien thoai */}
              <View style={[styles.wrapName, GlobalStyles.test3]}>
                <TextInput
                  style={styles.inputBorderBottom}
                  placeholder="Nhập họ và tên"
                  value={name}
                  onChangeText={setName}
                />
                <Text style={styles.notificationError}>{errMessage}</Text>
              </View>

              <View style={[styles.wrapName, GlobalStyles.test3]}>
                <TextInput
                  style={styles.inputBorderBottom}
                  placeholder="Nhập địa chỉ"
                  value={address}
                  onChangeText={setAddress}
                />
                <Text style={styles.notificationError}>{errMessage}</Text>
              </View>

              {/* input password */}
              <View style={[styles.wrapBirthDate, GlobalStyles.test3]}>
                <Text style={styles.txtOfInput}>Ngày tháng năm sinh</Text>
                {/* date */}
                <Pressable
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    borderWidth: 1,
                    padding: 5,
                    borderRadius: 10,
                  }}
                  onPress={() => openModalDate()}
                >
                  <Image
                    source={require("../assets/calendar.png")}
                    style={{ marginHorizontal: 10 }}
                  />
                  <Text style={{ fontSize: 18, fontWeight: "500" }}>
                    {textDate}
                  </Text>
                </Pressable>
                <Text style={styles.notificationError}>{errMessage}</Text>

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
              </View>

              {/* input password again */}
              <View style={[styles.wrapGender, GlobalStyles.test3]}>
                <Text style={styles.txtOfInput}>Giới tính</Text>
                <View style={styles.wrapCheckBoxGender}>
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
                    <Text>Khác</Text>
                  </Pressable>
                </View>
                <Text style={styles.notificationError}>{errMessage}</Text>
              </View>

              <View style={[styles.wrapIntroducePersonal, GlobalStyles.test3]}>
                <Text style={styles.txtOfInput}>Giới thiệu bản thân</Text>
                <TextInput
                  style={[styles.input, { height: 80 }]}
                  placeholder="Giới thiệu sơ lược về bản thân của bạn"
                  value={introduceYourself}
                  onChangeText={setIntroduceYourself}
                  multiline={true}
                  numberOfLines={4}
                />
              </View>

              {/* button Register */}
              <View style={styles.wrapBtnCompleted}>
                <TouchableOpacity
                  style={styles.btnCompleted}
                  onPress={handleRegister}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: "white",
                      fontWeight: "500",
                      textAlign: "center",
                    }}
                  >
                    Hoàn tất
                  </Text>
                </TouchableOpacity>
              </View>

              {/* chuyen den dang ky moi */}
              <View style={styles.haveAccount}>
                <Text style={styles.useAllText16}>Bạn đã có tài khoản ?</Text>
                <TouchableOpacity
                  // onPress={() => navigation.navigate("SC_Login")}
                  onPress={showGender}
                >
                  <Text
                    style={[
                      styles.useAllText16,
                      {
                        color: "#4eac6d",
                        fontWeight: "800",
                        textDecorationLine: "underline",
                      },
                    ]}
                  >
                    {" "}
                    Đăng nhập !
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* end content main Register with input, button, checkbox,... */}

            {/* thong tin khac */}
            <View style={styles.footerFormRegister}>
              <Text style={[{ fontWeight: "900", textAlign: "center" }]}>
                © 2022 Alo. Thiết kế bởi CDNTV
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
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
            {/* <LoadingCircle /> */}
            <LoadingBar progress={0.5} />
          </View>
        </Modal>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4eac6d",
  },

  useAllText16: {
    fontSize: 16,
  },

  wrapAllContent: {
    margin: 24,
    // backgroundColor: "red",
  },

  wrapContentVerify: {
    flex: 1,
    // marginTop: 24,
    height: Dimensions.get("window").width * 1.8,
    padding: 24,
    backgroundColor: "white",
    borderRadius: 20,
  },

  contentHeder: {
    flex: 2,
    alignItems: "center",
    height: "20%",
    flexGrow: 2,
  },

  txtTitleHeader: {
    color: "white",
    fontSize: 24,
    fontWeight: "700",
  },

  txtTitleHeaderSub: {
    color: "white",
    opacity: 0.8,
    fontSize: 16,
    marginTop: 5,
    textAlign: "center",
  },

  aboveFormVerify: {
    flex: 1,
    flexGrow: 1,
    alignItems: "center",
    textAlign: "center",
    marginBottom: 30,
    // backgroundColor: "blue",
  },

  mainFormVerify: {
    flex: 1,
    // backgroundColor: "violet",
    flexGrow: 8,
  },

  footerFormRegister: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    // backgroundColor: "pink",
    flexGrow: 0.5,
  },

  wrapName: {
    marginBottom: 15,
  },

  datePickerStyle: {
    width: "100%",
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 5,
  },

  input: {
    fontSize: 18,
    fontWeight: "500",
    color: "black",
    borderWidth: 1,
    borderColor: "grey",
    padding: 10,
    borderRadius: 5,
  },

  inputBorderBottom: {
    fontSize: 18,
    fontWeight: "500",
    color: "black",
    borderBottomColor: "grey",
    borderBottomWidth: 2,
    padding: 10,
  },

  txtOfInput: {
    color: "#000",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 5,
  },

  wrapCheckBoxGender: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  wrapBtnCompleted: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "red",
  },

  btnCompleted: {
    paddingVertical: 15,
    width: "100%",
    backgroundColor: "#4eac6d",
    borderRadius: 20,
    shadowColor: "#000000",
    shadowOpacity: 0.9,
    shadowRadius: 5,
    shadowOffset: {
      height: 2,
      width: 2,
    },
    elevation: 10,
  },

  haveAccount: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "red",
  },

  notificationError: {
    color: "red",
    fontSize: 14,
    marginLeft: 10,
  },
});

export default SC_Continue;
