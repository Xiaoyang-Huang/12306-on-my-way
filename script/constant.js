module.exports = {
  actions:{
    GET_STATION:'GET_STATION',
    SET_ORIGIN:"SET_ORIGIN",
    SET_DESTINATION:"SET_DESTINATION",
    SET_DEPARTURE_TIME:"SET_DEPARTURE_TIME",
    FILL_TABLE:"FILL_TABLE"
  },
  api:{
    STATION:"https://kyfw.12306.cn/otn/resources/js/framework/station_name.js?station_version=1.8994",
    QUERY: function(originCode, destinationCode, depatureDate){
      return "https://kyfw.12306.cn/otn/leftTicket/queryZ" + 
        "?leftTicketDTO.train_date=" + depatureDate +
        "&leftTicketDTO.from_station=" + originCode + 
        "&leftTicketDTO.to_station=" + destinationCode + 
        "&purpose_codes=ADULT"
    }
  },
  
}