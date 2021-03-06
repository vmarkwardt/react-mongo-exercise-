import React, { Component } from 'react';
import {
  getCards,
  postCards,
  getLocal,
  setLocal,
  patchCard,
  deleteCard,
} from './services';
import CardList from './components/CardList';
import { Form } from './components/Form';

export default class App extends Component {
  state = {
    cards: getLocal('cards') || [],
  };

  componentDidMount() {
    this.getCardsUpdateStateLS();
  }

  componentDidUpdate(prevProps, prevState) {
    const { cards } = this.state;
    if (prevState.cards !== cards) {
      setLocal('cards', cards);
    }
  }

  getCardsUpdateStateLS() {
    getCards()
      .then((data) => {
        this.setState({ cards: data });
        setLocal('cards', this.state.cards);
      })
      .catch((error) => console.log(error));

    setLocal('cards', this.state.cards);
  }

  render() {
    const { cards } = this.state;
    //console.log(JSON.stringify(cards));
    return (
      <main>
        <h1>gfK Workshops</h1>
        <Form onSubmit={this.handleSubmit} />
        <CardList
          cardList={cards}
          bookmarkOnClick={this.handleUpdateCard}
          editOnClick={this.handleEditOnClick}
          deleteOnClick={this.handleDeleteCard}
        />
      </main>
    );
  }

  handleSubmit = ({ newCard }) => {
    postCards(newCard)
      .then((newCard) => {
        this.setState({
          cards: [newCard, ...this.state.cards],
        });
        setLocal('cards', this.state.cards);
      })
      .catch((error) => console.log(error));
  };

  handleEditOnClick = (card) => {
    console.log('tja, wie kann ich nun auf das frm zugreifen?');
  };

  handleUpdateCard = (card) => {
    this.updateState(card);
    patchCard(card)  
      .then((card) => console.log('updatedCard: ', card))
      .catch((error) => console.log('Error at update card: ', error));
  };

  handleDeleteCard = (_id) => {
    deleteCard(_id)
      .then((data) => this.getCardsUpdateStateLS())
      .catch((error) => console.log('Error at update card: ', error));
  };

  updateState = (card) => {
    const cardsCopy = [...this.state.cards];
    const index = cardsCopy.map((item) => item._id).indexOf(card._id);
    cardsCopy[index] = card;
    this.setState({ cards: cardsCopy });
    setLocal('cards', cardsCopy);
  };
}
