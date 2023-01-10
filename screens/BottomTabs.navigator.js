import React from "react";
import { Text, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { Home } from "./Home.screen";
import { PhoneBook } from "./PhoneBook.screen";
import { Explore } from "./Explore.screen";
import { Diary } from "./Diary.screen";
import { Personal } from "./Personal.screen";
import {
  HomeIcon,
  PhoneBookIcon,
  ExploreIcon,
  DiaryIcon,
  PersonalIcon,
} from "../components/IconBottomTabs";
import { theme } from "../assets/theme";

const BottomTabs = createBottomTabNavigator();
const Tab = createMaterialBottomTabNavigator();
const size = 27;

const BottomTabsNavigator = ({ route }) => {
  // const { token } = route.params;
  return (
    // <BottomTabs.Navigator
    //     screenOptions={({ route }) => ({
    //         tabBarActiveTintColor: theme.colorBlue,
    //         tabBarInactiveTintColor: theme.colorGrey,
    //         tabBarShowLabel: true,

    //         tabBarStyle: {
    //             position: 'absolute',
    //             bottom: 20,
    //             paddingBottom: 5,
    //             height: 60,
    //             shadowColor:'black',
    //             marginHorizontal: 5,
    //             borderRadius: 20,
    //             shadowOffset: {width: -2, height: 4},
    //             shadowOpacity: 0.5,
    //             backgroundColor: 'white',
    //         },
    //         tabBarIconStyle : {
    //             position: 'relative',
    //             top: 0,
    //             bottom: 0,
    //         },
    //         tabBarLabelStyle: {
    //             fontSize: 13,
    //             fontWeight: '500',
    //         },

    //         tabBarIcon: ({ color, size, focused }) => {
    //             if(route.name === 'Home') {
    //                 return <HomeIcon color={color} size={size} />;
    //             }

    //             if(route.name === 'PhoneBook') {
    //                 return <PhoneBookIcon color={color} size={size} />;
    //             }

    //             if(route.name === 'Explore') {
    //                 return <ExploreIcon color={color} size={size} />;
    //             }

    //             if(route.name === 'Diary') {
    //                 return <DiaryIcon color={color} size={size} />;
    //             }

    //             if(route.name === 'Personal') {
    //                 return <PersonalIcon color={color} size={size} />;
    //             }

    //             return null;
    //         },
    // })}>
    //     <Tab.Screen name="Home" component={Home} options={{ title: 'Home' }} />
    //     <Tab.Screen name="PhoneBook" component={PhoneBook} options={{ title: 'PhoneBook' }} />
    //     <Tab.Screen name="Explore" component={Explore} options={{ title: 'Explore' }} />
    //     <Tab.Screen name="Diary" component={Diary} options={{ title: 'Diary' }} />
    //     <Tab.Screen name="Personal" component={Personal} options={{ title: 'Personal' }} />
    // </BottomTabs.Navigator>

    <Tab.Navigator
      initialRouteName="Home"
      activeColor="#074791"
      shifting={true}
      barStyle={{
        backgroundColor: "white",
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => <HomeIcon color={color} size={size} />,
        }}
        // initialParams={{ token: token }}
      />
      <Tab.Screen
        name="PhoneBook"
        component={PhoneBook}
        options={{
          tabBarLabel: "PhoneBook",
          tabBarIcon: ({ color }) => (
            <PhoneBookIcon color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Explore"
        component={Explore}
        options={{
          tabBarLabel: "Explore",
          tabBarIcon: ({ color }) => <ExploreIcon color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Diary"
        component={Diary}
        options={{
          tabBarLabel: "Diary",
          tabBarIcon: ({ color }) => <DiaryIcon color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Personal"
        component={Personal}
        options={{
          tabBarLabel: "Personal",
          tabBarIcon: ({ color }) => <PersonalIcon color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabsNavigator;
