var moment = require('moment');
var co = require('co');
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
    write_db: function( create_cond, who ){
        return new Promise(function(resolve, reject){
            Ef_cwb.findOne(create_cond[0]).exec(function(err, cwb_Data){                
                if(err){
                    no_call_service.write_log(table_name,"C_die", err, who, log_type);
                    var return_data = no_call_service.add_biota_result( {}, false, err.details, "");
                    resolve(return_data);                    
                }else{
                    if( _.isEmpty(cwb_Data) ){
                        //表示沒有抓到值 要新增一筆
                        Ef_cwb.create(create_cond[1]).exec(function(err2, add_data){
                            if(err2){                            
                                no_call_service.write_log(table_name,"C_die", err2, who, log_type);
                                var return_data = no_call_service.add_biota_result( {}, false, err.details, "");
                                resolve(return_data);                
                            }else{
                                no_call_service.write_log(table_name,"C_ok", create_cond, who, log_type);
                                var return_data = no_call_service.add_biota_result({}, true, "", "");
                                resolve(return_data);   
                            }
                        })
                    }else{
                        //表示有抓到值 要更新資料
                        Ef_cwb.update(create_cond[0],create_cond[1]).exec(function(err3, up_data){
                            if(err3){                            
                                no_call_service.write_log(table_name,"C_die", err3, who, log_type);
                                var return_data = no_call_service.add_biota_result( {}, false, err.details, "");
                                resolve(return_data);                
                            }else{
                                no_call_service.write_log(table_name,"C_ok", create_cond, who, log_type);
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
    find_R_db: function( search_cond, who ){
        return new Promise(function(resolve, reject){
            Ef_cwb.find( search_cond ).exec(function(err,find_data){
                if(err){
                    no_call_service.write_log(table_name,"R_die", err, who, log_type);
                    var return_data = no_call_service.add_biota_result( {}, false, err.details, "");
                    resolve(return_data);
                }else{
                    //撈取符合的使用者資料
                    if( _.isEmpty(find_data) ){
                        //查無資料
                        no_call_service.write_log(table_name,"R_no_data", search_cond, who, log_type);
                        var return_data = no_call_service.add_biota_result({}, true, "查無資料", "查無資料");
                        resolve(return_data);       
                    }else{
                        no_call_service.write_log(table_name,"R_ok", search_cond, who, log_type);                        
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
};

