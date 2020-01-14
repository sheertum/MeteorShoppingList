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
      assignee: '',
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
    const assignee = this.state.assignee;
    event.preventDefault();
    Items.insert({
      text,
      isPrivate,
      assignee,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username, 
    });
    this.resetFormFieldsToDefault()
  }

  resetFormFieldsToDefault() {
    ReactDOM.findDOMNode(this.refs.textInput).value = "";
    ReactDOM.findDOMNode(this.refs.isPrivate).checked = false;
    ReactDOM.findDOMNode(this.refs.assignee).value = "";
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

  renderAssignees() {
    let candidates = Meteor.users.find().fetch();
    return candidates.map((candidate) => (
      <option key={candidate.username} value={candidate.username}>{candidate.username}</option>
    ))
  }

  render() {
    return (
      <div className='container'>
        <header>
          <h1>Shoppinglist</h1>
          <AccountsUIWrapper />
          { this.props.currentUser ?
            <form className="newItem" onSubmit={this.handleSubmit}>
              <label>Make a new item</label>
              <br />
              <input
                type="text"
                ref="textInput"
                name="textInput"
                placeholder="Add an item to the shoppinglist"
                onChange={ this.handleChange }
              />
              <label>Private:</label>
              <input
                type="checkbox"
                ref="isPrivate"
                name="isPrivate"
                onChange={ this.handleCheckboxChange }
              />
              <br />
              <label>Select a person to assign the new item to</label>
              <br />
              <select
                type="combobox"
                ref="assignee"
                name="assignee"
                onChange={ this.handleChange }
                defaultValue=""
              >
                <option value="" disabled>Select your option</option>
                {this.renderAssignees()}
              </select>
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