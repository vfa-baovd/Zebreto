//base
import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Navigator
} from 'react-native';
import {connect} from 'react-redux';

import {cardActions, deckActions} from './../actions';

//components
import Heading from './Header';
import Decks from './Decks';
import NewCard from './NewCard';
import Review from './Review';

class Zebreto extends Component {
  static displayName = 'Zebreto';

  componentWillMount() {
    this.props.dispatch(deckActions.fetchDecks());
    this.props.dispatch(cardActions.fetchCards());
  }

  _review = (deckID) => {
    this.props.dispatch(cardActions.reviewCards(deckID));
    this.refs.navigator.push({
      name: 'reviewCards',
      data: {
        deckID: deckID
      }
    });
  };

  _createdCard = (deck) => {
    this.refs.navigator.push({
      name: 'createCards',
      data: {
        deck: deck
      }
    });
  };

  _goHome = () => {
    this.refs.navigator.popToTop();
  };

  _deleteAll = () => {
    this.props.dispatch(deckActions.deleteAllDecks());
    this.props.dispatch(cardActions.deleteAllCards());
  };

  _renderScene = (route, navigator) => {
    switch (route.name) {
      case 'decks': {
        return (
          <View>
            <Decks createCard={this._createdCard}
                   review={this._review}
            />
          </View>

        );
      }
      case 'createCards': {
        return <NewCard
          review={this._review}
          quit={this._goHome}
          nextCard={this._createdCard}
          {...route.data}/>;
      }
      case 'reviewCards': {
        return <Review quit={this._goHome} {...route.data} />;
      }
      default:
        console.error('Encountered unexpected route: ' + route.name);
    }
  };

  render() {
    let defaultName = 'decks';
    return (
      <View style={styles.container}>
        <Heading/>
        <Navigator
          ref='navigator'
          initialRoute={{name: defaultName}}
          renderScene={this._renderScene}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30
  }
});

export default connect(store => {
  return store;
})(Zebreto);