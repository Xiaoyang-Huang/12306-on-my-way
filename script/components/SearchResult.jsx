var React = require('react');
var ReactRedux = require('react-redux');

var actions = require('../actions/index.js');

var lastResult = null;
module.exports = ReactRedux.connect(function (store) {
  return {
    trains: store.trains || [],
    search: store.searchData,
    result: store.searchResult
  }
}, function (dispatch) {
  return {
    cancelSearch: function () { dispatch(actions.cancelSearch()) },
    openOrderWindow: function(secretStr, origin, destination){ dispatch(actions.openOrderWindow(secretStr, origin, destination)) }
  }
})(React.createClass({
  getInitialState: function () {
    return {
      result: [],
      showAll: false
    }
  },
  componentWillReceiveProps: function (nextProps) {
    if (nextProps.result && nextProps.result != lastResult) {
      var target = nextProps.result
      var found = this.state.result.find(function (o) {
        return o.origin.code == target.origin.code && o.destination.code == target.destination && o.train.queryLeftNewDTO.train_no == target.train.queryLeftNewDTO.train_no
      })
      if (found) {
        found.train = nextProps.result.train;
      } else {
        this.state.result.push(nextProps.result);
      }
      lastResult = nextProps.result;
    }
  },
  buildList: function () {
    var content = [];
    var currentOrigin = {}, currentDestination = {};
    this.state.result.forEach(function (o, i) {
      var train = o.train;
      var self_train = this.props.trains.find(function (o) {
        return o.queryLeftNewDTO.train_no == train.queryLeftNewDTO.train_no;
      })
      if (this.state.showAll || train.queryLeftNewDTO.canWebBuy == 'Y') {
        if (o.origin.code != currentOrigin.code || o.destination.code != currentDestination.code) {
          content.push(<tr className="path" key={i + ".path"}><td colSpan="16">{o.origin.name} - {o.destination.name}</td></tr>);
          currentOrigin = o.origin;
          currentDestination = o.destination;
        }
        content.push(
          <tr key={i}>
            <td>{train.queryLeftNewDTO.station_train_code}</td>
            <td>
              {train.queryLeftNewDTO.start_time}
              <br />
              {(Number.parseInt(train.queryLeftNewDTO.day_difference) > 0 ? train.queryLeftNewDTO.day_difference + "+" : "") + train.queryLeftNewDTO.arrive_time}
              <br />
              {train.queryLeftNewDTO.lishi}
            </td>
            <td>
              {self_train.queryLeftNewDTO.start_time}
              <br />
              {(Number.parseInt(self_train.queryLeftNewDTO.day_difference) > 0 ? self_train.queryLeftNewDTO.day_difference + "+" : "") + self_train.queryLeftNewDTO.arrive_time}
              <br />
              {self_train.queryLeftNewDTO.lishi}
            </td>
            <td>{train.queryLeftNewDTO.swz_num}</td>
            <td>{train.queryLeftNewDTO.tz_num}</td>
            <td>{train.queryLeftNewDTO.zy_num}</td>
            <td>{train.queryLeftNewDTO.ze_num}</td>
            <td>{train.queryLeftNewDTO.gr_num}</td>
            <td>{train.queryLeftNewDTO.rw_num}</td>
            <td>{train.queryLeftNewDTO.yw_num}</td>
            <td>{train.queryLeftNewDTO.rz_num}</td>
            <td>{train.queryLeftNewDTO.yz_num}</td>
            <td>{train.queryLeftNewDTO.wz_num}</td>
            <td>{train.queryLeftNewDTO.qt_num}</td>
            <td><button className="submit" onClick={this.props.openOrderWindow.bind(this, train.secretStr, o.origin.name, o.destination.name)}>购买</button></td>
          </tr>
        )
      }
    }.bind(this))
    return content;
  },
  changeShowAll: function (evt) {
    var target = evt.target;
    this.setState({
      showAll: !target.checked
    })
  },
  closeResult: function () {
    this.setState({
      result: []
    })
  },
  render: function () {
    if (this.props.search && this.props.search.length || this.state.result.length) {
      return (
        <div className="result-mask">
          <div className="result">
            <div className="train-list-wrap">
              <table className="train-list">
                <thead>
                  <tr className="function">
                    <th colSpan="3">只显示有票车次<input type="checkbox" checked={this.state.showAll ? "" : "checked"} onChange={this.changeShowAll} /></th>
                    <th colSpan="11"></th>
                    <th>{(this.props.search && this.props.search.length) ? <p>正在查询</p> : <button className="submit" onClick={this.closeResult}>关闭</button>}</th>
                  </tr>
                  <tr>
                    <th>车次</th>
                    <th>起止时间</th>
                    <th>乘坐时间</th>
                    <th>商务座</th>
                    <th>特等座</th>
                    <th>一等座</th>
                    <th>二等座</th>
                    <th>高级软卧</th>
                    <th>软卧</th>
                    <th>硬卧</th>
                    <th>软座</th>
                    <th>硬座</th>
                    <th>无座</th>
                    <th>其他</th>
                    <th>购票链接</th>
                  </tr>
                </thead>
                <tbody>
                  {this.buildList()}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )
    } else {
      return false;
    }
  }
}))