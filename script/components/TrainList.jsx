var React = require('react');
var ReactRedux = require('react-redux');

var actions = require('../actions/index.js');

module.exports = ReactRedux.connect(function(store){
  return {
    trains: store.trains || [],
    selectedTrains: store.selectedTrains,
    selectedSeats: store.selectedSeats
  }
}, function(dispatch){
  return {
    setSearchSeat: function(value){dispatch(actions.setSearchSeat(value))},
    unsetSearchSeat: function(value){dispatch(actions.unsetSearchSeat(value))},
    setSearchTrain: function(value){dispatch(actions.setSearchTrain(value))},
    unsetSearchTrain: function(value){dispatch(actions.unsetSearchTrain(value))},
    startSearch: function(){dispatch(actions.startSearch())}
  }
})(React.createClass({
  selectTrain: function(evt, value){
    var target = evt.target;
    var data = target.getAttribute('data-train');
    data = this.props.trains.find(function(o){
      return o.queryLeftNewDTO.train_no == data;
    })
    if(data){
      // console.log(data, evt.target.checked, value)
      if(target.checked){
        this.props.setSearchTrain(data);
      }else{
        this.props.unsetSearchTrain(data);
      }
      this.forceUpdate();
    }
  },
  selectSeat: function(evt){
    var target = evt.target;
    var data = target.getAttribute('data-seat');
    if(target.checked){
      this.props.setSearchSeat(data);
    }else{
      this.props.unsetSearchSeat(data);
    }
    this.forceUpdate();
  },
  buildRows: function(){
    return this.props.trains.map(function(o, i){
      // console.log(o.queryLeftNewDTO.train_no, (~this.props.selectedTrains.indexOf(o.queryLeftNewDTO.train_no) ? "checked" : ""))
      return (
        <tr key={i}>
          <td>{o.queryLeftNewDTO.station_train_code}</td>
          <td>
            {o.queryLeftNewDTO.start_station_name}
            <br/>
            {o.queryLeftNewDTO.to_station_name}
          </td>
          <td>
            {o.queryLeftNewDTO.start_time}
            <br />
            {(Number.parseInt(o.queryLeftNewDTO.day_difference) > 0 ? o.queryLeftNewDTO.day_difference + "+" : "") + o.queryLeftNewDTO.arrive_time}
            <br/>
            {o.queryLeftNewDTO.lishi}
          </td>
          <td>{o.queryLeftNewDTO.canWebBuy == 'N' ? 'N' : 'Y'}</td>
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
            <input 
              checked={~this.props.selectedTrains.indexOf(o) ? "checked" : ""} 
              data-train={o.queryLeftNewDTO.train_no} 
              type="checkbox" 
              onChange={this.selectTrain} />
          </td>
        </tr>
      )
    }.bind(this))
  },
  render: function(){
    if(this.props.trains.length){
      return (
      <table className="train-list">
        <thead>
          <tr>
            <th>车次</th>
            <th>起止站点</th>
            <th>起止时间</th>
            <th>状态</th>
            <th>商务座<input checked={~this.props.selectedSeats.indexOf("swz_num") ? "checked" : ""}  data-seat="swz_num" type="checkbox" onChange={this.selectSeat} /></th>
            <th>特等座<input checked={~this.props.selectedSeats.indexOf("tz_num") ? "checked" : ""}  data-seat="tz_num" type="checkbox" onChange={this.selectSeat} /></th>
            <th>一等座<input checked={~this.props.selectedSeats.indexOf("zy_num") ? "checked" : ""}  data-seat="zy_num" type="checkbox" onChange={this.selectSeat} /></th>
            <th>二等座<input checked={~this.props.selectedSeats.indexOf("ze_num") ? "checked" : ""}  data-seat="ze_num" type="checkbox" onChange={this.selectSeat} /></th>
            <th>高级软卧<input checked={~this.props.selectedSeats.indexOf("gr_num") ? "checked" : ""}  data-seat="gr_num" type="checkbox" onChange={this.selectSeat} /></th>
            <th>软卧<input checked={~this.props.selectedSeats.indexOf("rw_num") ? "checked" : ""}  data-seat="rw_num" type="checkbox" onChange={this.selectSeat} /></th>
            <th>硬卧<input checked={~this.props.selectedSeats.indexOf("yw_num") ? "checked" : ""}  data-seat="yw_num" type="checkbox" onChange={this.selectSeat} /></th>
            <th>软座<input checked={~this.props.selectedSeats.indexOf("rz_num") ? "checked" : ""}  data-seat="rz_num" type="checkbox" onChange={this.selectSeat} /></th>
            <th>硬座<input checked={~this.props.selectedSeats.indexOf("yz_num") ? "checked" : ""}  data-seat="yz_num" type="checkbox" onChange={this.selectSeat} /></th>
            <th>无座<input checked={~this.props.selectedSeats.indexOf("wz_num") ? "checked" : ""}  data-seat="wz_num" type="checkbox" onChange={this.selectSeat} /></th>
            <th>其他<input checked={~this.props.selectedSeats.indexOf("qt_num") ? "checked" : ""}  data-seat="qt_num" type="checkbox" onChange={this.selectSeat} /></th>
            <th>查询该车</th>
          </tr>
        </thead>
        <tbody>
          {this.buildRows()}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="16"><button onClick={this.props.startSearch}>开始查票</button></td>
          </tr>
        </tfoot>
      </table>
      )
    }else{
      return null;
    }
  }
}))