var React = require('react');
var ReactDOM = require('react-dom');
var Redux = require('redux');
var ReactRedux = require('react-redux');
var Thunk = require('redux-thunk').default;
var reducer = require('./reducers/index.js');

var constant = require('./constant.js');

var actions = require('./actions/index.js');

var App = require('./components/App.jsx');

var stationLoad = document.createElement('script');
stationLoad.src = constant.api.STATION;
stationLoad.onload = function(){
  var stations = station_names.match(/@([^\|]+\|){5}\d+/g);
  var store = Redux.createStore(reducer, Redux.applyMiddleware(Thunk));
  store.dispatch(actions.getStations(stations));

  ReactDOM.render(<ReactRedux.Provider store={store}>
      <App />
    </ReactRedux.Provider>, document.getElementById('main'))
}
document.body.appendChild(stationLoad);



