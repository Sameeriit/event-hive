import React from 'react';
import { StyleSheet, Text, TextInput, View, Button, ScrollView} from 'react-native';
import { FirebaseWrapper } from '../firebase/firebase';
import * as firebase from 'firebase';
import 'firebase/firestore';
// import console = require('console');

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      feed: []
    }
  }

  async componentDidMount(){
    try {
      //change reference to user once we get Oauth done
      //Upcoming Events for User
      const userInfo = await FirebaseWrapper.GetInstance().GetEvents('User', 'YNeFkzY2FL0XBeLRwOfw')
      const eventsArray = await userInfo.data()
      const eventsInfo = await eventsArray.events.map(async function(event) {
        const eventCollection = await FirebaseWrapper.GetInstance().GetEvents('Event', event)
        return eventCollection.data()
      })

      const interestFeed = await eventsArray.interests.map(async function (interest) {
        const interestArray = []
        const interestCollection = await FirebaseWrapper.GetInstance().GetInterestEvents(interest)
        interestCollection.forEach(async event => {
          interestArray.push(await event.data())
        })
        return interestArray
      })

      const fevents = await Promise.all(interestFeed)
      const ffevents = fevents.flat().sort(function(event, event2) {
        if (event.start < event2.start){return -1}
        if (event.start > event2.start){return 1}

        return 0;
      })
      const events = await Promise.all(eventsInfo)
      const eventsSorted = events.sort(function(event, event2) {
        if (event.start < event2.start){return -1}
        if (event.start > event2.start){return 1}

        return 0;
      })

      this.setState({events: eventsSorted, feed: ffevents})
    } catch (error) {
        console.log(error);
      }
  }

  render() {
    return (
      <View>
      <View>
        <Text style = {{fontWeight: "bold", fontSize: 20}}>Today's Events</Text>
        <ScrollView>
        {this.state.events.length > 0 ? this.state.events.map(event => { return(
          <View key = {event.id}>
          <Text>{event.name}</Text>
          <Text>{event.start}</Text>
          <Text> </Text>
          </View>)
        }): <Text>(no upcoming events)</Text> }
        </ScrollView>
      </View>
      <View>
      <Text style = {{fontWeight: "bold", fontSize: 20}}>Event Feed</Text>
      <ScrollView>
      {this.state.feed.length > 0 ? this.state.feed.map(event => { return(
        <View key = {event.id}>
        <Text>{event.name}</Text>
        <Text>{event.start}</Text>
        <Text> </Text>
        </View>)
      }): <Text>(no upcoming events)</Text> }
        </ScrollView>
      </View>
      </View>
    );
  }
}
