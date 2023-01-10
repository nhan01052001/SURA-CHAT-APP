import React, { useState } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { firebase } from "../config";
import Modal from "react-native-modal";
import LoadingCircle from "../components/LoadingCircle";

export const Explore = () => {
  const [image, setImage] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const chooseImg = async () => {
    let rs = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      // base64: true,
    });

    if (!rs.canceled) {
      const uri = rs.assets[0].uri;

      let fileExtension = uri.substring(uri.lastIndexOf(".") + 1);
      const isImg = rs.assets[0].type == "image" ? true : false;
      const type = fileExtension;

      // const token = await AsyncStorage.getItem("token");
      const fileName = uri.substring(uri.lastIndexOf("/") + 1, uri.length);
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function () {
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send(null);
      });
      const ref = firebase.storage().ref().child(`Pictures/${fileName}`);
      const snapshot = ref.put(blob);
      snapshot.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        () => {
          setModalLoading(true);
        },
        (error) => {
          setModalLoading(false);
          console.log(error);
          blob.close();
          return;
        },
        () => {
          snapshot.snapshot.ref.getDownloadURL().then((url) => {
            setModalLoading(false);
            console.log("Download URL: ", url);
            setImage(null);
            blob.close();
            return url;
          });
        }
      );
    }
  };

  const uploadImg = async () => {
    // const response = await fetch(image.uri);
    // const blod = await response.blob();
    // const fileName = image.uri.substring(
    //   image.uri.lastIndexOf("/") + 1,
    //   image.uri.length
    // );
    // //const fileName = image.uri.subString(image.uri.lastIndexOf("/") + 1);
    // var ref = firebase.storage().ref().child(fileName).put(blod);

    // try {
    //   await ref;
    //   console.log(ref);
    // } catch (e) {
    //   console.log("E: " + e);
    // }

    // setImage(null);
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", image, true);
      xhr.send(null);
    });
    const ref = firebase.storage().ref().child(`Pictures/Image1`);
    const snapshot = ref.put(blob);
    snapshot.on(
      firebase.storage.TaskEvent.STATE_CHANGED,
      () => {
        // onUploadProgress: ({ loaded, total }) => {
        //   setModalVisible(true);
        //   setProgress(loaded / total);
        // };
        setModalLoading(true);
      },
      (error) => {
        setModalLoading(false);
        console.log(error);
        blob.close();
        return;
      },
      () => {
        snapshot.snapshot.ref.getDownloadURL().then((url) => {
          setModalLoading(false);
          console.log("Download URL: ", url);
          setImage(null);
          blob.close();
          return url;
        });
      }
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={chooseImg}>
        <Text>Chon anh</Text>
      </TouchableOpacity>
      {image && (
        <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
      )}
      <TouchableOpacity onPress={uploadImg}>
        <Text>Up load</Text>
      </TouchableOpacity>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
