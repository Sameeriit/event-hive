import React from "react";
import { ListItem, FlatList, Divider } from "react-native-elements";
import Modal from "react-native-modal";

import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  ScrollView,
  Image,
  Dimensions,
  TouchableHighlight
} from "react-native";
import { Constants } from "expo";
import { FirebaseWrapper } from "../firebase/firebase";
import * as firebase from "firebase";
import "firebase/firestore";
import SingleEventScreen from "../screens/SingleEventScreen";

const { width } = Dimensions.get("window");
const imageHeight = width * 0.3;
const height = width * 0.5;
export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      feed: []
    };
  }

  async componentDidMount() {
    const user = firebase.auth().currentUser;
    // console.log("this is the user id>>>>>>>>>", user.uid);
    try {
      //User information fetched from firebase, including upcomign events & interests(change line 30 to user once OAuth done)
      const userInfo = await FirebaseWrapper.GetInstance().GetEvents(
        "User",
        user.uid
      );
      //Formats the information from userInfo (events/interests/etc.)
      const eventsArray = await userInfo.data();
      //Map through the events array in User and fetching event info from Events collection & formatting the data
      const eventsInfo = await eventsArray.events.map(async function(event) {
        const eventCollection = await FirebaseWrapper.GetInstance().GetEvents(
          "Event",
          event
        );
        return eventCollection.data();
      });
      //Map through interest array, and find events in Events collection that match interest code. Returns an array of arrays (each array is for each interest code)
      const interestFeed = await eventsArray.interests.map(async function(
        interest
      ) {
        const interestArray = [];
        const interestCollection = await FirebaseWrapper.GetInstance().GetInterestEvents(
          interest
        );
        //Push events found into an array after formatting the data.
        interestCollection.forEach(async event => {
          interestArray.push(await event.data());
        });
        //Return array of events
        return interestArray;
      });

      //Consolidate all the interest event promises returned from above.
      const fevents = await Promise.all(interestFeed);
      //Flatten the array of events arrays into an array of event objects for all interests, and sort them based on the date & time.
      const ffevents = fevents.flat().sort(function(event, event2) {
        if (event.start < event2.start) {
          return -1;
        }
        if (event.start > event2.start) {
          return 1;
        }

        return 0;
      });
      //Consolidate all the upcomign event promises returned from above.
      const events = await Promise.all(eventsInfo);
      //Sort through array of event objects by start date/time
      const eventsSorted = events.sort(function(event, event2) {
        if (event.start < event2.start) {
          return -1;
        }
        if (event.start > event2.start) {
          return 1;
        }

        return 0;
      });
      //Set the upcoming events state & interest feed state
      this.setState({ events: eventsSorted, feed: ffevents });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    //Get most recent date, and format it into date that can be compared with firebase dates
    const { navigate } = this.props.navigation;
    const newDate = new Date();
    const date = newDate.toISOString();
    return (
      // turn into flatlist - https://react-native-training.github.io/react-native-elements/docs/listitem.html
      <View style={{ padding: 10 }}>
        <View>
          <Text style={{ fontWeight: "bold", fontSize: 20 }}>
            Today's Events
          </Text>
          <ScrollView
            sytle={styles.subscribed}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
          >
            {this.state.events.length > 0 ? (
              this.state.events.map(event => {
                if (event.end > date) {
                  return (
                    <View key={event.id} style={styles.carousel}>
                      <Image
                        source={{ uri: event.imageUrl }}
                        style={{ height: imageHeight, width }}
                      />
                      <Text style={styles.eventName}>{event.name}</Text>
                      <Text style={styles.eventTime}>{event.start}</Text>
                    </View>
                  );
                }
              })
            ) : (
              <Text>(no upcoming events)</Text>
            )}
          </ScrollView>
        </View>
        <View style={{ paddingBottom: 300 }}>
          <Text style={{ fontWeight: "bold", fontSize: 20 }}>Event Feed</Text>
          <ScrollView style={styles.interested}>
            {this.state.feed.length > 0 ? (
              this.state.feed.map(event => {
                if (event.end > date) {
                  return (
                    <View key={event.id} style={styles.listItemParent}>
                      <Divider style={styles.divider} />
                      <ListItem
                        style={styles.listItem}
                        key={event.id}
                        leftAvatar={{ source: { uri: event.imageUrl } }}
                        title={event.name}
                        subtitle={event.start}
                        onPress={() =>
                          navigate("SingleEventScreen", {
                            eventId: event.id,
                            imgUrl: event.imageUrl,
                            eventName: event.name,
                            description: event.description
                          })
                        }
                      />
                      <View />
                    </View>
                  );
                }
              })
            ) : (
              <Text>(no upcoming events)</Text>
            )}
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  listItem: {
    paddingTop: 5,
    paddingBottom: 5
  },
  listItemParent: {
    borderStyle: "solid",
    borderColor: "grey"
  },
  divder: {
    backgroundColor: "grey",
    height: 10,
    flex: 1
  },
  interested: {},
  subscribed: {
    height,
    width
  },
  carousel: {
    height,
    width
  },
  eventName: {
    fontSize: 14,
    fontWeight: "bold"
  }
});

// HomeScreen.navigationOptions = {
//   header: null
// };
