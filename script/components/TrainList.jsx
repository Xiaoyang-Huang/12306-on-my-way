var React = require('react');
var ReactRedux = require('react-redux');

var actions = require('../actions/index.js');

module.exports = ReactRedux.connect(function(store){
  return {
    trains: store.trains || []
  }
})(React.createClass({
  selectTrain: function(evt){
    var target = evt.target;
    var data = target.getAttribute('data-train');
    console.log(target.checked, data)
  },
  selectSeat: function(evt){
    var target = evt.target;
    var data = target.getAttribute('data-seat');
    console.log(target.checked, data)
  },
  buildRows: function(){
    return this.props.trains.map(function(o, i){
      return (
        <tr key={i}>
          <td>{o.queryLeftNewDTO.station_train_code}</td>
          <td>{o.queryLeftNewDTO.start_station_name}</td>
          <td>{o.queryLeftNewDTO.to_station_name}</td>
          <td>{o.queryLeftNewDTO.canWebBuy == 'N' ? '不可购' : '可购'}</td>
          <td>{o.queryLeftNewDTO.swz_num}</td>
          <td>{o.queryLeftNewDTO.tz_num}</td>
          <td>{o.queryLeftNewDTO.zy_num}</td>
          <td>{o.queryLeftNewDTO.ze_num}</td>
          <td>{o.queryLeftNewDTO.gr_num}</td>
          <td>{o.queryLeftNewDTO.rw_num}</td>
          <td>{o.queryLeftNewDTO.yw_num}</td>
          <td>{o.queryLeftNewDTO.rz_num}</td>
          <td>{o.queryLeftNewDTO.yz_num}</td>
          <td>{o.queryLeftNewDTO.wz_num}</td>
          <td>{o.queryLeftNewDTO.qt_num}</td>
          <td>
            <input checked="checked" data-train={o.queryLeftNewDTO.station_train_code} type="checkbox" onClick={this.selectTrain} />
          </td>
        </tr>
      )
    }.bind(this))
  },
  render: function(){
    if(this.props.trains.length){
      return (
      <table>
        <thead>
          <tr>
            <th>车次</th>
            <th>始发站</th>
            <th>终点站</th>
            <th>状态</th>
            <th>商务座<input checked="checked" data-seat="swz_num" type="checkbox" onClick={this.selectSeat} /></th>
            <th>特等座<input checked="checked" data-seat="tz_num" type="checkbox" onClick={this.selectSeat} /></th>
            <th>一等座<input checked="checked" data-seat="zy_num" type="checkbox" onClick={this.selectSeat} /></th>
            <th>二等座<input checked="checked" data-seat="ze_num" type="checkbox" onClick={this.selectSeat} /></th>
            <th>高级软卧<input checked="checked" data-seat="gr_num" type="checkbox" onClick={this.selectSeat} /></th>
            <th>软卧<input checked="checked" data-seat="rw_num" type="checkbox" onClick={this.selectSeat} /></th>
            <th>硬卧<input checked="checked" data-seat="yw_num" type="checkbox" onClick={this.selectSeat} /></th>
            <th>软座<input checked="checked" data-seat="rz_num" type="checkbox" onClick={this.selectSeat} /></th>
            <th>硬座<input checked="checked" data-seat="yz_num" type="checkbox" onClick={this.selectSeat} /></th>
            <th>无座<input checked="checked" data-seat="wz_num" type="checkbox" onClick={this.selectSeat} /></th>
            <th>其他<input checked="checked" data-seat="qt_num" type="checkbox" onClick={this.selectSeat} /></th>
            <th>查询该列</th>
          </tr>
        </thead>
        <tbody>
          {this.buildRows()}
        </tbody>
      </table>
      )
    }else{
      return null;
    }
  }
}))