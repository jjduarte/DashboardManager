'use strict';

module.exports = {
    setCreationDate : function(data) {
        var date = data;
        var day = date.getUTCDate();
        var month = (date.getUTCMonth()+1 <10?'0':'') + (date.getUTCMonth()+1);
        var year = date.getFullYear();
        var hours = date.getHours();
        var minutes = (date.getMinutes()<10?'0':'') + date.getMinutes();
        var seconds = date.getSeconds();
        var strTime = hours + ':' + minutes + ':' + seconds;
        return  year + "-" + month + "-" + day + " " + strTime;
    },

    formatDate : function(data) {
        var date = data;
        var day = date.getUTCDate();
        if(day.toString().length!=2){
            day = '0'+ day;
        }
        var month = (date.getMonth()+1 <10?'0':'') + (date.getMonth()+1);
        var year = date.getFullYear();
        return  year + "-" + month + "-" + day;
    }
};
