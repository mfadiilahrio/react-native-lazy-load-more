//This is an example of React Native
//FlatList Pagination to Load More Data dynamically - Infinite List
import React, {Component} from 'react';
//import react in our code.
import Database from './Database';

const db = new Database();

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
//import all the components we are going to use.

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      //Loading state used while loading the data for the first time
      serverData: [],
      //Data Source for the FlatList
      fetching_from_server: false,
      //Loading state used while loading more data
    };
    this.offset = 1;
    //Index of the offset to load from web API
  }

  componentDidMount() {
    this.getUsers();

    fetch('https://aboutreact.herokuapp.com/getpost.php?offset=' + this.offset)
      //Sending the currect offset with get request
      .then(response => response.json())
      .then(responseJson => {
        //Successful response from the API Call
        this.offset = this.offset + 1;
        //After the response increasing the offset for the next API call.
        this.setState({
          serverData: [...this.state.serverData, ...responseJson.results],
          //adding the new data with old one available in Data Source of the List
          loading: false,
          //updating the loading state to false
        });
        db.addUsers(responseJson.results);
      })
      .catch(error => {
        console.error(error);
      });
  }

  getUsers() {
    let users = [];
    db.listUser()
      .then(data => {
        users = data;
        console.log('THIS IS USERS', users);
        this.setState({
          users,
          isLoading: false,
        });
      })
      .catch(err => {
        console.log(err);
        this.setState = {
          isLoading: false,
        };
      });
  }

  loadMoreData = () => {
    //On click of Load More button We will call the web API again
    this.setState({fetching_from_server: true}, () => {
      fetch(
        'https://aboutreact.herokuapp.com/getpost.php?offset=' + this.offset,
      )
        //Sending the currect offset with get request
        .then(response => response.json())
        .then(responseJson => {
          //Successful response from the API Call
          this.offset = this.offset + 1;
          //After the response increasing the offset for the next API call.
          this.setState({
            serverData: [...this.state.serverData, ...responseJson.results],
            //adding the new data with old one available
            fetching_from_server: false,
            //updating the loading state to false
          });
          db.addUsers(responseJson.results);
        })
        .catch(error => {
          console.error(error);
        });
    });
  };

  renderFooter() {
    return (
      //Footer View with Load More button
      <ActivityIndicator color="red" style={{marginLeft: 8}} />
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <FlatList
            onEndReached={this.loadMoreData}
            onEndReachedThreshold={0.7}
            style={{width: '100%'}}
            keyExtractor={(item, index) => index}
            data={this.state.serverData}
            renderItem={({item, index}) => (
              <View style={styles.item}>
                <Text style={styles.text}>
                  {index}
                  {'.'}
                  {' (' + item.id + ') ' + item.title.toUpperCase()}
                </Text>
              </View>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListFooterComponent={this.renderFooter.bind(this)}
            //Adding Load More button as footer component
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
  },
  item: {
    padding: 10,
  },
  separator: {
    height: 0.5,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  text: {
    fontSize: 15,
    color: 'black',
  },
  footer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  loadMoreBtn: {
    padding: 10,
    backgroundColor: '#800000',
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
  },
});
