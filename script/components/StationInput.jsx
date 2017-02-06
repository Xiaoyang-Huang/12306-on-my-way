var React = require('react');
var ReactRedux = require('react-redux');

var actions = require('../actions/index.js');

var Autosuggest = require('react-autosuggest');

module.exports = ReactRedux.connect(function (store, props) {
  return {
    stations: store.stations
  };
}, function (dispatch) {
  return {
    setOrigin: function (value) { dispatch(actions.setOrigin(value)) },
    setDestination: function (value) { dispatch(actions.setDestination(value)) }
  }
})(React.createClass({
  getInitialState: function () {
    return {
      value: "",
      suggestions: []
    }
  },
  onChange: function (evt, obj) {
    this.setState({
      value: obj.newValue
    })
  },
  onKeyDown: function (evt, obj) {
    if (evt.which == 13) {
      if (this.state.suggestions.length) {
        var station = this.state.suggestions[0];
        this.setStation(station);
        this.setState({
          value: station.name
        })
      } else {
        this.setState({value: ""});
      }
    }
  },
  getSuggestions: function (input) {
    var inputValue = input.value;
    var searchPinyin = /[a-zA-Z]/.test(inputValue);
    return this.props.stations.filter(function (o) {
      var searchIndex = 0;
      var searchString = searchPinyin ? o.pinyin : o.name;
      if (searchString[0] != inputValue[0]) return false;
      for (var i = 0, il = inputValue.length; i < il; i++) {
        var item = inputValue[i];
        if (!~searchString.indexOf(item, searchIndex)) {
          return false;
        } else {
          searchIndex++;
          if (searchIndex == searchString.length || searchIndex == inputValue.length) {
            return true;
          }
        }
      }
    })
  },
  onSuggestionsFetchRequested: function (value) {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  },
  onSuggestionsClearRequested: function () {
  },
  getSuggestionValue: function (station) {
    this.setStation(station);
    return station.name;
  },
  setStation: function (station) {
    switch (this.props.type) {
      case "origin":
        this.props.setOrigin(station);
        break;
      case "destination":
        this.props.setDestination(station);
        break;
    }
  },
  renderSuggestion: function (station) {
    return <div>{station.name}</div>
  },
  render: function () {
    if (!this.props.stations) return null;
    return (
      <Autosuggest
        suggestions={this.state.suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        inputProps={{
          value: this.state.value,
          onChange: this.onChange,
          onKeyDown: this.onKeyDown
        }} />
    )
  }
}))