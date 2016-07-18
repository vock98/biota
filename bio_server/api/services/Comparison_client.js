var moment = require('moment');
var co = require('co');
var change_obj = {
    "minutiae": "f_minutiae",
    "pic"     : "f_pic_path",
    "id"      : "ds_human_pk",
    "bind_id" : "ds_bind_id",
    "nfc"     : "ds_nfc_tag_id",  
    "STime"   : "up_STime",   
    "CTime"   : "up_CTime",   
    "MScore"  : "up_MScore",   
    "MTime"   : "up_MTime",   
    "is_success"   : "up_is_success",   
    "client_action"   : "up_client_action",   
}
    var table_name = "Comparison_client";
    var log_type = "human";
//此處出現的都是co要用的
module.exports = {    
    find_Ri_db: function( search_cond, who, input_params ){
        return new Promise(function(resolve, reject){
            co(function* () {          
                var copy_cond = yield call_service.goclone(search_cond);
                Up_f.create(search_cond).exec(function(err,create_data){
                    if(err){
                        no_call_service.write_log(table_name,"Ri_die", input_params, who, log_type);
                        reject( err );
                    }else{
                        no_call_service.write_log(table_name,"Ri_ok", input_params, who, log_type);
                        //回傳human資訊 方便取用human R1
                        var return_obj ={
                            recordtime : create_data.createdAt,
                            server_action : true,
                        }
                        resolve( return_obj );                                                  
                    }           
                }) 
            }).catch(function(err){
                reject(err);
            });
        });
    },        
    //新增主function 通常須改上面的條件function 跟 catch
    Ri: function(input_params ,who){
        return new Promise(function(resolve, reject){
            co(function* () {                                                    
                var return_obj  = "";
                var fill_array  = ["minutiae", "STime", "CTime", "MScore", "MTime", "is_success", "client_action"]; //必填欄位<輸入值>
                var nfill_array = []; //不可填欄位<輸入值>
                var cond_array = [];  //拿來當條件的欄位<欄位值>
                var check_fill_nfill = yield call_service.check_fill_nfill(input_params, fill_array, nfill_array);                
                
                if(check_fill_nfill == "ok"){
                    //輸入條件正確 修正資料ID內容
                    var r_array =  yield call_service.check_change_cond(input_params, change_obj, cond_array);
                    var final_data = yield Comparison_client.find_Ri_db( r_array[0], who, input_params );
                    var return_data = no_call_service.add_biota_result( final_data, true, "", "");
                    resolve( return_data );
                }else{
                    //輸入條件有誤 直接回傳錯誤JSON
                    resolve( check_fill_nfill );
                }
            }).catch(function(err){
                console.log(table_name+"_third_routes_error_r1",err);
                no_call_service.write_log(table_name,"Ri_err", input_params, who, log_type);
                var return_data = no_call_service.add_biota_result( {}, false, err.details, "");
                resolve(return_data);
            });   
        });
    },  
    
    find_Rv_db: function( search_cond, who, input_params ){
        return new Promise(function(resolve, reject){
            co(function* () {
                Up_f.create(search_cond).exec(function(err,create_data){
                    if(err){
                        no_call_service.write_log(table_name,"Rv_die", input_params, who, log_type);
                        reject( err );
                    }else{
                        no_call_service.write_log(table_name,"Rv_ok", input_params, who, log_type);
                        //回傳human資訊 方便取用human R1
                        var return_obj ={
                            recordtime : create_data.createdAt,
                            server_action : true,
                        }
                        resolve( return_obj );                                                  
                    }           
                }) 
            }).catch(function(err){
                reject(err);
            });
        });
    },        
    //新增主function 通常須改上面的條件function 跟 catch
    Rv: function(input_params ,who){
        return new Promise(function(resolve, reject){
            co(function* () {                                                    
                var return_obj  = "";
                var fill_array  = ["id","bind_id","minutiae", "STime", "CTime", "MScore", "MTime", "is_success", "client_action"]; //必填欄位<輸入值>
                var nfill_array = []; //不可填欄位<輸入值>
                var cond_array = [];  //拿來當條件的欄位<欄位值>
                var check_fill_nfill = yield call_service.check_fill_nfill(input_params, fill_array, nfill_array);                
                
                if(check_fill_nfill == "ok"){
                    //輸入條件正確 修正資料ID內容
                    var r_array =  yield call_service.check_change_cond(input_params, change_obj, cond_array);
                    var final_data = yield Comparison_client.find_Rv_db( r_array[0], who, input_params );
                    //在此組成所需要的資訊
                    if(_.isEmpty(final_data)){
                        var return_data = no_call_service.add_biota_result( final_data, true, "查無人員資料", "查無人員資料");
                    }else{
                        var return_data = no_call_service.add_biota_result( final_data, true, "", "");
                    }
                    resolve( return_data );
                }else{
                    //輸入條件有誤 直接回傳錯誤JSON
                    resolve( check_fill_nfill );
                }
            }).catch(function(err){
                console.log(table_name+"_third_routes_error_r1",err);
                no_call_service.write_log(table_name,"Rv_err", input_params, who, log_type);
                var return_data = no_call_service.add_biota_result( {}, false, err.details, "");
                resolve(return_data);
            });   
        });
    },
    
};

