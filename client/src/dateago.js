import React, { Component } from 'react';
import moment from 'moment';
import Moment from 'react-moment';


class DateAgo extends Component {
    /* parsing date function */
    parseDate() {
        const a = moment(new Date(this.props.date));
        const b = moment(new Date());
        const diffDays = Math.round(b.diff(a, 'days', true));
        
        // return full date if date is > a week or return a relative time if date < a week
        if (diffDays > 7) {
            return <Moment format="DD/MM/YY">{ this.props.date }</Moment>;
        }
        else {
            return (
                <span>
                    <Moment fromNow ago>{ this.props.date }</Moment> ago
                </span>
            );
        }
    }

    render() {
        return (
            <div className={ this.props.className }>
                Date: { this.parseDate() }
            </div>
        );
    }
}


export default DateAgo;
