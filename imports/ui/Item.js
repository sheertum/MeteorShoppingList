import React from 'react';
import { Component } from 'react';
import { Items } from '../api/items.js';


export default class Item extends Component {
    render() {
        const itemClassName = this.props.item.checked ? 'checked' : '';
        return (
        <li className={itemClassName}> 
            <button className='delete' onClick={ this.deleteItem.bind(this)}>
            &times;
            </button>
            <input
                type="checkbox"
                readOnly
                checked={!!this.props.item.checked}
                onClick={this.toggleChecked.bind(this)}
            />
            <span className="text">{this.props.item.text}</span>
            <br />  
            <b>{this.props.item.username}</b>
        </li>
        );
    }

    toggleChecked() {
        Items.update(this.props.item._id, {
            $set: { checked: !this.props.item.checked },
        });
    }

    deleteItem() {
        Items.remove(this.props.item._id);
    }
}