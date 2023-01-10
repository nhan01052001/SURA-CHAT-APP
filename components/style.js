import styled from "styled-components";

import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
  Alert,
  Image,
  FlatList,
  RefreshControl,
  TextInput,
} from "react-native";

export const CodeInputSection = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  margin-vertical: 30px;
`;

export const HiddenTextInput = styled.TextInput`
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
`;

export const CodeInputsContainer = styled.Pressable`
  width: 80%;
  flex-direction: row;
  justify-content: space-between;
`;

export const CodeInput = styled.View`
  border-color: green;
  min-width: 12%;
  border-width: 2px;
  border-radius: 5px;
  padding: 10px;
`;

export const CodeInputText = styled.Text`
  font-size: 22px;
  font-weight: bold;
  text-align: center;
  color: red;
`;

export const CodeInputFocused = styled(CodeInput)`
  border-color: green;
`;
