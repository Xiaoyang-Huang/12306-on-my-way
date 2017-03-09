var React = require('react');
var ReactRedux = require('react-redux');

var actions = require('../actions/index.js');

var StationInput = require('./StationInput.jsx');
var DatePicker = require('./DatePicker.jsx');
var TrainList = require('./TrainList');
var SearchResult = require('./SearchResult.jsx');
var Error = require('./Error.jsx');

module.exports = ReactRedux.connect(function (store) {
  return {
    inited: store.inited
  }
}, function (dispatch) {
  return {
    getStations: function () { dispatch(actions.getStations()) },
    searchData: function () { dispatch(actions.searchData()) }
  }
})(React.createClass({
  componentDidMount: function () {
    this.props.getStations();
  },
  render: function () {
    var content;
    if (!this.props.inited) {
      content = (
        <div className="init">
          正在初始化
        </div>
      )
    } else {
      content = (
        <div className="main">
          <ul className="form">
            <li>
              <span>起始站:</span><StationInput type="origin" />
            </li>
            <li>
              <span>终点站:</span><StationInput type="destination" />
            </li>
            <li>
              <span>出发时间:</span><DatePicker />
            </li>
            <li>
              <button className="submit" onClick={this.props.searchData}>搜索</button>
            </li>
          </ul>
          <TrainList />
          <SearchResult />
        </div>
      )
    }

    return (
      <div>
        {content}
        <Error />
      </div>
    )
  }
}))