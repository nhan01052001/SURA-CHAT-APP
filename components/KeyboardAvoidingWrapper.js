import React from "react";

import {
  KeyboardAvoidingView,
  ScrollView,
  TouchableNativeFeedback,
  Keyboard,
} from "react-native";

const KeyboardAvoidingWrapper = ({ children }) => {
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "red" }}>
      <ScrollView>
        <TouchableNativeFeedback onPress={Keyboard.dismiss}>
          {/* {children} */}
        </TouchableNativeFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default KeyboardAvoidingWrapper;
