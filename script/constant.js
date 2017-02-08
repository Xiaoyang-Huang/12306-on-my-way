module.exports = {
  actions:{
    GET_STATION:'GET_STATION',
    SET_ORIGIN:"SET_ORIGIN",
    SET_DESTINATION:"SET_DESTINATION",
    SET_DEPARTURE_TIME:"SET_DEPARTURE_TIME",
    FILL_TABLE:"FILL_TABLE",
    SET_SEARCH_SEAT:"SET_SEARCH_SEAT",
    UNSET_SEARCH_SEAT:"UNSET_SEARCH_SEAT",
    SET_SEARCH_TRAIN:"SET_SEARCH_TRAIN",
    UNSET_SEARCH_TRAIN:"UNSET_SEARCH_TRAIN",
    START_SEARCH:"START_SEARCH"
  },
  api:{
    STATION:"https://kyfw.12306.cn/otn/resources/js/framework/station_name.js?station_version=1.8994",
    QUERY_ALL: function(originCode, destinationCode, depatureDate){
      return "https://kyfw.12306.cn/otn/leftTicket/queryZ" + 
        "?leftTicketDTO.train_date=" + depatureDate +
        "&leftTicketDTO.from_station=" + originCode + 
        "&leftTicketDTO.to_station=" + destinationCode + 
        "&purpose_codes=ADULT"
    },
    QUERY_TRAIN: function(trainNo, originCode, destinationCode, depatureDate){
      return "https://kyfw.12306.cn/otn/czxx/queryByTrainNo" + 
        "?train_no=" + trainNo +
        "&from_station_telecode=" + originCode +
        "&to_station_telecode=" + destinationCode +
        "&depart_date=" + depatureDate
    }
  },
  
}