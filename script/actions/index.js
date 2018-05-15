var axios = require('axios');
var constant = require('../constant.js');

function unzipTrainInfo(zipedString) {
  var infos = zipedString.split('|');
  return {
    "secretStr": infos[0],
    "train_no": infos[2],
    "station_train_code": infos[3],
    "start_station_telecode": infos[4],
    "end_station_telecode": infos[5],
    "from_station_telecode": infos[6],
    "to_station_telecode": infos[7],
    "start_time": infos[8],
    "arrive_time": infos[9],
    "lishi": infos[10],
    "canWebBuy": infos[11],
    "yp_info": infos[12],
    "start_train_date": infos[13],
    "train_seat_feature": infos[14],
    "location_code": infos[15],
    "from_station_no": infos[16],
    "to_station_no": infos[17],
    "is_support_card": infos[18],
    "controlled_train_flag": infos[19],
    "gg_num": infos[20] || '--',
    "gr_num": infos[21] || '--',
    "qt_num": infos[22] || '--',
    "rw_num": infos[23] || '--',
    "rz_num": infos[24] || '--',
    "tz_num": infos[25] || '--',
    "wz_num": infos[26] || '--',
    "yb_num": infos[27] || '--',
    "yw_num": infos[28] || '--',
    "yz_num": infos[29] || '--',
    "ze_num": infos[30] || '--',
    "zy_num": infos[31] || '--',
    "swz_num": infos[32] || '--',
    "srrb_num": infos[33] || '--',
    "yp_ex": infos[34],
    "seat_types": infos[35]
  }
}

function getLocationByStation(station_name) {
  var lastChar = station_name.charAt(station_name.length - 1);
  switch (true) {
    case "东":
    case "南":
    case "西":
    case "北":
      return station_name.substr(0, station_name.length - 1);
  }
}

function findStationIndex(station) {
  var targetStation = new String(this);
  var lastChar = targetStation.charAt(targetStation.length - 1);
  switch (lastChar) {
    case "东":
    case "南":
    case "西":
    case "北":
      targetStation = targetStation.substr(0, targetStation.length - 1);  
  }
  return targetStation.indexOf(station.station_name) == 0 || station.station_name.indexOf(targetStation) == 0;
}

module.exports.getStations = function () {
  return function (dispatch, getState) {
    axios.get(constant.api.INIT).then(function (data) {
      var html = data.data;
      var CLeftTicketUrl = /var\sCLeftTicketUrl\s=\s\'(.*)\'/.exec(html);
      if (CLeftTicketUrl.length == 2) {
        CLeftTicketUrl = CLeftTicketUrl[1];
        var global = global || window;
        global.CLeftTicketUrl = CLeftTicketUrl;
        // console.log("CLeftTicketUrl", CLeftTicketUrl)
        axios.get(constant.api.STATION).then(function (data) {
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
      } else {
        console.error("can not found CLeftTicketUrl")
      }
    }.bind(this), function (err) {
      dispatch({
        type: constant.actions.APP_ERROR,
        data: err.message + ", 请先登录12306后再刷新页面"
      })
    })
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
      }.bind(this)).catch(function () {
        console.error("searchData error", arguments)
      })
  }.bind(this);
}

module.exports.fillTable = function (data) {
  console.log("get train data", data);
  var rows = data.data.result.map(unzipTrainInfo)
  return {
    type: constant.actions.FILL_TABLE,
    data: rows
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
        return axios.get(constant.api.QUERY_TRAIN(train.train_no, train.start_station_telecode, train.end_station_telecode, state.form.time.format('YYYY-MM-DD')))
          .then(function (data) {
            var stations = data.data.data.data;
            console.log("startSearch: get stations", stations, state.form);
            var startStationIndex = stations.findIndex(findStationIndex.bind(state.form.origin.name));
            var endStationIndex = stations.findIndex(findStationIndex.bind(state.form.destination.name));
            console.log(train.station_train_code + "(" + train.train_no + ")", "startStationIndex", startStationIndex, "endStationIndex", endStationIndex, "stations", stations.length)
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
                  console.log("startSearch: key", key);
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
    // console.log("searchItem: get item", item);
    var trainNumbers = item.trains.map(function (o) { return o.station_train_code; });
    var groupName = '正在查询 ' + item.origin.name + ' 到 ' + item.destination.name + ' 的列车(' + trainNumbers.join(',') + ')';
    console.group(groupName);
    axios.get(constant.api.QUERY_ALL(item.origin.code, item.destination.code, state.form.time.format('YYYY-MM-DD')))
      .then(function (result) {
        // console.log("searchItem: axios result", result, typeof result.data);
        if(typeof result.data === 'string'){
          throw "查询时遇到错误";
        }
        var trains = result.data.data.result.map(unzipTrainInfo);
        item.trains.map(function (o) {
          var train = trains.find(function (io) {
            return o.train_no == io.train_no;
          })
          if (train) {
            console.log("列车:", train.station_train_code + "(" + train.train_no + ")", (train.canWebBuy == 'N' ? "无票" : "有票"));
            dispatch({
              type: constant.actions.FOUND_TRAIN,
              data: {
                origin: item.origin,
                destination: item.destination,
                train: train
              }
            })
          }
        })
        console.groupEnd(groupName);
        if (state.searchData.length > 0) {
          // setTimeout(function () {
          dispatch(this.searchItem());
          // }.bind(this), 0);
        } else {
          dispatch({
            type: constant.actions.END_SEARCH
          })
        }
      }.bind(this)).catch(function (err) {
        console.error(err, item);
        dispatch(this.rollbackSearchItem(item));
        console.groupEnd(groupName);
        dispatch(this.searchItem());
      }.bind(this))
  }.bind(this)
}

module.exports.rollbackSearchItem = function (item) {
  return {
    type: constant.actions.ROLLBACK_SEARCH_ITEM,
    data: item
  }
}

module.exports.cancelSearch = function () {
  return {
    type: constant.actions.CANCEL_SEARCH
  }
}

module.exports.openOrderWindow = function (secretStr, origin, destination) {
  return function (dispatch, getState) {
    var state = getState();
    var formData = new FormData();
    formData.append("secretStr", secretStr);
    formData.append("train_date", state.form.time.format('YYYY-MM-DD'));
    formData.append("back_train_date", state.form.time.format('YYYY-MM-DD'));
    formData.append("tour_flag", "dc");
    formData.append("purpose_codes", "ADULT");
    formData.append("query_from_station_name", origin);
    formData.append("query_to_station_name", destination);
    axios.post(constant.api.SUBMIT_ORDER, formData).then(function (data) {
      console.log("!!!!", data);
      if (data.data.status) {
        window.open(constant.api.ORDER, "_blank");
      } else {
        alert(data.data.messages[0]);
      }
    }, function (data) {
      alert('订单提交错误,请重试');
    })
  }
}