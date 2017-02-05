var React = require('react');
var ReactDOM = require('react-dom')

var constant = require('./constant.js');

var actions = require('./actions/index.js');

// var Timer = require('./component/Timer.jsx');
// var Editor = require('./component/Editor.jsx');

var Main = React.createClass({
  componentDidMount: function(){
    actions.getStations();
  },
  render: function(){
    return (
    <div>
      111
    </div>
    )
  }
})

var stationLoad = document.createElement('script');
stationLoad.src = constant.resources.STATION;
stationLoad.onload = function(){
  //2637
  var stations = station_names.match(/@([^\|]+\|){5}\d+/g);
  console.log(stations);
  ReactDOM.render(<Main />, document.getElementById('main'));
}
document.body.appendChild(stationLoad);



