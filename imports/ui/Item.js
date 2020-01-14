import React from 'react';
import { Component } from 'react';
import { Items } from '../api/items.js';
import { Meteor } from 'meteor/meteor';



export default class Item extends Component {
    render() {
        const itemClassName = this.props.item.checked ? 'checked' : '';
        return (
        <li className={itemClassName}> 
            <button className='delete' onClick={ this.deleteItem.bind(this)}>
            &times;
            </button>
            { Meteor.user() ?
                <input
                    type="checkbox"
                    readOnly
                    checked={!!this.props.item.checked}
                    onClick={this.toggleChecked.bind(this)}
                />
                : ''
            }
            <span className="text">
                {this.props.item.text} { this.props.item.checked ? this.props.item.checkedUser : '' }
                <i>Assigned to {this.props.item.assignee}</i>
            </span>
            <br />  
            <b>{this.props.item.username}</b>
        </li>
        );
    }

    toggleChecked() {
        Items.update(this.props.item._id, {
            $set: { checked: !this.props.item.checked },
        });
        if(this.props.item.checked) {
            Items.update(this.props.item._id, {
                $set: { checkedUser:  Meteor.user().username},
            });
        }

    }

    deleteItem() {
        Items.remove(this.props.item._id);
    }
}