import React, { Component } from 'react';
import Loading from 'react-loading';
import './loader.css';


class Loader extends Component {
    render() {
        return (
            <Loading className="loader-container" type={ this.props.type } color={ this.props.color } height="150px" width="150px" />
        );
    }
}


export default Loader;
