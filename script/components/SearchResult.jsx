var React = require('react');
var ReactRedux = require('react-redux');

var actions = require('../actions/index.js');


module.exports = ReactRedux.connect(function(store){
  return {
    search: store.searchData,
    result: store.searchResult
  }
})(React.createClass({
  render: function () {
    if(this.props.search && this.props.search.length){
      return (
        <div className="result">

        </div>
      )
    }else{
      return false;
    }
  }
}))