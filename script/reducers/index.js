var constant = require('../constant.js');

module.exports = function (state, action) {
  var change = state || { form: {}, selectedTrains:[], selectedSeats:[]};
  switch(action.type){
    case constant.actions.GET_STATION:
      change.inited = true;
      change.stations = action.data;
      break;
    case constant.actions.SET_ORIGIN:
      change.form.origin = action.data;
      break;
    case constant.actions.SET_DESTINATION:
      change.form.destination = action.data;
      break;
    case constant.actions.SET_DEPARTURE_TIME:
      change.form.time = action.data;
      break;
    case constant.actions.FILL_TABLE:
      change.selectedTrains = [];
      change.trains = action.data;
      break;
    case constant.actions.SET_SEARCH_SEAT:
      if(!~change.selectedSeats.indexOf(action.data)) change.selectedSeats.push(action.data);
      break;
    case constant.actions.UNSET_SEARCH_SEAT:
      var index = change.selectedSeats.indexOf(action.data);
      if(~index) change.selectedSeats.splice(index, 1);
      break;
    case constant.actions.SET_SEARCH_TRAIN:
      if(!~change.selectedTrains.indexOf(action.data)) change.selectedTrains.push(action.data);
      console.log("!?!?!?!?", change.selectedTrains);
      break;
    case constant.actions.UNSET_SEARCH_TRAIN:
      var index = change.selectedTrains.indexOf(action.data);
      if(~index) change.selectedTrains.splice(index, 1);
      break;
    case constant.actions.START_SEARCH:
      change.searchData = action.data;
      break;
    case constant.actions.ROLLBACK_SEARCH_ITEM:
      change.searchData.push(action.data);
      break;
    case constant.actions.CANCEL_SEARCH:
    case constant.actions.END_SEARCH:
      change.searchData = [];
      break;
    case constant.actions.FOUND_TRAIN:
      change.searchResult = action.data;
      break;
    case constant.actions.APP_ERROR:
      change.error = true;
      change.errorData = action.data;
      break;
  }
  return Object.assign({}, change);
}