var moment = require('moment');
var co = require('co');
var http = require('http');
var xml2js = require('xml2js');
var request = require('request');
var co = require('co');
var moment = require('moment');

var change_obj = {
    "ef_sitename"   : "ef_sitename",
    "ef_source"  : "ef_source",
    "ef_item"  : "ef_item",
    "ef_date"  : "ef_date"
}
    var table_name = "Ef_cwb";
    var log_type = "other";
//此處出現的都是co要用的
module.exports = {
    //寫資料 通常只須改DB_NAME
    write_db: function( create_cond, who ,input_params ){
        return new Promise(function(resolve, reject){
            Ef_cwb.findOne(create_cond[0]).exec(function(err, cwb_Data){                
                if(err){
                    no_call_service.write_log(table_name,"C_die", input_params, who, log_type);
                    var return_data = no_call_service.add_biota_result( {}, false, err.details, "");
                    resolve(return_data);                    
                }else{
                    if( _.isEmpty(cwb_Data) ){
                        //表示沒有抓到值 要新增一筆
                        Ef_cwb.create(create_cond[1]).exec(function(err2, add_data){
                            if(err2){                            
                                no_call_service.write_log(table_name,"C_die", input_params, who, log_type);
                                var return_data = no_call_service.add_biota_result( {}, false, err.details, "");
                                resolve(return_data);                
                            }else{
                                no_call_service.write_log(table_name,"C_ok", input_params, who, log_type);
                                var return_data = no_call_service.add_biota_result({}, true, "", "");
                                resolve(return_data);   
                            }
                        })
                    }else{
                        //表示有抓到值 要更新資料
                        Ef_cwb.update(create_cond[0],create_cond[1]).exec(function(err3, up_data){
                            if(err3){                            
                                no_call_service.write_log(table_name,"C_die", input_params, who, log_type);
                                var return_data = no_call_service.add_biota_result( {}, false, err.details, "");
                                resolve(return_data);                
                            }else{
                                no_call_service.write_log(table_name,"C_ok", input_params, who, log_type);
                                var return_data = no_call_service.add_biota_result({}, true, "", "");
                                resolve(return_data);   
                            }
                        })
                    }                                             
                }
            })
        });
    },
    //查詢資料 通常只須改DB_NAME
    find_R_db: function( search_cond, who, input_params ){
        return new Promise(function(resolve, reject){
            Ef_cwb.find( search_cond ).exec(function(err,find_data){
                if(err){
                    no_call_service.write_log(table_name,"R_die", input_params, who, log_type);
                    var return_data = no_call_service.add_biota_result( {}, false, err.details, "");
                    resolve(return_data);
                }else{
                    //撈取符合的使用者資料
                    if( _.isEmpty(find_data) ){
                        //查無資料
                        no_call_service.write_log(table_name,"R_no_data", input_params, who, log_type);
                        var return_data = no_call_service.add_biota_result({}, true, "查無資料", "查無資料");
                        resolve(return_data);       
                    }else{
                        no_call_service.write_log(table_name,"R_ok", input_params, who, log_type);                        
                        var return_data = no_call_service.add_biota_result(find_data[0], true, "", "");
                        resolve(return_data);                                   
                    }                        
                }           
            })   
        });
    },
    //新增主function 通常須改上面的條件function 
    create: function(input_params ,who){
        return new Promise(function(resolve, reject){
            co(function* () {                                                    
                var return_obj  = "";
                var fill_array  = ["ef_sitename","ef_source","ef_item","ef_date","ef_time","ef_value"]; //必填欄位<輸入值>
                var nfill_array = ["from","to"]; //不可填欄位<輸入值>
                var cond_array = [];  //拿來當條件的欄位<欄位值>
                var check_fill_nfill = yield call_service.check_fill_nfill(input_params, fill_array, nfill_array);                
                
                if(check_fill_nfill == "ok"){
                    //輸入條件正確 修正資料ID內容
                    var new_params = no_call_service.convert_time(input_params);                    
                    var final_data = yield cwb_service.write_db( new_params, who );                    
                    resolve( final_data );
                }else{
                    //輸入條件有誤 直接回傳錯誤JSON
                    resolve( check_fill_nfill );
                }
            }).catch(function(err){
                console.log(table_name+"_third_routes_error_c",err);
            });   
        });
    },
    //新增主function 通常須改上面的條件function 跟 catch
    search: function(input_params ,who){
        return new Promise(function(resolve, reject){
            co(function* () {                                                    
                var return_obj  = "";
                var fill_array  = ["from","to"]; //必填欄位<輸入值>
                var nfill_array = ["ef_value"]; //不可填欄位<輸入值>
                var cond_array = [];  //拿來當條件的欄位<欄位值>
                var check_fill_nfill = yield call_service.check_fill_nfill(input_params, fill_array, nfill_array);                
                
                if(check_fill_nfill == "ok"){
                    //輸入條件正確 修正資料ID內容
                    input_params.createdAt = { '>': moment(input_params.from).startOf('day').toISOString(), '<': moment(input_params.to).endOf('day').toISOString() };
                    delete input_params['from'];
                    delete input_params['to'];
                    delete input_params['id'];
                    delete input_params['type'];
                    var final_data = yield cwb_service.find_R_db( input_params, who );                    
                    resolve( final_data );
                }else{
                    //輸入條件有誤 直接回傳錯誤JSON
                    resolve( check_fill_nfill );
                }
            }).catch(function(err){
                console.log(table_name+"_third_routes_error_r1",err);
            });   
        });
    },
    //拿到官方XML
    get_url_callback_xml: function(input_url){
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
    },
    //拆解氣象局資料
    write_Analy_weather: function(input_params){
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
    },   
    
};

