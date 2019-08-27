import React from 'react';
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import { ListItem, Divider, Icon } from 'react-native-elements';
import * as firebase from 'firebase';
import { Constands } from 'expo';
import { FirebaseWrapper } from '../firebase/firebase';

export default class UserProfileScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      events: [],
    };
  }

  _getUserInfo = async () => {
    const user = firebase.auth().currentUser;

    const userInfo = async () => {
      const userData = await FirebaseWrapper.GetInstance().GetEvents(
        'User',
        user.uid
      );
      return userData;
    };

    const userData = await userInfo();
    this.setState({
      ...this.state,
      user: userData.data(),
    });
  };

  _getUserEvents = async () => {
    if (Object.keys(this.state.user) !== 0) {
      const userEvents = this.state.user.events.map(async event => {
        await FirebaseWrapper.GetInstance().GetEvents('Event', event);
      });

      this.setState({
        ...this.state,
        event: userEvents,
      });
    }
  };

  componentDidMount = async () => {
    await this._getUserInfo();
    await this._getUserEvents();
  };

  render() {
    const { navigate } = this.props.navigation;
    return (
      // <View style={styles.container}>
      //   <Image
      //     source={{ uri: this.state.user.profile_picture }}
      //     style={styles.image}
      //   />
      <ScrollView style={styles.event}>
        {this.state.events.map(event => {
          console.log(event);
          return (
            <View key={event.id} style={styles.listItemParent}>
              <Divider style={styles.divider} />
              <ListItem
                style={styles.listItem}
                leftAvatar={{ source: { uri: event.imageUrl } }}
                title={event.name}
                subtitle={event.start}
                onPress={() =>
                  navigate('SingleEventScreen', {
                    eventId: event.id,
                    imgUrl: event.imageUrl,
                    eventName: event.name,
                    description: event.description,
                  })
                }
              />
            </View>
          );
        })}
      </ScrollView>
      // </View>
    );
  }
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {},
  image: {
    height: 200,
    width,
  },
  listItem: {
    paddingTop: 5,
    paddingBottom: 5,
  },
  divider: {
    backgroundColor: 'grey',
    height: 10,
    flex: 1,
  },
  listItemParent: {
    borderStyle: 'solid',
    borderColor: 'grey',
  },
});
