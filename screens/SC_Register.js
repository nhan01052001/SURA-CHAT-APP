import React, { useState, useEffect } from "react";
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
  Image,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import GlobalStyles from "../components/GlobalStyles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Feather } from "@expo/vector-icons";
import { useTogglePasswordVisibility } from "../hook/useTogglePasswordVisibility";
import SC_Continue from "./SC_Continue";
import { LinearGradient } from "expo-linear-gradient";
import { ApiRegisterUser, ApiUser } from "../api/ApiUser";
import { isValidNumberPhone, isValidPassword } from "../utils/validations";

const { width, height } = Dimensions.get("window");

const SC_Register = ({ navigation }) => {
  const {
    passwordVisibility,
    rightIcon,
    handlePasswordVisibility,
    passwordVisibility2,
    rightIcon2,
    handlePasswordVisibility2,
  } = useTogglePasswordVisibility();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errNumberPhone, setErrNumberPhone] = useState("");
  const [statusNumberPhone, setStatusNumberPhone] = useState(false);
  const [errPassword, setErrPassword] = useState("");
  const [statusPassword, setStatusPassword] = useState(false);
  const [errConfirmPassword, setErrConfirmPassword] = useState("");
  const [statusConfirmPassword, setStatusConfirmPassword] = useState(false);
  const [messCheckNumberPhone, setMessCheckNumberPhone] = useState("");

  const handleContinue = async () => {
    const data = {
      username,
    };

    await ApiRegisterUser.checkExistAccount(data)
      .then((res) => {
        if (res.status === 200) {
          Alert.alert("Số điện thoại đã được đăng ký!");
        } else {
          navigation.navigate(
            "SC_Continue",
            {
              username: username,
              password: password,
            },
            resetInput()
          );
        }
      })
      .catch((error) => {
        console.log(error);
        Alert.alert("Hệ thống đang gặp lỗi. Vui lòng thông báo cho Admin!");
      });
  };

  const checkExistNumberPhone = async (text) => {
    const data = {
      username: text,
    };
    await ApiRegisterUser.checkExistAccount(data)
      .then((res) => {
        if (res.status === 200) {
          setMessCheckNumberPhone("Số điện thoại đã được đăng ký!");
          setStatusNumberPhone(false);
        } else {
          console.log(res.status);
          setStatusNumberPhone(true);
          setMessCheckNumberPhone("");
        }
      })
      .catch((error) => {
        console.log(error);
        setMessCheckNumberPhone(
          "Hệ thống đang gặp lỗi. Vui lòng thông báo cho Admin!"
        );
        setStatusNumberPhone(false);
      });
  };

  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      "change",
      ({ window, screen }) => {
        setDimensions({ window, screen });
      }
    );
    return () => subscription?.remove();
  });

  function resetInput() {
    setUsername("");
    setPassword("");
    setConfirmPassword("");
  }

  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      colors={["#4eac6d", "white", "#cfd1d0"]}
      style={styles.container}
    >
      <KeyboardAwareScrollView style={{ flex: 1 }}>
        <View style={styles.wrapAllContent}>
          <View style={styles.contentHeder}>
            <Image
              source={require("../assets/logo_black.png")}
              style={{ flex: 1 }}
            />
          </View>

          {/* content Register */}
          <View style={[styles.wrapContentRegister, GlobalStyles.test2]}>
            {/* begin title content Register */}
            <View style={styles.aboveFormRegister}>
              <Text style={[styles.txtTitleHeader, { color: "black" }]}>
                Đăng ký
              </Text>
              <Text
                style={[
                  styles.txtTitleHeaderSub,
                  { color: "black", opacity: 0.5 },
                ]}
              >
                Đăng ký tài khoản miễn phí tốn 20k
              </Text>
            </View>
            {/* end title content Register */}

            {/* begin content main Register with input, button checkbox,... */}
            <View style={styles.mainFormRegister}>
              {/* input so dien thoai */}
              <View style={[styles.wrapNumberPhone, GlobalStyles.test3]}>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="Nhập số điện thoại"
                  value={username}
                  onChangeText={(text) => {
                    if (text === "") {
                      setErrNumberPhone("Só điện thoại không được bỏ trống!");
                      setMessCheckNumberPhone("");
                    } else {
                      setErrNumberPhone(
                        isValidNumberPhone(text)
                          ? ""
                          : "Số điện thoại không hợp lệ!"
                      );
                      if (isValidNumberPhone(text)) {
                        checkExistNumberPhone(text);
                        // setStatusNumberPhone(true);
                      } else {
                        setStatusNumberPhone(false);
                        setMessCheckNumberPhone("");
                      }
                    }
                    setUsername(text);
                  }}
                />
                {messCheckNumberPhone === "" ? (
                  <Text style={styles.notificationError}>{errNumberPhone}</Text>
                ) : (
                  <Text style={styles.notificationError}>
                    {messCheckNumberPhone}
                  </Text>
                )}
              </View>

              {/* input password */}
              <View style={[styles.wrapPassword, GlobalStyles.test3]}>
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

              {/* input password again */}
              <View style={[styles.wrapPassword, GlobalStyles.test3]}>
                <View>
                  <TextInput
                    style={styles.input}
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="confirmPassword"
                    secureTextEntry={passwordVisibility2}
                    value={confirmPassword}
                    enablesReturnKeyAutomatically
                    onChangeText={(text) => {
                      if (text === "") {
                        setErrConfirmPassword("Không được bỏ trống!");
                      } else {
                        setErrConfirmPassword(
                          text === password
                            ? ""
                            : "Phải khớp với mật khẩu ở trên!"
                        );

                        if (text === password) {
                          setStatusConfirmPassword(true);
                        } else {
                          setStatusConfirmPassword(false);
                        }
                      }

                      setConfirmPassword(text);
                    }}
                    placeholder="Phải khớp với mật khẩu ở trên"
                  />
                  <Pressable onPress={handlePasswordVisibility2}>
                    <Feather
                      name={rightIcon2}
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
                  <Text style={styles.notificationError}>
                    {errConfirmPassword}
                  </Text>
                </View>
              </View>

              {/* button Register */}
              <View style={styles.wrapBtnRegister}>
                {username === "" ||
                password === "" ||
                confirmPassword === "" ||
                statusNumberPhone === false ||
                statusPassword === false ||
                statusConfirmPassword === false ? (
                  <TouchableOpacity
                    disabled
                    style={[styles.btnRegister, { backgroundColor: "#6b706c" }]}
                    onPress={() => navigation.navigate("SC_OTP", resetInput())}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        color: "white",
                        fontWeight: "500",
                        textAlign: "center",
                      }}
                    >
                      Tiếp tục
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.btnRegister}
                    onPress={() =>
                      navigation.navigate(
                        "SC_OTP",
                        {
                          username: username,
                          password: password,
                        },
                        resetInput()
                      )
                    }
                    // onPress={handleContinue}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        color: "white",
                        fontWeight: "500",
                        textAlign: "center",
                      }}
                    >
                      Tiếp tục
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* chuyen den dang ky moi */}
              <View style={styles.haveAccount}>
                <Text style={styles.useAllText16}>Bạn đã có tài khoản?</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("SC_Login")}
                >
                  <Text
                    style={[
                      styles.useAllText16,
                      {
                        marginLeft: 5,
                        color: "blue",
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
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#4eac6d",
  },

  txtValidation: {
    color: "red",
  },

  useAllText16: {
    fontSize: 16,
  },

  wrapAllContent: {
    margin: 24,
    // backgroundColor: "red",
  },

  wrapContentRegister: {
    flex: 1,
    // marginTop: 24,
    // height: Dimensions.get("window").width * 1.7,
    // padding: 24,
    // backgroundColor: "white",
    // borderRadius: 20,
  },

  contentHeder: {
    flex: 1,
    alignItems: "center",
    height: "20%",
    marginBottom: 24,
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

  aboveFormRegister: {
    flex: 1,
    flexGrow: 2,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    // backgroundColor: "blue",
  },

  mainFormRegister: {
    flex: 1,
    // backgroundColor: "violet",
    flexGrow: 7,
  },

  footerFormRegister: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    // backgroundColor: "pink",
    // flexGrow: 1,
  },

  wrapNumberPhone: {
    marginBottom: 15,
  },

  wrapPassword: {
    marginBottom: 15,
  },

  input: {
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

  wrapBtnRegister: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  btnRegister: {
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
  },
  notificationError: {
    color: "red",
    fontSize: 14,
    marginLeft: 10,
    marginTop: 5,
  },
});

export default SC_Register;
