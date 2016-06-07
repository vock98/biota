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
var parser = require('xml2js');
var fs = require('fs');

//雨量觀測資料 Rain
var options = {
    host: 'opendata.cwb.gov.tw',
    path: '/opendataapi?dataid=O-A0002-001&authorizationkey=CWB-37305A70-2D5B-4816-B5BA-C1F59EDF1678'
};

//現在天氣觀測 NOW
var options2 = {
    host: 'opendata.cwb.gov.tw',
    path: '/opendataapi?dataid=O-A0003-001&authorizationkey=CWB-37305A70-2D5B-4816-B5BA-C1F59EDF1678'
};

callback = function(response) {
    var xml = '';

    //another chunk of data has been recieved, so append it to `xml`
    response.on('data', function(chunk) {
        xml += chunk;
    });

    console.log(response.statusCode);
    //the whole response has been recieved, so we just print it out here
    response.on('end', function() {
        parser.parseString(xml, function(err, result) {            
            if (err) {
                console.log("中央錯誤",err);
            } else {
                var result_obj = no_call_service.Analy_weather(result);
            }
        });
    });
}

module.exports.cron = {
    //取得中央氣象局的資料 20分鐘跑一次
    get_cwb: {
        schedule: '0 */20 * * * *',
        onTick: function() {      
            console.log('取得中央氣象局資料');
            http.request(options2, callback).end();
        },
        start: true, // Start task immediately
        timeZone: "Asia/Taipei"
        // onComplete: function() {
        // console.log('跑完了');
        // },
        // context: undefined // Custom context for onTick callback
    }
};