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
    select_device :[
        { text: "ios", value: "ios",},
        { text: "android", value: "android",},
        { text: "windows", value: "windows",},
        { text: "mac", value: "mac",},
        { text: "linux", value: "linux",},
        { text: "其他", value: "other",},
    ],
    select_simulator :[
        { text: "Ap_C",  value: "/api/Ds_fingerprint_ap/C", },
        { text: "Ap_R1", value: "/api/Ds_fingerprint_ap/R1",},
        { text: "Ap_R2", value: "/api/Ds_fingerprint_ap/R2",},
        { text: "Ap_U",  value: "/api/Ds_fingerprint_ap/U", },
        { text: "Ap_D",  value: "/api/Ds_fingerprint_ap/D", },
        
        { text: "Device_C",  value: "/api/Ds_fingerprint_device/C", },
        { text: "Device_R",  value: "/api/Ds_fingerprint_device/R",},
        { text: "Device_U",  value: "/api/Ds_fingerprint_device/U", },
        { text: "Device_D",  value: "/api/Ds_fingerprint_device/D", },
        
        { text: "Human_C",  value: "/api/Ds_human/C", },
        { text: "Human_R1", value: "/api/Ds_human/R1",},
        { text: "Human_R2", value: "/api/Ds_human/R2",},
        { text: "Human_U",  value: "/api/Ds_human/U", },
        { text: "Human_D",  value: "/api/Ds_human/D", },
        
        { text: "Nfc_C",  value: "/api/Ds_nfc/C", },
        { text: "Nfc_R",  value: "/api/Ds_nfc/R",},
        { text: "Nfc_D",  value: "/api/Ds_nfc/D", },
        
        { text: "Envir_C",  value: "/api/Ef_envir/C", },
        { text: "Envir_R",  value: "/api/Ef_envir/R",},
        { text: "Envir_U",  value: "/api/Ef_envir/U", },
        { text: "Envir_D",  value: "/api/Ef_envir/D", },
    ],
};

var moment = require('moment');