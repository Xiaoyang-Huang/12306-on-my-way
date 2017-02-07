var axios = require('axios');
var constant = require('../constant.js');

module.exports.getStations = function (stations) {
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

module.exports.searchData = function () {
  return function (dispatch, getState) {
    console.log("searchData", getState())
    var state = getState();
    if(!state.form.origin || !state.form.destination || !state.form.time) return;
    //disable chrome security check
    //"C:\Users\UserName\AppData\Local\Google\Chrome\Application\chrome.exe" --disable-web-security --user-data-dir
    //open -a "Google Chrome" --args --disable-web-security  --user-data-dir
    axios.get(constant.api.QUERY(state.form.origin.code, state.form.destination.code, state.form.time.format('YYYY-MM-DD')))
      .then(function(data){
        dispatch(this.fillTable(data.data))
      }.bind(this), function(){
        console.log("??????????", arguments)
      })
  }.bind(this);
}

module.exports.fillTable = function(data){
  console.log("get train data", data);
  return {
    type: constant.actions.FILL_TABLE,
    data: data.data
  }
}