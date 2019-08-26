import React from "react";
import {
  createStackNavigator,
  createBottomTabNavigator
} from "react-navigation";
import { Icon } from "react-native-elements";

import HomeScreen from "../screens/HomeScreen";
import ExploreScreen from "../screens/ExploreScreen";
import CreateEventScreen from "../screens/CreateEventScreen";
import SingleEventScreen from "../screens/SingleEventScreen";

const HomeStack = createStackNavigator({
  Home: HomeScreen,
  SingleEventScreen: SingleEventScreen
});

HomeStack.navigationOptions = {
  tabBarLabel: "Home"
};

const ExploreStack = createStackNavigator({
  Explore: ExploreScreen
});

ExploreStack.navigationOptions = {
  tabBarLabel: "Search"
};

const CreateEventStack = createStackNavigator({
  CreateEvent: CreateEventScreen
});

CreateEventStack.navigationOptions = {
  tabBarLabel: "Create"
};

export default createBottomTabNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: () => ({
        // eslint-disable-next-line react/display-name
        tabBarIcon: ({ tintColor }) => (
          <Icon name="home" color={tintColor} size={30} />
        )
      })
    },
    Explore: {
      screen: ExploreScreen,
      navigationOptions: () => ({
        // eslint-disable-next-line react/display-name
        tabBarIcon: ({ tintColor }) => (
          <Icon name="explore" color={tintColor} size={30} />
        )
      })
    },
    Event: {
      screen: CreateEventScreen,
      navigationOptions: () => ({
        // eslint-disable-next-line react/display-name
        tabBarIcon: ({ tintColor }) => (
          <Icon name="create" color={tintColor} size={30} />
        )
      })
    }
  },
  {
    tabBarOptions: {
      showLabel: false,
      activeBackgroundColor: "#32A7BE",
      inactiveBackgroundColor: "#32A7BE",
      activeTintColor: "white",
      inactiveTintColor: "#C0C0C0"
    }
  }
);
