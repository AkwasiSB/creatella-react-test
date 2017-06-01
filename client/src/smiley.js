import React, { Component } from 'react';
import './smiley.css';
import DateAgo from './dateago';


class Smiley extends Component {
    render() {
        return (
            <div className="smiley-container">
                <div className="smiley-facebox" style={{ fontSize: this.props.product.size }}>
                    <span className="smiley-face">{ this.props.product.face }</span>
                </div>

                <div className="smiley-databox">
                    <div>
                        <span className="smiley-size">Size: { this.props.product.size }px</span>
                        <span className="smiley-price">Price: ${ this.props.product.price }</span>
                    </div>

                    <DateAgo className="smiley-date" date={ this.props.product.date } />
                </div>
            </div>
        );
    }
}


export default Smiley;
