/*
*    *    *    *    *    *
┬    ┬    ┬    ┬    ┬    ┬
│    │    │    │    │    |
│    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
│    │    │    │    └───── month (1 - 12)
│    │    │    └────────── day of month (1 - 31)
│    │    └─────────────── hour (0 - 23)
│    └──────────────────── minute (0 - 59)
└───────────────────────── second (0 - 59, OPTIONAL)
*/
var http = require('http');
var xml2js = require('xml2js');
var fs = require('fs');
var request = require('request');
var co = require('co');
var moment = require('moment');
var Rain_url = "http://opendata.cwb.gov.tw/opendataapi?dataid=O-A0002-001&authorizationkey=CWB-37305A70-2D5B-4816-B5BA-C1F59EDF1678";
var Now_url = "http://opendata.cwb.gov.tw/opendataapi?dataid=O-A0003-001&authorizationkey=CWB-37305A70-2D5B-4816-B5BA-C1F59EDF1678";

//拿到官方XML
function get_url_callback_xml(input_url){
    return new Promise(function(resolve, reject){
        request( input_url , function (error, response, body) {
            if (!error && response.statusCode == 200) {      
                xml2js.parseString(body, function(err, result) {            
                    if (err) {
                        console.log("xml_error",err);
                        reject("xml_error");
                    } else {
                        resolve( result );
                    }
                });
            }else{
                reject("讀取"+input_url+"失敗");
            }
        })   
    });
}

//寫入DB
function get_url_callback(result_obj){
    return new Promise(function(resolve, reject){
        // var return_obj = yield cwb_service.create( result_obj , "auto_write");
        resolve(null);
    });
}

//拆解氣象局資料
function write_Analy_weather(input_params){
    return new Promise(function(resolve, reject){
        var table_name = "Ef_cwb";
        var log_type = "out";        
        var data_params = input_params.cwbopendata;
        var final_array = [];

        //拆解各區域資料
        _.each(data_params.location, function(ldata){
            if(data_params.dataid == "CWB_A0002"){                
                //資料名稱 MIN_10 = 十分鐘內雨量                
                final_array.push({
                    ef_sitename : ldata.locationName[0], //觀測站名稱
                    ef_date : moment(ldata.time[0].obsTime[0]).format('YYYY-MM-DD'),//紀錄日期
                    ef_time : moment(ldata.time[0].obsTime[0]).format('HH'), //紀錄時間
                    type : "C",//使用寫入
                    ef_source : "RAIN", //資料來源
                    ef_item : "MIN_10",
                    ef_value : _.findWhere(ldata.weatherElement, {elementName: ["MIN_10"]}).elementValue[0].value[0]
                });       
            }else if(data_params.dataid == "CWB_A0003"){          
                //資料名稱
                //WDSD = 風速 TEMP = 溫度 HUMD = 相對濕度 PRES = 氣壓 H_24R = 日累積雨量            
                var four_add = ["TEMP","HUMD","PRES","WDSD"]
                _.each(four_add,function(key){
                    final_array.push({
                        ef_sitename : ldata.locationName[0], //觀測站名稱
                        ef_date : moment(ldata.time[0].obsTime[0]).format('YYYY-MM-DD'),//紀錄日期
                        ef_time : moment(ldata.time[0].obsTime[0]).format('HH'), //紀錄時間
                        type : "C",//使用寫入
                        ef_source : "NOW", //資料來源
                        ef_item : key,
                        ef_value : _.findWhere(ldata.weatherElement, {elementName: [key]}).elementValue[0].value[0]
                    });    
                });
                final_array.push({
                    ef_sitename : ldata.locationName[0], //觀測站名稱
                    ef_date : moment(ldata.time[0].obsTime[0]).format('YYYY-MM-DD'),//紀錄日期
                    ef_time : moment(ldata.time[0].obsTime[0]).format('HH'), //紀錄時間
                    type : "C",//使用寫入
                    ef_source : "NOW", //資料來源
                    ef_item : "H_24R",
                    ef_value : _.findWhere(ldata.weatherElement, {elementName: ["24R"]}).elementValue[0].value[0]
                });
            }      
        });    
            resolve(final_array);                     
    });
}


module.exports.cron = {
    // 取得中央氣象局的雨量資料 15分鐘跑一次
    get_cwb: {
        // schedule: '*/5 * * * * *', 
        schedule: '0 */15 * * * *',
        onTick: function() { 
            co(function* () {                
                console.log('開始取得中央氣象局的資料');
                var rain_xml_data = yield get_url_callback_xml( Rain_url ); //取得下雨相關資訊xml
                var rain_data = yield write_Analy_weather( rain_xml_data ); //換得下雨資訊data 
                var rain_url_data = "";
                    for(var key in rain_data){
                        // console.log(rain_data[key]);
                        var rain_url_data = yield  cwb_service.create( rain_data[key] , "auto_write");
                        // var rain_url_data = yield get_url_callback(rain_data[key]);
                    }
                var weather_xml_data = yield get_url_callback_xml( Now_url ); //取得天氣相關資訊xml
                var weather_data = yield write_Analy_weather( weather_xml_data ); //寫入天氣資訊data
                var weather_url_data = "";
                    for(var key in weather_data){
                        var rain_url_data = yield  cwb_service.create( weather_data[key] , "auto_write");
                        // var weather_url_data = yield get_url_callback(weather_data[key]);
                    }       

                //為了記憶體 把這些資料通通清空
                rain_xml_data = null;
                rain_data = null;
                rain_url_data = null;
                weather_xml_data = null;
                weather_data = null;
                weather_url_data = null;                
                
                console.log('結束取得中央氣象局的資料');
            }).catch(function(err){
                console.log("cron_get_cwb_error",err);
            });        
        },
        start: true, // Start task immediately
        timeZone: "Asia/Taipei",
        onComplete: function() {
            console.log('跑完了');
        },
    },
};
