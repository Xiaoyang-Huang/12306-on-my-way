var React = require('react');
var ReactRedux = require('react-redux');

var actions = require('../actions/index.js');

var moment = require('moment');
var DatePicker = require('react-datepicker');


module.exports = ReactRedux.connect(null, function(dispatch){
  return {
    setDepartureTime: function(value){ dispatch(actions.setDepartureTime(value))}
  }
})(React.createClass({
  getInitialState: function () {
    var date = moment();
    this.props.setDepartureTime(date);
    return {
      value: date
    }
  },
  onChange: function (date) {
    this.props.setDepartureTime(date);
    this.setState({
      value: date
    });
  },
  render: function () {
    return <DatePicker
      selected={this.state.value}
      onChange={this.onChange} />
  }
}))