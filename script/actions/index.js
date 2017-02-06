var axios = require('axios');
var constant = require('../constant.js');

module.exports.getStations = function (stations) {
  var data = [];
  for (var i = 0, il = stations.length; i < il; i++) {
    var dataItems = stations[i].split('|');
    //@bjb|北京北|VAP|beijingbei|bjb|0
    data.push({
      name: dataItems[1],
      code:dataItems[2],
      pinyin: dataItems[3]
    })
  }
  return {
    type: constant.actions.GET_STATION,
    data: data
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

module.exports.searchData = function(){
  return function(dispatch, getState){
    console.log("searchData", getState())
    var state = getState();
    // axios.get(constant.api.query(state.form.origin, state.form.destination, state.form.setDepartureTime))
    //   .then(function(){
    //     console.log("!!!!!!!!!!", arguments)
    //   })
    var stationLoad = document.createElement('img');
    stationLoad.src = constant.api.query(state.form.origin.code, state.form.destination.code, "2017-02-07");
    stationLoad.onload = function(){
      console.dir("!!!!!!", stationLoad)
    }
    document.body.appendChild(stationLoad);
  }
}