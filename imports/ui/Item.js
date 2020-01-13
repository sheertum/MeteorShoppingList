import React from 'react';
import { Component } from 'react';
import { Items } from '../api/items.js';


export default class Item extends Component {
    render() {
        return (
        <li> 
            <button className='delete' onClick={ this.deleteItem.bind(this)}>
            &times;
            </button>
            {this.props.item.text}
        </li>
        );
    }

    deleteItem() {
        Items.remove(this.props.item._id);
    }
}