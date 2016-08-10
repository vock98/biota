module.exports.myconf = {
    //IP位置使用 (目前用於no_call_service的Analy_weather)
    // myip : "52.192.93.236:1337",
    myip : "localhost:1337",
    my_firstpage : "/human/list",
    error_firstpage : "/login?error=err",
    //製作下拉選項用的資料
    select_arstyle :[
        { text: "公告", value: "announcement",},
        { text: "提醒", value: "reminder",},
    ],
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
        { text: "Ap_C",  value: "/api/Ds_fingerprint_ap", },
        { text: "Ap_R1", value: "/api/Ds_fingerprint_ap",},
        { text: "Ap_R2", value: "/api/Ds_fingerprint_ap",},
        { text: "Ap_U",  value: "/api/Ds_fingerprint_ap", },
        { text: "Ap_D",  value: "/api/Ds_fingerprint_ap", },
        
        { text: "Device_C",  value: "/api/Ds_fingerprint_device", },
        { text: "Device_R",  value: "/api/Ds_fingerprint_device",},
        { text: "Device_U",  value: "/api/Ds_fingerprint_device", },
        { text: "Device_D",  value: "/api/Ds_fingerprint_device", },
        
        { text: "Human_C",  value: "/api/Ds_human", },
        { text: "Human_R1", value: "/api/Ds_human",},
        { text: "Human_R2", value: "/api/Ds_human",},
        { text: "Human_U",  value: "/api/Ds_human", },
        { text: "Human_D",  value: "/api/Ds_human", },
        
        { text: "Nfc_C",  value: "/api/Ds_nfc", },
        { text: "Nfc_R",  value: "/api/Ds_nfc",},
        { text: "Nfc_D",  value: "/api/Ds_nfc", },
        
        { text: "F_C",  value: "/api/F_linked", },
        { text: "F_D",  value: "/api/F_linked", },
        
        { text: "Fserver_Ri",  value: "/api/Comparison_server", },
        { text: "Fserver_Rv",  value: "/api/Comparison_server", },
        
        { text: "Fclient_Ri",  value: "/api/Comparison_client", },
        { text: "Fclient_Rv",  value: "/api/Comparison_client", },
        
        { text: "Info_C",  value: "/api/Info_list", },
        { text: "Info_R",  value: "/api/Info_list", },
        { text: "Info_U",  value: "/api/Info_list", },
        { text: "Info_D",  value: "/api/Info_list", },
        
        { text: "Cwb_C",  value: "/api/Ef_cwb", },
        { text: "Cwb_R",  value: "/api/Ef_cwb", },
        
        { text: "Envir_C",  value: "/api/Ef_envir", },
        { text: "Envir_R",  value: "/api/Ef_envir", },
        { text: "Envir_U",  value: "/api/Ef_envir", },
        { text: "Envir_D",  value: "/api/Ef_envir", },
    ],
};

var moment = require('moment');