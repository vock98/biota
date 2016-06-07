module.exports.myconf = {
    //IP位置使用 (目前用於no_call_service的Analy_weather)
    // myip : "52.192.93.236:1337",
    myip : "localhost:1337",
    //製作下拉選項用的資料
    select_sex :[
        { text: "男", value: "male",},
        { text: "女", value: "female",},
    ],
    select_blood :[
        { text: "A", value: "A",},
        { text: "B", value: "B",},
        { text: "O", value: "O",},
        { text: "AB", value: "AB",},
        { text: "RH", value: "RH",}
    ],
};

var moment = require('moment');