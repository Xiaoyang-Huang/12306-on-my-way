var constant = require('../constant.js');

module.exports = function (state, action) {
  var change = state || { form: {}};
  switch(action.type){
    case constant.actions.GET_STATION:
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
      change.trains = action.data;
      break;
  }
  return Object.assign({}, state, change);
}