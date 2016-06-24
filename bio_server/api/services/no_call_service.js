var moment = require('moment');
var request = require('request');
//此處出現的都不是co必用的
module.exports = {
    //biota要得回傳方式
	add_biota_result:function(input_obj, input_success, input_message, input_resp){
        var return_obj ={};
        var result_obj = {
            success : input_success,
            message : input_message
        }
        var result_client = {
            resp : input_resp
        }
        return_obj.data = input_obj;
        return_obj.result = result_obj;
        return_obj.client = result_client;
        return return_obj;
    },
    //製作一個快速寫入DB_LOG的function 時間是自動產生不用補
    write_log:function(table_name, CRUD, input_cond, who, type){
        var cond = {};
        cond.table_name = table_name;
        cond.CRUD = CRUD;
        cond.input_cond = input_cond;
        cond.who = who;
        if(type=="device"){
            //設備操作紀錄LOG
            Db_device_log.create(cond).exec(function(err,create_data){
                console.log("log","Has device_log");
            }) 
        }else if(type=="human"){
            //人員資料LOG
            Db_human_log.create(cond).exec(function(err,create_data){
                console.log("log","Has Db_human_log");
            })            
        }else{
            //資料LOG 主要是天氣資料 太多 不呈現log
            Db_log.create(cond).exec(function(err,create_data){
                if(create_data.CRUD!="C_ok") console.log("log",create_data);
            }) 
        }
    },
    //轉換ef_time +ef_value ->ef_h00~ef_h23
	convert_time:function( input_params ){
        delete input_params['id'];
        var new_params = input_params;
        var return_array = [];
        return_array[0] = _.extend({}, input_params );
        switch(input_params.ef_time){
            case "00": new_params.ef_h00 = input_params.ef_value; break;
            case "01": new_params.ef_h01 = input_params.ef_value; break;
            case "02": new_params.ef_h02 = input_params.ef_value; break;
            case "03": new_params.ef_h03 = input_params.ef_value; break;
            case "04": new_params.ef_h04 = input_params.ef_value; break;
            case "05": new_params.ef_h05 = input_params.ef_value; break;
            case "06": new_params.ef_h06 = input_params.ef_value; break;
            case "07": new_params.ef_h07 = input_params.ef_value; break;
            case "08": new_params.ef_h08 = input_params.ef_value; break;
            case "09": new_params.ef_h09 = input_params.ef_value; break;
            case "10": new_params.ef_h10 = input_params.ef_value; break;
            case "11": new_params.ef_h11 = input_params.ef_value; break;
            case "12": new_params.ef_h12 = input_params.ef_value; break;
            case "13": new_params.ef_h13 = input_params.ef_value; break;
            case "14": new_params.ef_h14 = input_params.ef_value; break;
            case "15": new_params.ef_h15 = input_params.ef_value; break;
            case "16": new_params.ef_h16 = input_params.ef_value; break;
            case "17": new_params.ef_h17 = input_params.ef_value; break;
            case "18": new_params.ef_h18 = input_params.ef_value; break;
            case "19": new_params.ef_h19 = input_params.ef_value; break;
            case "20": new_params.ef_h20 = input_params.ef_value; break;
            case "21": new_params.ef_h21 = input_params.ef_value; break;
            case "22": new_params.ef_h22 = input_params.ef_value; break;
            case "23": new_params.ef_h23 = input_params.ef_value; break;           
        }
        return_array[1] = _.extend({}, new_params );
        delete return_array[0]['ef_time'];
        delete return_array[1]['ef_time'];
        delete return_array[0]['ef_value'];
        delete return_array[1]['ef_value'];    
        delete return_array[0]['type'];
        delete return_array[1]['type'];          
        return return_array;
    },
    change_type_to_ch:function(input_type){
        var return_str = "";
        switch(input_type){
            case "WDSD": return_str = "風速"; break;
            case "TEMP": return_str = "溫度"; break;
            case "HUMD": return_str = "相對濕度"; break;
            case "PRES": return_str = "氣壓"; break;
            case "H_24R": return_str = "日累積雨量"; break;
        }
        return return_str;
    }
};

