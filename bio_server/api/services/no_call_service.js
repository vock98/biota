var moment = require('moment');
var request = require('request');
//此處出現的所有共用參數都不需要有callback
module.exports = {
    //所有輸入值的驗證
	check_data:function(input_obj, check_array){
        var return_str ="";
        _.map(check_array, function(num){
            if(!input_obj[num]) return_str +="缺少參數:"+num+" \n<BR>";
        });
            return return_str;
    },
    //驗證不可出現的參數
	check_ignore_data:function(input_params, check_array){
        var return_str =false;
        _.map(check_array, function(num){
            if(input_params[num]) return_str =true;
        });
            return return_str;
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
                console.log("log",create_data.CRUD);
            }) 
        }else if(type=="human"){
            //人員資料LOG
            Db_human_log.create(cond).exec(function(err,create_data){
                console.log("log",create_data.CRUD);
            })            
        }else{
            //資料LOG 主要是天氣資料 太多 不呈現log
            Db_log.create(cond).exec(function(err,create_data){
                if(create_data.CRUD!="C_ok") console.log("log",create_data);
            }) 
        }
    },
    //快速補出條件(必填用)
	complete_cond:function( input_params, check_array, other_cond ){
        var now_cond = {};
        _.map(check_array,function(num){
            now_cond[num] = input_params[num];
        })
        if(other_cond)  now_cond[other_cond] = "";
        return now_cond;
    },
    //快速補出條件(非必填用)
	complete_not_cond:function( input_params, check_array, other_cond ){
        var now_cond = {};
        _.map(check_array,function(num){
            if(input_params[num]!=undefined)now_cond[num] = input_params[num];
        })
        if(other_cond)  now_cond[other_cond] = "";
        return now_cond;
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
        return return_array;
    },
    //拆解氣象局資料並寫進資料庫
    Analy_weather:function( input_params ){
        var table_name = "Ef_cwb";
        var log_type = "out";
        
        var data_params = input_params.cwbopendata;
        var result_obj ={};
            // return data_params.location[0].time[0].obsTime[0];
        //資料來源
        if(data_params.dataid == "CWB_A0002"){
            result_obj.ef_source = "RAIN";
        }else if(data_params.dataid == "CWB_A0003"){
            result_obj.ef_source = "NOW";            
        }

        //拆解各區域資料
        _.map(data_params.location, function(ldata){
            //觀測站名稱
            result_obj.ef_sitename = ldata.locationName[0];
            //紀錄日期
            result_obj.ef_date = moment(ldata.time[0].obsTime[0]).format('YYYY-MM-DD');
            //紀錄時間
            result_obj.ef_time = moment(ldata.time[0].obsTime[0]).format('HH');
            
            //資料名稱
            //WDSD = 風速、TEMP = 溫度、HUMD = 相對濕度、PRES = 氣壓、H_24R = 日累積雨量            
            var four_add = ["TEMP","HUMD","PRES","WDSD"]
            _.each(four_add,function(key){
                result_obj.ef_item =key;
                result_obj.ef_value =_.findWhere(ldata.weatherElement, {elementName: [key]}).elementValue[0].value[0];
                request.post('http://localhost:1337/api/Ef_cwb/add', {form:result_obj});
            });

            result_obj.ef_item ="H_24R";        
            result_obj.ef_value =_.findWhere(ldata.weatherElement, {elementName: ["24R"]}).elementValue[0].value[0];        
            request.post('http://localhost:1337/api/Ef_cwb/add', {form:result_obj});
        });
 
        // return data_params.location[0];
    },
};

