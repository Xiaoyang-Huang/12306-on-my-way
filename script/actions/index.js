var axios = require('axios');
var constant = require('../constant.js');

module.exports.getStations = function () {
  return function(dispatch, getState){
    axios.get(constant.api.INIT).then(function(data){
      var html = data.data;
      var CLeftTicketUrl = /var\sCLeftTicketUrl\s=\s\'(.*)\'/.exec(html);
      if(CLeftTicketUrl.length == 2){
        CLeftTicketUrl = CLeftTicketUrl[1];
        var global = global || window;
        global.CLeftTicketUrl = CLeftTicketUrl;
        // console.log("CLeftTicketUrl", CLeftTicketUrl)
        axios.get(constant.api.STATION).then(function(data){
          var stations = data.data.match(/@([^\|]+\|){5}\d+/g);
          var data = [];

          for (var i = 0, il = stations.length; i < il; i++) {
            var dataItems = stations[i].split('|');
            //@bjb|北京北|VAP|beijingbei|bjb|0
            data.push({
              name: dataItems[1],
              code: dataItems[2],
              pinyin: dataItems[3]
            })
          }

          dispatch({
            type: constant.actions.GET_STATION,
            data: data
          });
        }.bind(this))
      }else{
        console.error("can not found CLeftTicketUrl")
      }
    }.bind(this))
  }
}

module.exports.setOrigin = function (value) {
  return {
    type: constant.actions.SET_ORIGIN,
    data: value
  }
}

module.exports.setDestination = function (value) {
  return {
    type: constant.actions.SET_DESTINATION,
    data: value
  }
}

module.exports.setDepartureTime = function (value) {
  return {
    type: constant.actions.SET_DEPARTURE_TIME,
    data: value
  }
}

module.exports.searchData = function () {
  return function (dispatch, getState) {
    console.log("searchData", getState())
    var state = getState();
    if (!state.form.origin || !state.form.destination || !state.form.time) return;
    //disable chrome security check
    //"C:\Users\UserName\AppData\Local\Google\Chrome\Application\chrome.exe" --disable-web-security --user-data-dir
    //open -a "Google Chrome" --args --disable-web-security  --user-data-dir
    axios.get(constant.api.QUERY_ALL(state.form.origin.code, state.form.destination.code, state.form.time.format('YYYY-MM-DD')))
      .then(function (data) {
        dispatch(this.fillTable(data.data))
      }.bind(this), function () {
        console.log("??????????", arguments)
      })
  }.bind(this);
}

module.exports.fillTable = function (data) {
  console.log("get train data", data);
  // { 
  //   "queryLeftNewDTO": { 
  //     "train_no": "6c000G130206", 
  //     "station_train_code": "G1302", 
  //     "start_station_telecode": "IZQ", 
  //     "start_station_name": "广州南", 
  //     "end_station_telecode": "AOH", 
  //     "end_station_name": "上海虹桥", 
  //     "from_station_telecode": "HVQ", 
  //     "from_station_name": "衡阳东", 
  //     "to_station_telecode": "AOH", 
  //     "to_station_name": "上海虹桥", 
  //     "start_time": "13:30", 
  //     "arrive_time": "19:51", 
  //     "day_difference": "0", 
  //     "train_class_name": "", 
  //     "lishi": "06:21", 
  //     "canWebBuy": "N", 
  //     "lishiValue": "381", 
  //     "yp_info": "1TTzgiSp8yjQoKNO7cKClG%2BSD86iRpNeEVUqylXlyXI0mC0V", 
  //     "control_train_day": "20991231", 
  //     "start_train_date": "20170208", 
  //     "seat_feature": "O3M393", 
  //     "yp_ex": "O0M090", 
  //     "train_seat_feature": "3", 
  //     "seat_types": "OM9", 
  //     "location_code": "Q9", 
  //     "from_station_no": "04", 
  //     "to_station_no": "17", 
  //     "control_day": 29, 
  //     "sale_time": "1600", 
  //     "is_support_card": "0", 
  //     "controlled_train_flag": "0", 
  //     "controlled_train_message": "正常车次，不受控", 
  //     "train_type_code": "2", 
  //     "start_province_code": "16", 
  //     "start_city_code": "1502", 
  //     "end_province_code": "33", 
  //     "end_city_code": "0712", 
  //     "yz_num": "--", 
  //     "rz_num": "--", 
  //     "yw_num": "--", 
  //     "rw_num": "--", 
  //     "gr_num": "--", 
  //     "zy_num": "无", 
  //     "ze_num": "无", 
  //     "tz_num": "--", 
  //     "gg_num": "--", 
  //     "yb_num": "--", 
  //     "wz_num": "--", 
  //     "qt_num": "--", 
  //     "swz_num": "无" 
  //   },
  //   "secretStr": "", 
  //   "buttonTextInfo": "预订" 
  // }
  return {
    type: constant.actions.FILL_TABLE,
    data: data.data
  }
}

module.exports.setSearchSeat = function (value) {
  return {
    type: constant.actions.SET_SEARCH_SEAT,
    data: value
  }
}

module.exports.unsetSearchSeat = function (value) {
  return {
    type: constant.actions.UNSET_SEARCH_SEAT,
    data: value
  }
}

module.exports.setSearchTrain = function (value) {
  return {
    type: constant.actions.SET_SEARCH_TRAIN,
    data: value
  }
}

module.exports.unsetSearchTrain = function (value) {
  return {
    type: constant.actions.UNSET_SEARCH_TRAIN,
    data: value
  }
}

module.exports.startSearch = function () {
  return function (dispatch, getState) {
    var state = getState();
    var searchTrip = {};
    var requests = [];
    for (var i = 0, il = state.selectedTrains.length; i < il; i++) {
      var train = state.selectedTrains[i];
      requests.push((function (train) {
        return axios.get(constant.api.QUERY_TRAIN(train.queryLeftNewDTO.train_no, train.queryLeftNewDTO.start_station_telecode, train.queryLeftNewDTO.end_station_telecode, state.form.time.format('YYYY-MM-DD')))
          .then(function (data) {
            var stations = data.data.data.data;
            var startStationIndex = stations.findIndex(function (o) {
              return !o.station_name.indexOf(state.form.origin.name);
            })
            var endStationIndex = stations.findIndex(function (o) {
              return !o.station_name.indexOf(state.form.destination.name);
            })
            console.log(train.queryLeftNewDTO.station_train_code + "(" + train.queryLeftNewDTO.train_no + ")", startStationIndex, endStationIndex, stations.length)
            if (~startStationIndex && ~endStationIndex) {
              var wholeTrip = data.data.data[0];
              for (var j = 0, jl = startStationIndex + 1; j < jl; j++) {
                for (var k = endStationIndex, kl = stations.length; k < kl; k++) {
                  // {
                  //   arrive_time:"----"
                  //   isEnabled:true
                  //   start_time:"23:00"
                  //   station_name:"海口"
                  //   station_no:"01"
                  //   stopover_time:"----"
                  //   end_station_name:"上海南"   //only exist in first object
                  //   service_type:"1"           //only exist in first object
                  //   start_station_name:"海口"  //only exist in first object
                  //   station_train_code:"K512"  //only exist in first object
                  //   train_class_name:"快速"    //only exist in first object
                  // }
                  var startStation = stations[j];
                  //todo: if departure time was early than now, ignore this station.
                  var endStation = stations[k];
                  var key = startStation.station_name + "-" + endStation.station_name;
                  // console.log(key);
                  if (searchTrip[key]) {
                    searchTrip[key].push(train);
                  } else {
                    searchTrip[key] = [train];
                  }
                }
              }
            }
          })
      })(train))
    }
    axios.all(requests).then(function (data) {
      var searchData = [];
      for (var key in searchTrip) {
        var origin_station_name = key.split('-')[0];
        var destination_station_name = key.split('-')[1];
        var origin_station = state.stations.find(function (o) {
          return o.name == origin_station_name;
        });
        var destination_station = state.stations.find(function (o) {
          return o.name == destination_station_name;
        });
        searchData.push({
          origin: origin_station,
          destination: destination_station,
          trains: searchTrip[key]
        })
      }
      // console.log("startSearch", searchData);
      dispatch({
        type: constant.actions.START_SEARCH,
        data: searchData
      })
      dispatch(this.searchItem());
    }.bind(this))
  }.bind(this)
}

module.exports.searchItem = function () {
  return function (dispatch, getState) {
    var state = getState();
    var item = state.searchData.shift();
    var trainNumbers = item.trains.map(function(o){return o.queryLeftNewDTO.station_train_code;});
    var groupName = '正在查询 ' + item.origin.name + ' 到 ' + item.destination.name + ' 的列车(' + trainNumbers.join(',') + ')';
    console.group(groupName);
    axios.get(constant.api.QUERY_ALL(item.origin.code, item.destination.code, state.form.time.format('YYYY-MM-DD')))
      .then(function (data) {
        var trains = data.data.data;
        item.trains.map(function (o) {
          var train = trains.find(function (io) {
            return o.queryLeftNewDTO.train_no == io.queryLeftNewDTO.train_no;
          })
          if (train) {
            console.log("列车:", train.queryLeftNewDTO.station_train_code + "(" + train.queryLeftNewDTO.train_no + ")", (train.queryLeftNewDTO.canWebBuy == 'N' ? "无票" : "有票"));
          }
        })
        console.groupEnd(groupName);
        if (state.searchData.length > 0) {
          // setTimeout(function () {
            dispatch(this.searchItem());
          // }.bind(this), 0);
        } else {
          console.log("查询完毕");
        }
      }.bind(this), function (err) {
        console.error(err)
        dispatch(this.rollbackSearchItem(item));
        console.groupEnd(groupName);
        dispatch(this.searchItem());
      }.bind(this))
  }.bind(this)
}

module.exports.rollbackSearchItem = function(item){
  return {
    type: constant.actions.ROLLBACK_SEARCH_ITEM,
    data: item
  }
}