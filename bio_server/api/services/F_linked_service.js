var moment = require('moment');
var co = require('co');
var change_obj = {
    "id"       : "ds_human_pk",
    "bind_id"  : "ds_bind_id",
    "f_id"     : "f_linked_pk",
    "which"    : "f_which_one",
    "pic"      : "f_pic_path",
    "minutiae" : "f_minutiae",
}
    var table_name = "F_linked";
    var log_type = "human";
//此處出現的都是co要用的
module.exports = {
    //寫資料 通常只須改DB_NAME
    write_db: function( create_cond, who ,input_params ){
        return new Promise(function(resolve, reject){
            F_linked.create(create_cond).exec(function(err,create_data){
                if(err){
                    no_call_service.write_log(table_name,"C_die", input_params, who, log_type);
                    reject( err );
                }else{
                    no_call_service.write_log(table_name,"C_ok", input_params, who, log_type);
                    //回傳human資訊 方便取用human R1
                    Ds_human.findOne({ds_human_pk:create_cond.ds_human_pk}).exec(function(err, human_Data){
                        if(err){                            
                            reject( err );
                        }else{
                            resolve( human_Data );
                        }
                    })                                                   
                }           
            })   
        });
    },
    //刪除資料 通常只須改DB_NAME
    destroy_db: function( delete_cond, who ,input_params){
        return new Promise(function(resolve, reject){
            F_linked.destroy( delete_cond ).exec(function(err){
                if(err){
                    no_call_service.write_log(table_name,"D_die", input_params, who, log_type);
                    var return_data = no_call_service.add_biota_result( {}, false, err.details, "");
                    resolve(return_data);
                }else{
                    no_call_service.write_log(table_name,"D_ok", input_params, who, log_type);
                    Ds_human.findOne({ds_human_pk:delete_cond.ds_human_pk}).exec(function(err, human_Data){
                        if(err){                            
                            reject( err );
                        }else{
                            resolve( human_Data );
                        }
                    })
                }
            }) 
        });
    },
     //檢查是否有人
    check_human: function( input_cond, who ){
        return new Promise(function(resolve, reject){
            Ds_human.find(input_cond).exec(function(err, human_Data){
                if(err){                            
                    resolve( "error" );                     
                }else{
                    resolve( human_Data.length );
                }
            })   
        });
    },
    //新增主function 通常須改上面的條件function 跟 catch
    create: function(input_params ,who){
        return new Promise(function(resolve, reject){
            co(function* () {                                                    
                var return_obj  = "";
                var fill_array  = ["id","bind_id","which","pic","minutiae"]; //必填欄位<輸入值>
                var nfill_array = ["f_id"]; //不可填欄位<輸入值>
                var cond_array = ["ds_human_pk","ds_bind_id"];  //拿來當條件的欄位<欄位值>
                var check_fill_nfill = yield call_service.check_fill_nfill(input_params, fill_array, nfill_array);                
                
                if(check_fill_nfill == "ok"){
                    //輸入條件正確 修正資料ID內容
                    var r_array =  yield call_service.check_change_cond(input_params, change_obj, cond_array);
                    delete r_array[0].ds_bind_id;
                    //0是 flink內容 1是human內容
                    var human_count = yield F_linked_service.check_human( r_array[1], who );
                    if(human_count ==1){                        
                        var final_data = yield F_linked_service.write_db( r_array[0], who, input_params );
                        //為了要呈現R1配合human R1需求條件
                        var R1_obj ={
                            birthday : moment(final_data.ds_birthday).toISOString(),
                            gender : final_data.ds_gender,
                            bloodtype : final_data.ds_bloodtype,
                            job : final_data.ds_job,
                            name : final_data.ds_name,
                            bind_id : final_data.ds_bind_id,
                        }
                        var back_data =  yield human_service.search1(R1_obj, who );                                                                            
                    }else{
                        //沒有人或者超過人都是人員資料錯誤
                        console.log("human_count",human_count);
                        var back_data = no_call_service.add_biota_result( {}, false, "", "人員資料錯誤");
                    }
                    resolve( back_data );
                }else{
                    //輸入條件有誤 直接回傳錯誤JSON
                    resolve( check_fill_nfill );
                }
            }).catch(function(err){
                console.log(table_name+"_third_routes_error_c",err);
                resolve( no_call_service.add_biota_result( {}, false, err.details, "人員資料錯誤") );
            });   
        });
    },
    //新增主function 通常須改上面的條件function 跟 catch
    destroy: function(input_params ,who){
        return new Promise(function(resolve, reject){
            co(function* () {                                                    
                var return_obj  = "";
                var fill_array  = ["id","f_id"]; //必填欄位<輸入值>
                var nfill_array = []; //不可填欄位<輸入值>
                var cond_array = ["ds_human_pk","ds_bind_id"];  //拿來當條件的欄位<欄位值>
                var check_fill_nfill = yield call_service.check_fill_nfill(input_params, fill_array, nfill_array);                
                
                if(check_fill_nfill == "ok"){
                    //輸入條件正確 修正資料ID內容
                    var r_array =  yield call_service.check_change_cond(input_params, change_obj, cond_array);
                    delete r_array[0].ds_bind_id;
                    //0是 flink內容 1是human內容
                    var human_count = yield F_linked_service.check_human( r_array[1], who );
                    if(human_count ==1){
                        var final_data = yield F_linked_service.destroy_db( r_array[0], who, input_params );
                                               //為了要呈現R1配合human R1需求條件
                        var R1_obj ={
                            birthday : moment(final_data.ds_birthday).toISOString(),
                            gender : final_data.ds_gender,
                            bloodtype : final_data.ds_bloodtype,
                            job : final_data.ds_job,
                            name : final_data.ds_name,
                            bind_id : final_data.ds_bind_id,
                        }
                        var back_data =  yield human_service.search1(R1_obj, who );
                    }else{
                        //沒有人或者超過人都是人員資料錯誤
                        var back_data = no_call_service.add_biota_result( {}, false, "", "人員資料錯誤");
                    }
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
};

