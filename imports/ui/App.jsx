import ReactDOM from 'react-dom';
import React from 'react';

import { withTracker } from 'meteor/react-meteor-data';
import { Items } from '../api/items.js';
import { Component } from 'react';

import Item from './Item.js';

class App extends Component{
  constructor(props) {
    super(props);
    this.state ={
      textInput: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const value = event.target.value;
    this.setState({[event.target.name]: value});
  }

  
  handleSubmit(event) {
    const text = this.state.textInput;
    event.preventDefault();
    Items.insert({
      text,
      createdAt: new Date(),
    });
    
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }
  
  renderItems() {
    return this.props.items.map((item) => (
      <Item key={item._id} item={item} />
    ));
  }

  render() {
    return (
      <div className='container'>
        <header>
          <h1>Shoppinglist</h1>
          <form className="newItem" onSubmit={this.handleSubmit}>
            <input
              type="text"
              ref="textInput"
              name="textInput"
              placeholder="Add an item to the shoppinglist"
              onChange={this.handleChange}
            />
          </form>

        </header>
        <ul>
          {this.renderItems()}
        </ul>
      </div>
    )
  }
}

export default withTracker(() => {
  return {
    items: Items.find({}).fetch(),
  };
})(App);