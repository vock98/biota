var moment = require('moment');
var co = require('co');
var change_obj = {
    "id"         : "ds_human_pk",
    "birthday"   : "ds_birthday",
    "gender"     : "ds_gender",
    "bloodtype"  : "ds_bloodtype",
    "job"        : "ds_job",
    "name"       : "ds_name",
    "bind_id"    : "ds_bind_id",
    "is_manager" : "ds_is_manager"
}
    var table_name = "Ds_human";
    var log_type = "human";
//此處出現的都是co要用的
module.exports = {
    //寫資料 通常只須改DB_NAME
    write_db: function( create_cond, who ,input_params ){
        return new Promise(function(resolve, reject){
            Ds_human.create(create_cond).exec(function(err,create_data){
                if(err){
                    no_call_service.write_log(table_name,"C_die", input_params, who, log_type);
                    var return_data = no_call_service.add_biota_result( {}, false, err.details, "");
                    resolve(return_data);
                }else{
                    no_call_service.write_log(table_name,"C_ok", input_params, who, log_type);
                    var h_obj={
                        ds_human_pk: create_data.ds_human_pk,
                        ds_name: create_data.ds_name,
                    }
                    var return_data = no_call_service.add_biota_result(h_obj, true, "", "");
                    resolve(return_data);                                                     
                }           
            })   
        });
    },
    //查詢資料 通常只須改DB_NAME
    find_R1_db: function( search_cond, who, input_params ){
        return new Promise(function(resolve, reject){
            Ds_human.find( search_cond ).exec(function(err,find_data){
                if(err){
                    no_call_service.write_log(table_name,"R1_die", input_params, who, log_type);
                    var return_data = no_call_service.add_biota_result( {}, false, err.details, "");
                    resolve(return_data);
                }else{
                    //撈取符合的使用者資料
                    if( _.isEmpty(find_data) ){
                        //查無資料
                        no_call_service.write_log(table_name,"R1_no_data", input_params, who, log_type);
                        var return_data = no_call_service.add_biota_result({}, true, "查無資料", "查無資料");
                        resolve(return_data);       
                    }else{
                        no_call_service.write_log(table_name,"R1_ok", input_params, who, log_type);                        
                        var return_data = no_call_service.add_biota_result(find_data, true, "", "");
                        resolve(return_data);                                   
                    }                        
                }           
            })   
        });
    },
    //查詢資料 通常只須改DB_NAME
    find_R2_db: function( search_cond, who, input_params ){
        return new Promise(function(resolve, reject){
            Ds_human.findOne( search_cond ).exec(function(err,find_data){
                if(err){
                    no_call_service.write_log(table_name,"R2_die", input_params, who, log_type);
                    var return_data = no_call_service.add_biota_result( {}, false, err.details, "");
                    resolve(return_data);
                }else{
                    if( _.isEmpty(find_data) ){
                        //查無資料
                        no_call_service.write_log(table_name,"R2_no_data", input_params, who, log_type);
                        var return_data = no_call_service.add_biota_result({}, true, "查無資料", "查無資料");
                        resolve(return_data);       
                    }else{
                        no_call_service.write_log(table_name,"R2_ok", input_params, who, log_type);
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
            Ds_human.update( search_cond, update_cond ).exec(function(err,update_data){
                if(err){
                    no_call_service.write_log(table_name,"U_die", input_params, who, log_type);
                    var return_data = no_call_service.add_biota_result( {}, false, err.details, "");
                    resolve(return_data);
                }else{
                    //撈取符合的使用者資料
                    if( _.isEmpty(update_data) ){
                        //查無資料
                        no_call_service.write_log(table_name,"U_no_data", input_params, who, log_type);
                        var return_data = no_call_service.add_biota_result({}, true, "查無資料", "查無資料");
                        resolve(return_data);       
                    }else{
                        //為了要populate重撈一次
                        Ds_human.findOne( {ds_human_pk: update_data[0].ds_human_pk} ).exec(function(err,find_data){
                            if(err){
                                no_call_service.write_log(table_name,"U_die", input_params, who, log_type);
                                var return_data = no_call_service.add_biota_result( {}, false, err.details, "");
                                resolve(return_data);
                            }else{
                                //撈取符合的使用者資料
                                no_call_service.write_log(table_name,"U_ok", input_params, who, log_type);
                                var return_data = no_call_service.add_biota_result( find_data, true, "", "");
                                resolve(return_data);                                                       
                            }           
                        })                     
                    }
                }
            })
        });
    },
    //刪除資料 通常只須改DB_NAME
    destroy_db: function( delete_cond, who ,input_params){
        return new Promise(function(resolve, reject){
            Ds_human.update( delete_cond ,{"ds_deleted": moment().toISOString()} ).exec(function(err,update_data){
                if(err){
                    no_call_service.write_log(table_name,"D_die", input_params, who, log_type);
                    var return_data = no_call_service.add_biota_result( {}, false, err.details, "");
                    resolve(return_data);
                }else{
                    no_call_service.write_log(table_name,"D_ok", input_params, who, log_type);
                    var return_data = no_call_service.add_biota_result( {}, true, "", "");
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
                var fill_array  = ["name"]; //必填欄位<輸入值>
                var nfill_array = ["id"]; //不可填欄位<輸入值>
                var cond_array = [];  //拿來當條件的欄位<欄位值>
                var check_fill_nfill = yield call_service.check_fill_nfill(input_params, fill_array, nfill_array);                
                
                if(check_fill_nfill == "ok"){
                    //輸入條件正確 修正資料ID內容
                    var r_array =  yield call_service.check_change_cond(input_params, change_obj, cond_array);
                    var final_data = yield human_service.write_db( r_array[0], who, input_params );
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
    search1: function(input_params ,who){
        return new Promise(function(resolve, reject){
            co(function* () {                                                    
                var return_obj  = "";
                var fill_array  = []; //必填欄位<輸入值>
                var nfill_array = ["id"]; //不可填欄位<輸入值>
                var cond_array = [];  //拿來當條件的欄位<欄位值>
                var check_fill_nfill = yield call_service.check_fill_nfill(input_params, fill_array, nfill_array);                
                
                if(check_fill_nfill == "ok"){
                    //輸入條件正確 修正資料ID內容
                    var r_array =  yield call_service.check_change_cond(input_params, change_obj, cond_array);
                    r_array[0].ds_deleted = {"$exists":false}; //補上刪除不可被查
                    var final_data = yield human_service.find_R1_db( r_array[0], who, input_params );
                    //撈出來的資料要補上NFC跟F資料
                    var back_data = [];
                    for(var key in final_data["data"]){
                        var one_obj = final_data["data"][key];
                        var nfc_data = yield human_service.find_nfc(one_obj.ds_human_pk);
                        var flinked_data = yield human_service.find_flinked(one_obj.ds_human_pk);
                        var r_obj ={
                            id: one_obj.ds_human_pk,
                            name: one_obj.ds_name,
                            nfc: nfc_data,
                            f: flinked_data,
                        }
                        back_data.push(r_obj);
                    }                
                    var return_data = no_call_service.add_biota_result(back_data, true, "", "");
                    resolve( return_data );
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
    search2: function(input_params ,who){
        return new Promise(function(resolve, reject){
            co(function* () {                                                    
                var return_obj  = "";
                var fill_array  = ["id"]; //必填欄位<輸入值>
                var nfill_array = ["birthday", "gender", "bloodtype", "job", "name", "bind_id"]; //不可填欄位<輸入值>
                var cond_array = ["ds_human_pk"];  //拿來當條件的欄位<欄位值>
                var check_fill_nfill = yield call_service.check_fill_nfill(input_params, fill_array, nfill_array);                
                
                if(check_fill_nfill == "ok"){
                    //輸入條件正確 修正資料ID內容
                    var r_array =  yield call_service.check_change_cond(input_params, change_obj, cond_array);
                    r_array[0].ds_deleted = {"$exists":false}; //補上刪除不可被查
                    var final_data = yield human_service.find_R2_db( r_array[0], who, input_params );
                    var back_data =  yield call_service.back_change_cond(final_data, change_obj);
                    resolve( back_data );
                }else{
                    //輸入條件有誤 直接回傳錯誤JSON
                    resolve( check_fill_nfill );
                }
            }).catch(function(err){
                console.log(table_name+"_third_routes_error_r2",err);
            });   
        });
    },
    //新增主function 通常須改上面的條件function 跟 catch
    update: function(input_params ,who){
        return new Promise(function(resolve, reject){
            co(function* () {                                                    
                var return_obj  = "";
                var fill_array  = ["id"]; //必填欄位<輸入值>
                var nfill_array = []; //不可填欄位<輸入值>
                var cond_array = ["ds_human_pk"];  //拿來當條件的欄位<欄位值>
                var check_fill_nfill = yield call_service.check_fill_nfill(input_params, fill_array, nfill_array);                
                
                if(check_fill_nfill == "ok"){
                    //輸入條件正確 修正資料ID內容
                    var r_array =  yield call_service.check_change_cond(input_params, change_obj, cond_array);
                    r_array[1].ds_deleted = {"$exists":false}; //補上刪除不可被查
                    var final_data = yield human_service.update_db( r_array[1], r_array[0], who, input_params );
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
                var fill_array  = ["id", "name"]; //必填欄位<輸入值>
                var nfill_array = ["birthday", "gender", "bloodtype", "job"]; //不可填欄位<輸入值>
                var cond_array = [];  //拿來當條件的欄位<欄位值>
                var check_fill_nfill = yield call_service.check_fill_nfill(input_params, fill_array, nfill_array);                
                
                if(check_fill_nfill == "ok"){
                    //輸入條件正確 修正資料ID內容
                    var r_array =  yield call_service.check_change_cond(input_params, change_obj, cond_array);
                    var final_data = yield human_service.destroy_db( r_array[0], who, input_params );
                    var back_data =  yield call_service.back_change_cond(final_data, change_obj);
                    resolve( back_data );
                }else{
                    //輸入條件有誤 直接回傳錯誤JSON
                    resolve( check_fill_nfill );
                }
            }).catch(function(err){
                console.log(table_name+"_third_routes_error_d",err);
            });   
        });
    },
    //撈出nfc對應資料
    find_nfc: function( human_id ){
        return new Promise(function(resolve, reject){
            Ds_nfc.find({ds_human_pk:human_id}).exec(function(err,find_data){
                if(err){
                    reject(err);
                }else{
                    var return_array = _.map(find_data, function(num){
                           return {id:num.ds_nfc_tag_id}
                        });
                    resolve( return_array );
                }           
            })   
        });
    },
    //撈出f_linked對應資料
    find_flinked: function( human_id ){
        return new Promise(function(resolve, reject){
            F_linked.find({ds_human_pk:human_id}).exec(function(err,find_data){
                if(err){
                    reject(err);
                }else{
                    var return_array = _.map(find_data, function(num){
                           return {id: num.f_linked_pk, which:num.f_which_one, pic:num.f_pic_path}
                        });
                    resolve( return_array );
                }           
            })   
        });
    },
};

