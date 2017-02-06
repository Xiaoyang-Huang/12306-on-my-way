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
    //"C:\Users\UserName\AppData\Local\Google\Chrome\Application\chrome.exe" --disable-web-security --user-data-dir
    //open -a "Google Chrome" --args --disable-web-security  --user-data-dir
    axios.get(constant.api.query(state.form.origin.code, state.form.destination.code, "2017-02-08"))
      .then(function(){
        console.log("!!!!!!!!!!", arguments)
      }, function(){
        console.log("??????????", arguments)
      })

    // $.getJSON(constant.api.query(state.form.origin.code, state.form.destination.code, "2017-02-08"), {}, function (data) {
    //       if (data.query.results) {
    //           var J_data = JSON.parse(JSON.stringify(data.query.results));
    //           console.log("!!!!!!", J_data);
    //       } else {
    //           console.log("??????", J_data);
    //       }
    //   });

    // var stationLoad = document.createElement('script');
    // stationLoad.src = constant.api.query(state.form.origin.code, state.form.destination.code, "2017-02-08");
    // stationLoad.onreadystatechange = function(){
    //   console.log('onreadystatechange')
    // }
    // stationLoad.onload = function () {
    //   for (var i in stationLoad) {
    //     try {
    //       console.log(i, stationLoad[i]);
    //     } catch (e) {
    //       console.error(e);
    //     }
    //   }
    // }
    // document.body.appendChild(stationLoad);
  }
}