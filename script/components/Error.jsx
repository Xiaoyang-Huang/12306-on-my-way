var React = require('react');
var ReactRedux = require('react-redux');

module.exports = ReactRedux.connect(function(store){
  return {
    error: store.error,
    data: store.errorData
  }
})(React.createClass({
  reloadPage: function(){
    location.reload();
  },
  render: function () {
    console.log(this.props.error)
    if(this.props.error){
      return (
        <div className="error-wrap">
          <div className="error">
            <p>{this.props.data}</p>
            <a className="button" onClick={this.reloadPage}>刷新页面</a>
          </div>
        </div>
      )
    }else{
      return null;
    }
  }
}))