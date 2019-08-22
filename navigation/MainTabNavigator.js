import React from 'react';
import {
  createStackNavigator,
  createBottomTabNavigator,
} from 'react-navigation';
import { Icon } from 'react-native-elements';

import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import CreateEventScreen from '../screens/CreateEventScreen';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
};

const SearchStack = createStackNavigator({
  Search: SearchScreen,
});

SearchStack.navigationOptions = {
  tabBarLabel: 'Search',
};

const CreateEventStack = createStackNavigator({
  CreateEvent: CreateEventScreen,
});

CreateEventStack.navigationOptions = {
  tabBarLabel: 'Create',
};

export default createBottomTabNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: () => ({
        // eslint-disable-next-line react/display-name
        tabBarIcon: ({ tintColor }) => (
          <Icon name="home" color={tintColor} size={30} />
        ),
      }),
    },
    Search: {
      screen: SearchScreen,
      navigationOptions: () => ({
        // eslint-disable-next-line react/display-name
        tabBarIcon: ({ tintColor }) => (
          <Icon name="search" color={tintColor} size={30} />
        ),
      }),
    },
    Event: {
      screen: CreateEventScreen,
      navigationOptions: () => ({
        // eslint-disable-next-line react/display-name
        tabBarIcon: ({ tintColor }) => (
          <Icon name="create" color={tintColor} size={30} />
        ),
      }),
    },
  },
  {
    tabBarOptions: {
      showLabel: false,
      activeBackgroundColor: '#32A7BE',
      inactiveBackgroundColor: '#32A7BE',
      activeTintColor: 'white',
      inactiveTintColor: '#C0C0C0',
    },
  }
);
