import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  ViewBase,
  Keyboard,
  Platform,
  Pressable,
  Alert,
  Image,
} from "react-native";
import axios from "axios";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import GlobalStyles from "../components/GlobalStyles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Feather } from "@expo/vector-icons";
import { useTogglePasswordVisibility } from "../hook/useTogglePasswordVisibility";
import { ApiUser } from "../api/ApiUser";
import { ApiProfile } from "../api/ApiUser";
import { LinearGradient } from "expo-linear-gradient";
import { isValidNumberPhone, isValidPassword } from "../utils/validations";

const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

const SC_Login = ({ navigation }) => {
  const [dimensions, setDimensions] = useState({ window, screen });
  const { passwordVisibility, rightIcon, handlePasswordVisibility } =
    useTogglePasswordVisibility();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [errNumberPhone, setErrNumberPhone] = useState("");
  const [statusNumberPhone, setStatusNumberPhone] = useState(false);
  const [errPassword, setErrPassword] = useState("");
  const [statusPassword, setStatusPassword] = useState(false);

  const [test, setTest] = useState("");
  const [token, setToken] = useState("");

  const [isRememberPassword, setIsRememberPassword] = useState(false);
  // AsyncStorage.setItem(
  //   "isRememberPassword",
  //   JSON.stringify(isRememberPassword)
  // );

  const eventRememberPassword = async () => {
    if (isRememberPassword === true) {
      console.log("false");
      setIsRememberPassword(false);
      await AsyncStorage.setItem("isRememberPassword", JSON.stringify(false));
    } else {
      console.log("true");
      setIsRememberPassword(true);
      await AsyncStorage.setItem("isRememberPassword", JSON.stringify(true));
    }
  };

  const getIsRememberPassword = async () => {
    const temp = await AsyncStorage.getItem("isRememberPassword");
    const username = await AsyncStorage.getItem("username");
    const password = await AsyncStorage.getItem("password");
    console.log("temp");
    console.log(JSON.parse(temp));
    console.log(username);
    if (JSON.parse(temp) === true) {
      setIsRememberPassword(JSON.parse(temp));
      setUsername(username);
      setPassword(password);
    } else {
      setIsRememberPassword(JSON.parse(temp));
      setUsername("");
      setPassword("");
    }
  };

  useEffect(() => {
    getIsRememberPassword();
  }, []);

  const handleLogin = async () => {
    const data = {
      username,
      password,
    };
    try {
      await ApiUser.login(data)
        .then(async (res) => {
          console.log(
            "dang nhap thanh cong voi token tra ve la: " + res.data.accessToken
          );
          await AsyncStorage.setItem("token", res.data.accessToken);
          await AsyncStorage.setItem("idUser", res.data.user._id);
          if (isRememberPassword === true) {
            console.log("luu");
            await AsyncStorage.setItem("username", username);
            await AsyncStorage.setItem("password", password);
            await AsyncStorage.setItem(
              "isRememberPassword",
              JSON.stringify(true)
            );
          }
          navigation.replace("BottomTabsNavigator", {
            token: res.data.accessToken,
          });
        })
        .catch((err) => {
          console.log("dang nhap khong thanh cong");
          Alert.alert("Tài khoản hoặc mật khẩu không chính xác!");
        });
    } catch (error) {
      Alert.alert(error);
    }
    // navigation.replace("BottomTabsNavigator");
  };

  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      "change",
      ({ window, screen }) => {
        setDimensions({ window, screen });
      }
    );
    return () => subscription?.remove();
  }, []);

  console.log("-----------------");

  return (
    <LinearGradient
      start={{ x: 1, y: 1 }}
      end={{ x: 1, y: 0 }}
      colors={["#4eac6d", "#cfd1d0", "white"]}
      style={styles.container}
    >
      <KeyboardAwareScrollView style={{ flex: 1 }}>
        <View style={styles.wrapAllContent}>
          <View style={styles.contentHeder}>
            <Image
              source={require("../assets/logo-no-background2.png")}
              style={{ flex: 1 }}
            />
          </View>

          {/* content login */}
          <View style={[styles.wrapContentLogin, GlobalStyles.test]}>
            {/* begin title content login */}
            <View style={styles.aboveFormLogin}>
              <Text style={[styles.txtTitleHeader, { color: "black" }]}>
                Đăng nhập
              </Text>
              <Text
                style={[
                  styles.txtTitleHeaderSub,
                  { color: "black", opacity: 0.5 },
                ]}
              >
                Đăng nhập để tiếp tục sử dụng Alo
              </Text>
            </View>
            {/* end title content login */}

            {/* begin content main login with input, button checkbox,... */}
            <View style={styles.mainFormLogin}>
              {/* input so dien thoai */}
              <View style={styles.wrapNumberPhone}>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="Nhập số điện thoại"
                  value={username}
                  onChangeText={(text) => {
                    if (text === "") {
                      setErrNumberPhone("Só điện thoại không được bỏ trống!");
                    } else {
                      setErrNumberPhone(
                        isValidNumberPhone(text)
                          ? ""
                          : "Số điện thoại không hợp lệ!"
                      );
                      if (isValidNumberPhone(text)) {
                        setStatusNumberPhone(true);
                      } else {
                        setStatusNumberPhone(false);
                      }
                    }
                    setUsername(text);
                  }}
                />
                <Text style={styles.notificationError}>{errNumberPhone}</Text>
              </View>

              {/* input password */}
              <View style={styles.wrapPassword}>
                <View>
                  <TextInput
                    style={styles.input}
                    name="password"
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="newPassword"
                    secureTextEntry={passwordVisibility}
                    value={password}
                    enablesReturnKeyAutomatically
                    onChangeText={(text) => {
                      if (text === "") {
                        setErrPassword("Mật khẩu không được bỏ trống!");
                      } else {
                        setErrPassword(
                          isValidPassword(text)
                            ? ""
                            : "Mật khẩu phải từ 6 đến 20 ký tự và phải có một chữ số và một ký tự đặc biệt!"
                        );
                        if (isValidPassword(text)) {
                          setStatusPassword(true);
                        } else {
                          setStatusPassword(false);
                        }
                      }
                      setPassword(text);
                    }}
                    placeholder="Nhập mật khẩu"
                  />
                  <Pressable onPress={handlePasswordVisibility}>
                    <Feather
                      name={rightIcon}
                      size={22}
                      color="#232323"
                      style={{
                        width: 50,
                        position: "absolute",
                        right: 0,
                        bottom: 10,
                      }}
                    />
                  </Pressable>
                  <Text style={styles.notificationError}>{errPassword}</Text>
                </View>
              </View>

              {/* remember password and forget password */}
              <View style={styles.wrapDiff}>
                <View style={styles.checkBoxRememberPassWord}>
                  {/* <BouncyCheckbox
                    size={16}
                    text="Nhớ mật khẩu"
                    fillColor="#4eac6d"
                    unfillColor="#FFFFFF"
                    textStyle={{
                      textDecorationLine: "none",
                      marginLeft: -10,
                      fontSize: 16,
                    }}
                    iconStyle={{ borderColor: "#4eac6d" }}
                    innerIconStyle={{ borderWidth: 2 }}

                  /> */}
                  <Pressable
                    style={{ flexDirection: "row", alignItems: "center" }}
                    onPress={() => eventRememberPassword()}
                  >
                    {isRememberPassword === true ? (
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
                    <Text>Nhớ mật khẩu</Text>
                  </Pressable>
                </View>
                <TouchableOpacity style={styles.forgetPassword}>
                  <Text style={{ fontSize: 16 }}>Quên mật khẩu ?</Text>
                </TouchableOpacity>
              </View>

              {/* button login */}
              <View style={styles.wrapBtnLogin}>
                {username === "" || password === "" ? (
                  // ||
                  // statusNumberPhone === false ||
                  // statusPassword === false
                  <TouchableOpacity
                    disabled
                    style={[styles.btnLogin, { backgroundColor: "#6b706c" }]}
                    // onPress={() => navigation.navigate("BottomTabsNavigator")}
                    onPress={handleLogin}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        color: "white",
                        fontWeight: "500",
                        textAlign: "center",
                      }}
                    >
                      Đăng Nhập
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.btnLogin}
                    // onPress={() => navigation.navigate("BottomTabsNavigator")}
                    // onPress={onSubmitHandler}
                    onPress={handleLogin}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        color: "white",
                        fontWeight: "500",
                        textAlign: "center",
                      }}
                    >
                      Đăng Nhập
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* chuyen den dang ky moi */}
              <View style={styles.dontHaveAccount}>
                <Text style={styles.useAllText16}>Bạn chưa có tài khoản?</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("SC_Register")}
                >
                  <Text
                    style={[
                      styles.useAllText16,
                      {
                        color: "blue",
                        fontWeight: "800",
                        textDecorationLine: "underline",
                        marginLeft: 5,
                      },
                    ]}
                  >
                    Đăng ký
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* end content main login with input, button, checkbox,... */}

            {/* thong tin khac */}
            <View style={styles.footerFormLogin}>
              <Text style={[{ fontWeight: "900", textAlign: "center" }]}>
                © 2022 Alo. Thiết kế bởi CDNTV
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: "#4eac6d",
  },

  useAllText16: {
    fontSize: 16,
  },

  wrapAllContent: {
    margin: 24,
    // backgroundColor: "red",
  },

  wrapContentLogin: {
    flex: 1,
    // marginTop: 24,
    // height: Dimensions.get("window").width * 1.55,
    // padding: 24,
    // // backgroundColor: "white",
    // borderRadius: 20,
  },

  contentHeder: {
    flex: 1,
    alignItems: "center",
    height: "20%",
    marginBottom: 24,
    // flexGrow: 3,
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

  aboveFormLogin: {
    flex: 1,
    flexGrow: 2,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    // marginBottom: 24,
    // backgroundColor: "blue",
  },

  mainFormLogin: {
    flex: 1,
    // backgroundColor: "violet",
    flexGrow: 6,
  },

  footerFormLogin: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    // backgroundColor: "pink",
    // flexGrow: 0.5,
  },

  wrapNumberPhone: {
    marginBottom: 24,
  },

  wrapPassword: {
    marginBottom: 14,
  },

  input: {
    fontSize: 18,
    fontWeight: "500",
    color: "black",
    borderBottomColor: "grey",
    borderBottomWidth: 2,
    padding: 10,
  },

  wrapDiff: {
    flex: 1,
    // flexGrow: 1,
    // marginTop: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // backgroundColor: "red",
  },

  checkBoxRememberPassWord: {
    flexDirection: "row",
    alignItems: "center",
  },

  wrapBtnLogin: {
    flex: 1,
    // flexGrow: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    // backgroundColor: "red",
  },

  btnLogin: {
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

  dontHaveAccount: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    // backgroundColor: "red",
  },

  notificationError: {
    color: "red",
    fontSize: 14,
    marginLeft: 10,
  },
});

export default SC_Login;
