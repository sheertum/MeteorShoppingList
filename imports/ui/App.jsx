import ReactDOM from 'react-dom';
import React from 'react';

import { withTracker } from 'meteor/react-meteor-data';
import { Items } from '../api/items.js';
import { Component } from 'react';
import { Meteor } from 'meteor/meteor';

import Item from './Item.js';
import AccountsUIWrapper from './AccountsUIWrapper.js';

class App extends Component{
  constructor(props) {
    super(props);
    this.state ={
      textInput: '',
      itemChecker: '',
      isPrivate: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const value = event.target.value;
    this.setState({[event.target.name]: value});
  }

  handleCheckboxChange(event) {
    const value = event.target.checked;
    this.setState({[event.target.name]: value});
  }

  handleSubmit(event) {
    const text = this.state.textInput;
    const isPrivate = this.state.isPrivate;
    event.preventDefault();
    Items.insert({
      text,
      isPrivate,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username, 
    });
    
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
    ReactDOM.findDOMNode(this.refs.isPrivate).checked = false;
  }
  
  renderItems() {
    let filteredItems = this.getPublicItems();
    return filteredItems.map((item) => (
      <Item key={item._id} item={item} />
    ));
  }

  getPublicItems() {
    return this.props.items.filter(item => !item.isPrivate);
  }

  renderPrivateItems() {
    let filteredItems = this.getPrivateItems();
    return filteredItems.map((item) => (
      <Item key={item._id} item={item} />
    ));
  }

  getPrivateItems() {
    return this.props.items.filter(item => item.isPrivate && item.owner == Meteor.userId());
  }

  render() {
    return (
      <div className='container'>
        <header>
          <h1>Shoppinglist</h1>
          <AccountsUIWrapper />
          { this.props.currentUser ?
            <form className="newItem" onSubmit={this.handleSubmit}>
              <input
                type="text"
                ref="textInput"
                name="textInput"
                placeholder="Add an item to the shoppinglist"
                onChange={this.handleChange}
              />
              <input
                type="checkbox"
                ref="isPrivate"
                name="isPrivate"
                onChange={this.handleCheckboxChange}
              />
              <input
                type="combobox"
                ref="assignee"
                name="assignee"
              />
            </form> : ''
          }

        </header>
        <ul>
          {this.renderItems()}
        </ul>
        <br />
        <h1>Private items</h1>
        <ul>
          {this.renderPrivateItems()}
        </ul>
      </div>
    )
  }
}

export default withTracker(() => {
  return {
    items: Items.find({}).fetch(),
    currentUser: Meteor.user(),
  };
})(App);