var moment = require('moment');
var co = require('co');
var change_obj = {
    "minutiae": "f_minutiae",
    "pic"     : "f_pic_path",
    "id"      : "ds_human_pk",
    "bind_id" : "ds_bind_id",
    "nfc"     : "ds_nfc_tag_id"
}
    var table_name = "Comparison_server";
    var log_type = "human";
//此處出現的都是co要用的
module.exports = {    
    find_Ri_db: function( search_cond, who, input_params ){
        return new Promise(function(resolve, reject){
            co(function* () {                                                    
                var f_result = yield call_service.find_flinked(search_cond); //查有沒有指紋
                if(!f_result){resolve({human:[]});} //查無此人的回應
                
                var search_human_cond = {
                    ds_human_pk : f_result.ds_human_pk
                };
                var human_result = yield call_service.find_human(search_human_cond); //找人員資料
                if(!human_result){resolve({human:[]});} //查無此人的回應
                
                var final_obj={
                    human:[{
                        id  : human_result.ds_human_pk,
                        name: human_result.ds_name,
                        birthday: human_result.ds_birthday,
                        gender: human_result.ds_gender,
                        bloodtype: human_result.ds_bloodtype,
                        job: human_result.ds_job,
                        bind_id: human_result.ds_bind_id,
                        f:{
                            id: f_result.f_linked_pk,
                            which: f_result.f_which_one,
                            pic: f_result.f_pic_path,
                        }
                    }],                        
                }                                            
                resolve(final_obj);
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
                var fill_array  = ["minutiae"]; //必填欄位<輸入值>
                var nfill_array = ["id","bind_id","nfc"]; //不可填欄位<輸入值>
                var cond_array = [];  //拿來當條件的欄位<欄位值>
                var check_fill_nfill = yield call_service.check_fill_nfill(input_params, fill_array, nfill_array);                
                
                if(check_fill_nfill == "ok"){
                    //輸入條件正確 修正資料ID內容
                    var r_array =  yield call_service.check_change_cond(input_params, change_obj, cond_array);
                    var final_data = yield Comparison_server.find_Ri_db( r_array[0], who, input_params );
                    //在此組成所需要的資訊
                    var return_data = no_call_service.add_biota_result( final_data, true, "", "");
                    resolve( return_data );
                }else{
                    //輸入條件有誤 直接回傳錯誤JSON
                    resolve( check_fill_nfill );
                }
            }).catch(function(err){
                console.log(table_name+"_third_routes_error_r1",err);
                var return_data = no_call_service.add_biota_result( {}, false, err.details, "");
                resolve(return_data);
            });   
        });
    },
    
    find_Rv_db: function( search_cond, who, input_params ){
        return new Promise(function(resolve, reject){
            co(function* () {
                //製作非refernce的obj
                function goclone(source) {
                    if (Object.prototype.toString.call(source) === '[object Array]') {
                        var clone = [];
                        for (var i=0; i<source.length; i++) {
                            clone[i] = goclone(source[i]);
                        }
                        return clone;
                    } else if (typeof(source)=="object") {
                        var clone = {};
                        for (var prop in source) {
                            if (source.hasOwnProperty(prop)) {
                                clone[prop] = goclone(source[prop]);
                            }
                        }
                        return clone;
                    } else {
                        return source;
                    }
                }
                
                
                var human_search_cond = goclone(search_cond);
                delete human_search_cond["f_minutiae"];
                delete human_search_cond["f_pic_path"];
                
                var f_search_cond = goclone(search_cond);
                delete f_search_cond["ds_human_pk"];
                delete f_search_cond["ds_bind_id"];
                delete f_search_cond["ds_nfc_tag_id"];
                var f_result = yield call_service.find_flinked(f_search_cond); //查有沒有指紋
                if(!f_result){resolve({human:[]});} //查無此人的回應
                if(f_result.ds_human_pk != human_search_cond.ds_human_pk){
                    resolve({human:[]}); //人員ID不同的情況
                }
                var human_result = yield call_service.find_human(human_search_cond); //找人員資料
                if(!human_result){resolve({human:[]});} //查無此人的回應
                var final_obj={
                    human:[{
                        id  : human_result.ds_human_pk,
                        name: human_result.ds_name,
                        birthday: human_result.ds_birthday,
                        gender: human_result.ds_gender,
                        bloodtype: human_result.ds_bloodtype,
                        job: human_result.ds_job,
                        bind_id: human_result.ds_bind_id,
                        f:{
                            id: f_result.f_linked_pk,
                            which: f_result.f_which_one,
                            pic: f_result.f_pic_path,
                        }
                    }],                        
                }                                             
                resolve(final_obj);
                
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
                var fill_array  = ["minutiae","id","bind_id"]; //必填欄位<輸入值>
                var nfill_array = []; //不可填欄位<輸入值>
                var cond_array = [];  //拿來當條件的欄位<欄位值>
                var check_fill_nfill = yield call_service.check_fill_nfill(input_params, fill_array, nfill_array);                
                
                if(check_fill_nfill == "ok"){
                    //輸入條件正確 修正資料ID內容
                    var r_array =  yield call_service.check_change_cond(input_params, change_obj, cond_array);
                    var final_data = yield Comparison_server.find_Rv_db( r_array[0], who, input_params );
                    //在此組成所需要的資訊
                    var return_data = no_call_service.add_biota_result( final_data, true, "", "");
                    resolve( return_data );
                }else{
                    //輸入條件有誤 直接回傳錯誤JSON
                    resolve( check_fill_nfill );
                }
            }).catch(function(err){
                console.log(table_name+"_third_routes_error_r1",err);
                var return_data = no_call_service.add_biota_result( {}, false, err.details, "");
                resolve(return_data);
            });   
        });
    },
    
};

