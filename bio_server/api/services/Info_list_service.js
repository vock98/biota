var moment = require('moment');
var co = require('co');
var change_obj = {
    "subject_pk": "ds_subject_pk",
    "subject"   : "ds_subject",
    "tricker"   : "ds_tricker",
    "time"      : "ds_time",
    "style"     : "ds_style"
}
    var table_name = "Info_list";
    var log_type = "human";
//此處出現的都是co要用的
module.exports = {
    //寫資料 通常只須改DB_NAME
    write_db: function( create_cond, who ,input_params ){
        return new Promise(function(resolve, reject){
            Info_list.create(create_cond).exec(function(err,create_data){
                if(err){
                    no_call_service.write_log(table_name,"C_die", input_params, who, log_type);
                    var return_data = no_call_service.add_biota_result( [], false, err.details, "");
                    resolve(return_data);
                }else{
                    no_call_service.write_log(table_name,"C_ok", input_params, who, log_type);
                    var return_data = no_call_service.add_biota_result([], true, "", "");
                    resolve(return_data);                                                     
                }           
            })   
        });
    },
    //查詢資料 通常只須改DB_NAME
    find_R_db: function( search_cond, who, input_params ){
        return new Promise(function(resolve, reject){
            Info_list.find( search_cond ).exec(function(err,find_data){
                if(err){
                    no_call_service.write_log(table_name,"R_die", input_params, who, log_type);
                    var return_data = no_call_service.add_biota_result( [], false, err.details, "");
                    resolve(return_data);
                }else{
                    //撈取符合的使用者資料
                    if( _.isEmpty(find_data) ){
                        //查無資料
                        no_call_service.write_log(table_name,"R_no_data", input_params, who, log_type);
                        var return_data = no_call_service.add_biota_result([], true, "查無資料", "查無資料");
                        resolve(return_data);       
                    }else{
                        no_call_service.write_log(table_name,"R_ok", input_params, who, log_type);
                        var return_data = no_call_service.add_biota_result(find_data, true, "", "");
                        resolve(return_data);                                   
                    }                        
                }           
            })   
        });
    },    
    //修改資料 通常只須改DB_NAME
    update_db: function( search_cond, update_cond, who, input_params ){
        return new Promise(function(resolve, reject){
            Info_list.update( search_cond, update_cond ).exec(function(err,update_data){
                if(err){
                    no_call_service.write_log(table_name,"U_die", input_params, who, log_type);
                    var return_data = no_call_service.add_biota_result( [], false, err.details, "");
                    resolve(return_data);
                }else{
                    //撈取符合的使用者資料
                    if( _.isEmpty(update_data) ){
                        //查無資料
                        no_call_service.write_log(table_name,"U_no_data", input_params, who, log_type);
                        var return_data = no_call_service.add_biota_result([], true, "查無資料", "查無資料");
                        resolve(return_data);       
                    }else{
                        no_call_service.write_log(table_name,"U_ok", input_params, who, log_type);
                        var return_data = no_call_service.add_biota_result([], true, "", "");
                        resolve(return_data);                        
                    }
                }
            })
        });
    },
    //刪除資料 通常只須改DB_NAME
    destroy_db: function( delete_cond, who ,input_params){
        return new Promise(function(resolve, reject){
            Info_list.update( delete_cond ,{"ds_deleted": moment().toISOString()} ).exec(function(err,update_data){
                if(err){
                    no_call_service.write_log(table_name,"D_die", input_params, who, log_type);
                    var return_data = no_call_service.add_biota_result( [], false, err.details, "");
                    resolve(return_data);
                }else{
                    no_call_service.write_log(table_name,"D_ok", input_params, who, log_type);
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
                var fill_array  = ["subject", "tricker", "time", "type"]; //必填欄位<輸入值>
                var nfill_array = ["subject_pk"]; //不可填欄位<輸入值>
                var cond_array = [];  //拿來當條件的欄位<欄位值>
                var check_fill_nfill = yield call_service.check_fill_nfill(input_params, fill_array, nfill_array);                
                
                if(check_fill_nfill == "ok"){
                    //輸入條件正確 修正資料ID內容
                    var r_array =  yield call_service.check_change_cond(input_params, change_obj, cond_array);
                    var final_data = yield Info_list_service.write_db( r_array[0], who ,input_params );
                    var back_data =  yield call_service.back_change_cond(final_data, change_obj);
                    resolve( back_data );
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
                var fill_array  = ["style"]; //必填欄位<輸入值>
                var nfill_array = []; //不可填欄位<輸入值>
                var cond_array = [];  //拿來當條件的欄位<欄位值>
                var check_fill_nfill = yield call_service.check_fill_nfill(input_params, fill_array, nfill_array);                
                
                if(check_fill_nfill == "ok"){
                    //輸入條件正確 修正資料ID內容
                    var r_array =  yield call_service.check_change_cond(input_params, change_obj, cond_array);
                    r_array[0].ds_deleted = {"$exists":false}; //補上刪除不可被查
                    var final_data = yield Info_list_service.find_R_db( r_array[0], who, input_params );
                    var back_data =  yield call_service.back_change_cond(final_data, change_obj);
                    resolve( back_data );
                }else{
                    //輸入條件有誤 直接回傳錯誤JSON
                    resolve( check_fill_nfill );
                }
            }).catch(function(err){
                console.log(table_name+"_third_routes_error_r1",err);
            });   
        });
    },
    //新增主function 通常須改上面的條件function 跟 catch
    update: function(input_params ,who){
        return new Promise(function(resolve, reject){
            co(function* () {                                                    
                var return_obj  = "";
                var fill_array  = ["subject_pk"] //必填欄位<輸入值>
                var nfill_array = []; //不可填欄位<輸入值>
                var cond_array = ["ds_subject_pk"];  //拿來當條件的欄位<欄位值>
                var check_fill_nfill = yield call_service.check_fill_nfill(input_params, fill_array, nfill_array);                
                
                if(check_fill_nfill == "ok"){
                    //輸入條件正確 修正資料ID內容
                    var r_array =  yield call_service.check_change_cond(input_params, change_obj, cond_array);
                    r_array[1].ds_deleted = {"$exists":false}; //補上刪除不可被查
                    var final_data = yield Info_list_service.update_db( r_array[1], r_array[0], who, input_params );
                    var back_data =  yield call_service.back_change_cond(final_data, change_obj);
                    resolve( back_data );
                }else{
                    //輸入條件有誤 直接回傳錯誤JSON
                    resolve( check_fill_nfill );
                }
            }).catch(function(err){
                console.log(table_name+"_third_routes_error_u",err);
            });   
        });
    },
    //新增主function 通常須改上面的條件function 跟 catch
    destroy: function(input_params ,who){
        return new Promise(function(resolve, reject){
            co(function* () {                                                    
                var return_obj  = "";
                var fill_array  = ["subject_pk"]; //必填欄位<輸入值>
                var nfill_array = []; //不可填欄位<輸入值>
                var cond_array = [];  //拿來當條件的欄位<欄位值>
                var check_fill_nfill = yield call_service.check_fill_nfill(input_params, fill_array, nfill_array);                
                
                if(check_fill_nfill == "ok"){
                    //輸入條件正確 修正資料ID內容
                    var r_array =  yield call_service.check_change_cond(input_params, change_obj, cond_array);
                    var final_data = yield Info_list_service.destroy_db( r_array[0], who, input_params );
                    var back_data =  yield call_service.back_change_cond(final_data, change_obj);
                    resolve( back_data );
                }else{
                    //輸入條件有誤 直接回傳錯誤JSON
                    resolve( check_fill_nfill );
                }
            }).catch(function(err){
                console.log(table_name+"_third_routes_error_u",err);
            });   
        });
    },
};

