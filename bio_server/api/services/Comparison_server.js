/*
var moment = require('moment');
var co = require('co');
var change_obj = {
    "minutiae": "f_minutiae",
    "pic"     : "f_pic_path",
    "id"      : "ds_human_pk",
    "bind_id" : "ds_bind_id",
    "nfc"     : "ds_nfc_tag_id",
    "CTime"   : "up_CTime"
}
var ffi = require('ffi');
var ref = require('ref'); 
var dllFM220api = ffi.Library("fm220api", {
	"FP_ConnectCaptureDriver": [ 'int', [ 'int' ] ],
	"FP_DisconnectCaptureDriver": ['int', ['int']],
	"FP_Diagnose": ['string', ['int']],
	"FP_CheckBlank": ['string', ['int']],
	"FP_CreateCaptureHandle": ['int', ['int']],
	"FP_DestroyCaptureHandle": ['int', ['int', 'int']],
	"FP_Capture": ['int', ['int', 'int']],
	"FP_CreateImageHandle": ['int', ['int', 'int', 'int']],
	"FP_DestroyImageHandle": ['int', ['int', 'int']],
	"FP_SaveImage": ['int', ['int', 'int', 'int', 'string']],
	"FP_GetImageQuality":['int', ['int']],
	"FP_Snap": ['int', ['int']],
	"FP_GetTemplate": ['int', ['int', 'pointer', 'int', 'int']],
	"FP_GetPrimaryCode": ['int', ['int', 'pointer']],
	"FP_GetImage": ['int', ['int', 'int']],
	"FP_CreateEnrollHandle": ['int', ['int', 'int']],
	"FP_DestroyEnrollHandle": ['int', ['int', 'int']],
	//"FP_GetISOImage": ['int', ['int', 'int', 'int', 'pointer']],
	"FP_SaveISOImage": ['int', ['int', 'int', 'int', 'string', 'int', 'int']],
	"FP_SaveWsqFile": ['int', ['int', 'string', 'int']],
	"FP_LoadM1minutia": ['int', ['int', 'string', 'pointer']],
	//"FP_SaveM1Minutia": ['int', ['int', 'string', 'pointer']],
	"FP_LoadISOminutia": ['int', ['int', 'string', 'pointer']],
	// "FP_SaveISOMinutia": ['int', ['int', 'string', 'pointer']],
	"FP_CodeMatchEx": ['int', ['int', 'pointer', 'pointer', 'int', 'pointer']],
	"FP_CodeMatch": ['int', ['int', 'pointer', 'pointer', 'int']],
	"FP_ImageMatchEx": ['int', ['int', 'pointer', 'int', 'pointer']],
	"FP_ImageMatch": ['int', ['int', 'pointer', 'int']],
	"FP_TemplateSelect": ['int', ['int', 'int', 'pointer', 'pointer', 'pointer', 'pointer', 'pointer']],
	"FP_EnrollEx": ['int', ['int', 'int', 'pointer', 'pointer', 'int']],
	"FP_Enroll": ['int', ['int', 'int', 'pointer', 'pointer']]
});
    var table_name  = "Comparison_server";
    var log_type = "human";
//此處出現的都是co要用的
module.exports = {    
    //比對指紋用
    check_minu: function( minu1, minu2 ){ 
        return new Promise(function(resolve, reject){
            co(function* () {
                //指紋機讀取特徵碼，Buffer(512)
                var a_minu = new Buffer(minu1, 'hex');
                var b_minu = new Buffer(minu2, 'hex');

                // score buffer，Buffer(4)，超過會出問題
                var compareScore1 = new Buffer(4);

                // 比對
                var codeMatchEx1 = dllFM220api.FP_CodeMatchEx(null, a_minu, b_minu, 5, compareScore1);
                var score1 = parseInt(compareScore1.toString('hex').match(/.{1,2}/g).reverse().join(""));
                var return_array = [codeMatchEx1,score1];
                resolve(return_array);
            }).catch(function(err){
                console.log("check_minu_error",err);
            });
        });             
    },
    //找出對應者
    check_man: function( minu_array, iminu ){ 
        return new Promise(function(resolve, reject){
            co(function* () {
                //先撈出全部資料 再逐一比對哪一個指紋才是正確的
                var chman = 0;
                for(var key in minu_array){
                    var check_result = yield Comparison_server.check_minu(minu_array[key], iminu);
                    if(check_result[0]==0){
                        chman++;
                        var get_minu =  minu_array[key];
                        var minu_point =  check_result[1];
                    }
                };
                if(chman>0){
                    F_linked.findOne({"f_minutiae":get_minu}).exec(function(err,second_data){
                        second_data.minu_point = minu_point;
                        resolve(second_data);                            
                    });
                }else{
                    resolve("not found");                            
                }
            }).catch(function(err){
                console.log("catch_error",err);
            });
        });             
    },
    //寫入使用指紋紀錄DB
    write_log: function( input_params, who, wheretype ){ 
        return new Promise(function(resolve, reject){
            Up_f.create( input_params ).exec(function(err,return_data){
                if(err){
                    no_call_service.write_log(table_name,wheretype+"_die", input_params, who, log_type);
                    reject( err );
                }else{
                    no_call_service.write_log(table_name,wheretype+"_ok", input_params, who, log_type);
                    resolve(return_data);                                                     
                }
            });
        });             
    },
    //Ri的結果
    find_Ri_db: function( search_cond, who, input_params ){
        return new Promise(function(resolve, reject){
            co(function* () {
                var Ri_begin = moment();
                //最後寫入up_f的objcet
                var iup_f = {
                    f_minutiae : search_cond.f_minutiae,
                }                
                var f_result = yield call_service.find_flinked({}); //查所有指紋
                var man_result = yield Comparison_server.check_man(f_result, search_cond.f_minutiae); //查有沒有指紋符合
                if(!man_result){
                    no_call_service.write_log(table_name,"Ri_no_data", input_params, who, log_type);
                    iup_f.up_is_success = "false";
                    iup_f.up_server_action = "false";
                    var write_up_f = yield Comparison_server.write_log(iup_f, who, "Ri");                    
                    resolve({human:[]});
                } //查無此人的回應

                var search_human_cond = {
                    ds_human_pk : man_result.ds_human_pk
                };
                var human_result = yield call_service.find_human(search_human_cond); //找人員資料
                if(!human_result){
                    no_call_service.write_log(table_name,"Ri_no_data2", input_params, who, log_type);
                    iup_f.up_is_success = "false";
                    iup_f.up_server_action = "false";
                    var write_up_f = yield Comparison_server.write_log(iup_f, who, "Ri");                    
                    resolve({human:[]});
                } //查無此人的回應
                
                
                var Ri_end = moment();
                var Ri_time = (Ri_end.diff(Ri_begin))/1000;
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
                            id: man_result.f_linked_pk,
                            which: man_result.f_which_one,
                            pic: man_result.f_pic_path,
                        }
                    }],
                    STime: Ri_begin.toISOString(),
                    CTime: search_cond.up_CTime,
                    MScore: man_result.minu_point,
                    MTime: Ri_time
                }
                    //找到人開始寫入相關資訊
                    iup_f.f_pic_path = "";
                    iup_f.ds_human_pk = human_result.ds_human_pk;
                    iup_f.ds_bind_id = human_result.ds_bind_id;
                    iup_f.ds_nfc_tag_id = "";
                    iup_f.up_STime = Ri_begin.toISOString();
                    iup_f.up_CTime = search_cond.up_CTime;
                    iup_f.up_MScore = man_result.minu_point;
                    iup_f.up_MTime = Ri_time;
                    iup_f.up_is_success = "true";
                    iup_f.up_server_action = "true";
                    var write_up_f = yield Comparison_server.write_log(iup_f, who, "Ri");

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
                var fill_array  = ["minutiae","CTime"]; //必填欄位<輸入值>
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
                no_call_service.write_log(table_name,"Ri_err", input_params, who, log_type);
                var return_data = no_call_service.add_biota_result( {}, false, err.details, "");
                resolve(return_data);
            });   
        });
    },
    
    find_Rv_db: function( search_cond, who, input_params ){
        return new Promise(function(resolve, reject){
            co(function* () {
                var Rv_begin = moment();          
                //最後寫入up_f的objcet
                var iup_f = {
                    f_minutiae : search_cond.f_minutiae,
                }                      
                var human_search_cond = yield call_service.goclone(search_cond);
                delete human_search_cond["f_minutiae"];
                delete human_search_cond["f_pic_path"];
                delete human_search_cond["ds_bind_id"];
                delete human_search_cond["ds_nfc_tag_id"];
                delete human_search_cond["up_CTime"];
                
                var f_result = yield call_service.find_flinked(human_search_cond);
                
                var man_result = yield Comparison_server.check_man(f_result, search_cond.f_minutiae); //查有沒有指紋符合
                if(!man_result){
                    no_call_service.write_log(table_name,"Rv_no_data", input_params, who, log_type);
                    iup_f.up_is_success = "false";
                    iup_f.up_server_action = "false";
                    var write_up_f = yield Comparison_server.write_log(iup_f, who, "Rv");    
                    resolve({human:[]});
                } //查無此人的回應
                
                if(man_result.ds_bind_id != human_search_cond.ds_bind_id){
                    no_call_service.write_log(table_name,"Rv_no_data2", input_params, who, log_type);
                    iup_f.up_is_success = "false";
                    iup_f.up_server_action = "false";
                    var write_up_f = yield Comparison_server.write_log(iup_f, who, "Rv");                        
                    resolve({human:[]}); //人員ID不同的情況
                }
                
                var human_result = yield call_service.find_human(human_search_cond); //找人員資料
                if(!human_result){
                    no_call_service.write_log(table_name,"Rv_no_data3", input_params, who, log_type);
                    iup_f.up_is_success = "false";
                    iup_f.up_server_action = "false";
                    var write_up_f = yield Comparison_server.write_log(iup_f, who, "Rv");                        
                    resolve({human:[]});
                } //查無此人的回應
                var Rv_end = moment();
                var Rv_time = (Rv_end.diff(Rv_begin))/1000;
                
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
                            id: man_result.f_linked_pk,
                            which: man_result.f_which_one,
                            pic: man_result.f_pic_path,
                        },
                        STime: Rv_begin,
                        CTime: search_cond.up_CTime,
                        MScore: man_result.minu_point,
                        MTime: Rv_time
                    }],                        
                }                     
                    //找到人開始寫入相關資訊
                    iup_f.f_pic_path = "";
                    iup_f.ds_human_pk = human_result.ds_human_pk;
                    iup_f.ds_bind_id = human_result.ds_bind_id;
                    iup_f.ds_nfc_tag_id = "";
                    iup_f.up_STime = Rv_begin.toISOString();
                    iup_f.up_CTime = search_cond.up_CTime;
                    iup_f.up_MScore = man_result.minu_point;
                    iup_f.up_MTime = Rv_time;
                    iup_f.up_is_success = "true";
                    iup_f.up_server_action = "true";
                    var write_up_f = yield Comparison_server.write_log(iup_f, who, "Rv");
                    
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
                var fill_array  = ["minutiae","id","bind_id","CTime"]; //必填欄位<輸入值>
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
                no_call_service.write_log(table_name,"Rv_err", input_params, who, log_type);
                var return_data = no_call_service.add_biota_result( {}, false, err.details, "");
                resolve(return_data);
            });   
        });
    },
};

    */
