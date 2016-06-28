var moment = require('moment');
var co = require('co');
var change_obj = {
    "id"            : "ds_ap_id",
    "device_type"   : "ds_device_type",
    "platform_type" : "ds_platform_type",
    "push_token"    : "ds_push_token"
}
    var table_name = "Ds_fingerprint_ap";
    var log_type = "device";
//此處出現的都是co要用的
module.exports = {
    //寫資料 通常只須改DB_NAME
    write_db: function( create_cond, who ){
        return new Promise(function(resolve, reject){
            Ds_fingerprint_ap.create(create_cond).exec(function(err,create_data){
                if(err){
                    no_call_service.write_log(table_name,"C_die", err, who, log_type);
                    var return_data = no_call_service.add_biota_result( {}, false, err.details, "");
                    resolve(return_data);
                }else{
                    no_call_service.write_log(table_name,"C_ok", create_cond, who, log_type);
                    var return_data = no_call_service.add_biota_result({}, true, "", "");
                    resolve(return_data);                                                     
                }           
            })   
        });
    },
    //查詢資料 通常只須改DB_NAME
    find_R1_db: function( search_cond, who ){
        return new Promise(function(resolve, reject){
            Ds_fingerprint_ap.find( search_cond ).exec(function(err,find_data){
                if(err){
                    no_call_service.write_log(table_name,"R1_die", err, who, log_type);
                    var return_data = no_call_service.add_biota_result( {}, false, err.details, "");
                    resolve(return_data);
                }else{
                    //撈取符合的使用者資料
                    if( _.isEmpty(find_data) ){
                        //查無資料
                        no_call_service.write_log(table_name,"R1_no_data", search_cond, who, log_type);
                        var return_data = no_call_service.add_biota_result({}, true, "查無資料", "查無資料");
                        resolve(return_data);       
                    }else{
                        F_linked.find({ds_ap_id: find_data.ds_ap_id}).exec(function(err2,flinked_data){
                            if(err2){
                                no_call_service.write_log(table_name,"R1_Flink_die", err, who, log_type);
                                var return_data = no_call_service.add_biota_result({}, false, err.details, "");
                                resolve(return_data);   
                            }else{
                                no_call_service.write_log(table_name,"R1_ok", search_cond, who, log_type);
                                find_data[0].human = _.pluck(flinked_data, "ds_human_pk");
                                var return_data = no_call_service.add_biota_result(find_data, true, "", "");
                                resolve(return_data);                                   
                            }
                        });
                    }                        
                }           
            })   
        });
    },
    //查詢資料 通常只須改DB_NAME
    find_R2_db: function( search_cond, who ){
        return new Promise(function(resolve, reject){
            Ds_fingerprint_ap.findOne( search_cond ).exec(function(err,find_data){
                if(err){
                    no_call_service.write_log(table_name,"R2_die", err, who, log_type);
                    var return_data = no_call_service.add_biota_result( {}, false, err.details, "");
                    resolve(return_data);
                }else{
                    if( _.isEmpty(find_data) ){
                        //查無資料
                        no_call_service.write_log(table_name,"R2_no_data", search_cond, who, log_type);
                        var return_data = no_call_service.add_biota_result({}, true, "查無資料", "查無資料");
                        resolve(return_data);       
                    }else{
                        no_call_service.write_log(table_name,"R2_ok", search_cond, who, log_type);
                        var return_data = no_call_service.add_biota_result(find_data, true, "", "");
                        resolve(return_data);                        
                    }
                }           
            })   
        });
    },
    //修改資料 通常只須改DB_NAME
    update_db: function( search_cond, update_cond, who ){
        return new Promise(function(resolve, reject){
            Ds_fingerprint_ap.update( search_cond, update_cond ).exec(function(err,update_data){
                if(err){
                    no_call_service.write_log(table_name,"U_die", err, who, log_type);
                    var return_data = no_call_service.add_biota_result( {}, false, err.details, "");
                    resolve(return_data);
                }else{
                    //撈取符合的使用者資料
                    if( _.isEmpty(update_data) ){
                        //查無資料
                        no_call_service.write_log(table_name,"U_no_data", search_cond, who, log_type);
                        var return_data = no_call_service.add_biota_result({}, true, "查無資料", "查無資料");
                        resolve(return_data);       
                    }else{
                        no_call_service.write_log(table_name,"U_ok", search_cond, who, log_type);
                        var return_data = no_call_service.add_biota_result({}, true, "", "");
                        resolve(return_data);                        
                    }
                }
            })
        });
    },
    //刪除資料 通常只須改DB_NAME
    destroy_db: function( delete_cond, who ){
        return new Promise(function(resolve, reject){
            Ds_fingerprint_ap.update( delete_cond ,{"ds_deleted": moment().toISOString()} ).exec(function(err,update_data){
                if(err){
                    no_call_service.write_log(table_name,"D_die", err, who, log_type);
                    var return_data = no_call_service.add_biota_result( {}, false, err.details, "");
                    resolve(return_data);
                }else{
                    no_call_service.write_log(table_name,"D_ok", delete_cond, who, log_type);
                    var return_data = no_call_service.add_biota_result(update_data, true, "", "");
                    resolve(return_data);
                }
            }) 
        });
    },
    //新增主function 通常須改上面的條件function 跟 catch
    create: function(input_params ,who){
        return new Promise(function(resolve, reject){
            co(function* () {                                                    
                var return_obj  = "";
                var fill_array  = ["id", "device_type", "platform_type"]; //必填欄位<輸入值>
                var nfill_array = []; //不可填欄位<輸入值>
                var cond_array = [];  //拿來當條件的欄位<欄位值>
                var check_fill_nfill = yield call_service.check_fill_nfill(input_params, fill_array, nfill_array);                
                
                if(check_fill_nfill == "ok"){
                    //輸入條件正確 修正資料ID內容
                    var r_array =  yield call_service.check_change_cond(input_params, change_obj, cond_array);
                    var final_data = yield ap_service.write_db( r_array[0], who );
                    var back_data =  yield call_service.back_change_cond(final_data, change_obj);
                    resolve( back_data );
                }else{
                    //輸入條件有誤 直接回傳錯誤JSON
                    resolve( check_fill_nfill );
                }
            }).catch(function(err){
                console.log("AP_third_routes_error_c",err);
            });   
        });
    },
    //新增主function 通常須改上面的條件function 跟 catch
    search1: function(input_params ,who){
        return new Promise(function(resolve, reject){
            co(function* () {                                                    
                var return_obj  = "";
                var fill_array  = ["id"]; //必填欄位<輸入值>
                var nfill_array = ["push_token"]; //不可填欄位<輸入值>
                var cond_array = [];  //拿來當條件的欄位<欄位值>
                var check_fill_nfill = yield call_service.check_fill_nfill(input_params, fill_array, nfill_array);                
                
                if(check_fill_nfill == "ok"){
                    //輸入條件正確 修正資料ID內容
                    var r_array =  yield call_service.check_change_cond(input_params, change_obj, cond_array);
                    r_array[0].ds_deleted = {"$exists":false}; //補上刪除不可被查
                    var final_data = yield ap_service.find_R1_db( r_array[0], who );
                    var back_data =  yield call_service.back_change_cond(final_data, change_obj);
                    resolve( back_data );
                }else{
                    //輸入條件有誤 直接回傳錯誤JSON
                    resolve( check_fill_nfill );
                }
            }).catch(function(err){
                console.log("AP_third_routes_error_r1",err);
            });   
        });
    },
    //新增主function 通常須改上面的條件function 跟 catch
    search2: function(input_params ,who){
        return new Promise(function(resolve, reject){
            co(function* () {                                                    
                var return_obj  = "";
                var fill_array  = ["id"]; //必填欄位<輸入值>
                var nfill_array = ["device_type", "platform_type", "push_token"]; //不可填欄位<輸入值>
                var cond_array = [];  //拿來當條件的欄位<欄位值>
                var check_fill_nfill = yield call_service.check_fill_nfill(input_params, fill_array, nfill_array);                
                
                if(check_fill_nfill == "ok"){
                    //輸入條件正確 修正資料ID內容
                    var r_array =  yield call_service.check_change_cond(input_params, change_obj, cond_array);
                    r_array[0].ds_deleted = {"$exists":false}; //補上刪除不可被查
                    var final_data = yield ap_service.find_R2_db( r_array[0], who );
                    var back_data =  yield call_service.back_change_cond(final_data, change_obj);
                    resolve( back_data );
                }else{
                    //輸入條件有誤 直接回傳錯誤JSON
                    resolve( check_fill_nfill );
                }
            }).catch(function(err){
                console.log("AP_third_routes_error_r2",err);
            });   
        });
    },
    //新增主function 通常須改上面的條件function 跟 catch
    update: function(input_params ,who){
        return new Promise(function(resolve, reject){
            co(function* () {                                                    
                var return_obj  = "";
                var fill_array  = ["id", "device_type", "platform_type"]; //必填欄位<輸入值>
                var nfill_array = ["push_token"]; //不可填欄位<輸入值>
                var cond_array = ["ds_ap_id"];  //拿來當條件的欄位<欄位值>
                var check_fill_nfill = yield call_service.check_fill_nfill(input_params, fill_array, nfill_array);                
                
                if(check_fill_nfill == "ok"){
                    //輸入條件正確 修正資料ID內容
                    var r_array =  yield call_service.check_change_cond(input_params, change_obj, cond_array);
                    r_array[1].ds_deleted = {"$exists":false}; //補上刪除不可被查
                    var final_data = yield ap_service.update_db( r_array[1], r_array[0], who );
                    var back_data =  yield call_service.back_change_cond(final_data, change_obj);
                    resolve( back_data );
                }else{
                    //輸入條件有誤 直接回傳錯誤JSON
                    resolve( check_fill_nfill );
                }
            }).catch(function(err){
                console.log("AP_third_routes_error_u",err);
            });   
        });
    },
    //新增主function 通常須改上面的條件function 跟 catch
    destroy: function(input_params ,who){
        return new Promise(function(resolve, reject){
            co(function* () {                                                    
                var return_obj  = "";
                var fill_array  = ["id", "device_type", "platform_type"]; //必填欄位<輸入值>
                var nfill_array = ["push_token"]; //不可填欄位<輸入值>
                var cond_array = [];  //拿來當條件的欄位<欄位值>
                var check_fill_nfill = yield call_service.check_fill_nfill(input_params, fill_array, nfill_array);                
                
                if(check_fill_nfill == "ok"){
                    //輸入條件正確 修正資料ID內容
                    var r_array =  yield call_service.check_change_cond(input_params, change_obj, cond_array);
                    var final_data = yield ap_service.destroy_db( r_array[0], who );
                    var back_data =  yield call_service.back_change_cond(final_data, change_obj);
                    resolve( back_data );
                }else{
                    //輸入條件有誤 直接回傳錯誤JSON
                    resolve( check_fill_nfill );
                }
            }).catch(function(err){
                console.log("AP_third_routes_error_u",err);
            });   
        });
    },
};

