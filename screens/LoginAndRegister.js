import React, { Fragment, Component } from "react";
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  View,
  Image,
  ImageBackground,
  SafeAreaView,
  Dimensions,
} from "react-native";
import Swiper from "react-native-swiper";
import GlobalStyles from "../components/GlobalStyles";
import BottomTabsNavigator from "./BottomTabs.navigator";
import SC_Login from "./SC_Login";
import SC_Register from "./SC_Register";

const { width } = Dimensions.get("window");

const LoginAndRegister = ({ navigation }) => {
  return (
    <SafeAreaView style={[styles.container, GlobalStyles.droidSafeArea]}>
      <View style={styles.container}>
        <Swiper
          style={styles.wrapper}
          showsButtons
          dot={
            <View
              style={{
                backgroundColor: "black",
                width: 8,
                height: 8,
                borderRadius: 7,
                marginLeft: 7,
                marginRight: 7,
              }}
            />
          }
          activeDot={
            <View
              style={{
                backgroundColor: "red",
                width: 10,
                height: 10,
                borderRadius: 7,
                marginLeft: 7,
                marginRight: 7,
              }}
            />
          }
          paginationStyle={{
            bottom: 10,
          }}
          loop={true}
          autoplay={true}
        >
          <View style={styles.slide}>
            <Image
              style={styles.image}
              source={require("../assets/splash.png")}
              resizeMode={"contain"}
            />
          </View>
          <View style={styles.slide}>
            <Image
              style={styles.image}
              source={require("../assets/slideshow/s2.png")}
              resizeMode={"contain"}
            />
            <Text style={styles.textMain}>Nhật ký bạn bè</Text>
            <Text style={styles.textSub}>
              Nơi cập nhật hoạt động mới nhất của những người bạn quan tâm
            </Text>
          </View>
          <View style={styles.slide}>
            <Image
              style={styles.image}
              source={require("../assets/slideshow/s3.png")}
              resizeMode={"contain"}
            />
            <Text style={styles.textMain}>Gửi ảnh nhanh chóng</Text>
            <Text style={styles.textSub}>
              Trao đổi hình ảnh chất lượng cao với bạn bè và người thân nhanh và
              dễ dàng
            </Text>
          </View>
          <View style={styles.slide}>
            <Image
              style={styles.image}
              source={require("../assets/slideshow/s4.png")}
              resizeMode={"contain"}
            />
            <Text style={styles.textMain}>Chat nhóm tiện ích</Text>
            <Text style={styles.textSub}>
              Nơi cùng nhau trao đổi, giữ liên lạc với gia đình, bạn bè, đồng
              nghiệp,...
            </Text>
          </View>
          <View style={styles.slide}>
            <Image
              style={styles.image}
              source={require("../assets/slideshow/s5.png")}
              resizeMode={"contain"}
            />
            <Text style={styles.textMain}>Gọi video ổn định</Text>
            <Text style={styles.textSub}>
              Trò chuyện thật đã với chất lượng video ổn định mọi lúc, mọi nơi
            </Text>
          </View>
        </Swiper>
        <View style={styles.wrapBtn}>
          <View style={styles.temp}>
            <TouchableOpacity
              style={styles.btnLogin}
              onPress={() => navigation.navigate("SC_Login")}
            >
              <Text
                style={{
                  fontSize: 20,
                  color: "white",
                  fontWeight: "500",
                  textAlign: "center",
                }}
              >
                Đăng Nhập
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnRegister}
              onPress={() => navigation.navigate("SC_Register")}
            >
              <Text
                style={{ fontSize: 20, fontWeight: "500", textAlign: "center" }}
              >
                Đăng Ký
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.temp2, GlobalStyles.iosPD]}>
          <TouchableOpacity>
            <Text>Tiếng Việt</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text>English</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  wrapper: {},
  slide: {
    height: "70%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  textMain: {
    color: "#000",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  textSub: {
    fontSize: 15,
    color: "#000",
    opacity: 0.5,
    textAlign: "center",
    marginHorizontal: 20,
  },
  image: {
    width,
    flex: 1,
  },
  wrapBtn: {
    height: "30%",
    width,
  },
  temp: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width,
  },
  temp2: {
    position: "absolute",
    flexDirection: "row",
  },
  btnLogin: {
    marginTop: -15,
    paddingVertical: 12,
    width: "70%",
    borderRadius: 30,
    backgroundColor: "#4eac6d",
  },
  btnRegister: {
    marginTop: 15,
    paddingVertical: 12,
    width: "70%",
    borderRadius: 30,
    backgroundColor: "#ccc",
  },
});

export default LoginAndRegister;
