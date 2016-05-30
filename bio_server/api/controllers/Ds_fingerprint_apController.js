/**
 * Ds_fingerprint_apController
 *
 * @description :: Server-side logic for managing ds_fingerprint_aps
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

    var table_name = "Ds_fingerprint_ap";
    var log_type = "device";
module.exports = {
	/*
        用途 : 查看內容
        輸入 : 無
        輸出 : 整個DB
        快速連結 : http://localhost:1337/api/Ds_fingerprint_ap/find
    */
	find: function(req, res) {
        Ds_fingerprint_ap.find().exec(function(err,find_data){
                if(err){
                    no_call_service.write_log(table_name,"R_all_die", err, req.session.id, log_type);
                    return res.json({error:1001});
                }else{
                    no_call_service.write_log(table_name,"R_all", "",req.session.id, log_type);
                    return res.json(find_data);                               
                }
        })
    },
    /*
        用途 : 創建設備
        輸入 : ["ds_ap_id", "ds_platform_type", "ds_device_type"]
        輸出 : 創建object or error
        不可輸入值 : 無
        快速連結 : http://localhost:1337/api/Ds_fingerprint_ap/add?ds_ap_id=1&ds_platform_type=plattype1&ds_device_type=devicetype1
    */
	add: function(req, res) {
        var params = req.params.all();  
        var check_array = ["ds_ap_id", "ds_platform_type", "ds_device_type"];
        var check_result = no_call_service.check_data(params, check_array);            
        if(check_result==""){
            //參數不缺少
            Ds_fingerprint_ap.create(params).exec(function(err,create_data){
                if(err){
                    no_call_service.write_log(table_name,"C_die", err, req.session.id, log_type);
                    return res.json({error:2002});
                }else{
                    console.log(table_name,"C_ok");
                    console.log(table_name, params);
                    console.log(table_name, req.session.id);
                    no_call_service.write_log(table_name,"C_ok", params, req.session.id, log_type);
                    return res.json(create_data);                             
                }           
            })       
        }else{
            //參數缺少 直接回應內容
            no_call_service.write_log(table_name,"C_less", params, req.session.id, log_type);
            return res.send(check_result);            
        }
    },
    /*
        用途 : 查看搜尋內容 (R1)
        輸入 : ds_ap_id or ["ds_platform_type", "ds_device_type"]
        輸出 : 整個DB查到的資料(會呈現Human資料給使用者看)
        不可輸入值 : ["push_token"]
        快速連結 : http://localhost:1337/api/Ds_fingerprint_ap/search_human?ds_ap_id=1
    */
	search_human: function(req, res) {
        var params = req.params.all();
        //有不可填寫的參數即擋下
        var cannot_param = ["push_token"];
        var check_cannot = no_call_service.check_ignore_data(params, cannot_param);
        if(check_cannot){
            no_call_service.write_log(table_name,"R_error_data", params, req.session.id, log_type);
            return res.json({error:2001});
        }
          
        var cond = {};
        if(params.ds_ap_id){
            //有ID優先用ID
            cond.ds_ap_id = params.ds_ap_id;
            cond.ds_deleted = ""; //啟用的才可以被查詢
            if(params.ds_platform_type!=undefined) cond.ds_platform_type = params.ds_platform_type;
            if(params.ds_device_type!=undefined) cond.ds_device_type = params.ds_device_type;
            
            Ds_fingerprint_ap.findOne(cond).exec(function(err,find_data){
                    if(err){
                        no_call_service.write_log(table_name,"R1_die", err, req.session.id, log_type);
                        return res.json({error:3001});
                    }else{                        
                        //撈取符合的使用者資料
                        if( _.isEmpty(find_data) ){
                            //查無資料直接回傳
                            no_call_service.write_log(table_name,"R1_no_data", params, req.session.id, log_type);
                            return res.json(find_data);    
                        }else{
                            F_linked.find({ds_ap_id: cond.ds_ap_id}).exec(function(err,flinked_data){
                                if(err){
                                    no_call_service.write_log(table_name,"R1_Flink_die", err, req.session.id, log_type);
                                    return res.json({error:3002});
                                }else{
                                    no_call_service.write_log(table_name,"R1_ok", params, req.session.id, log_type);
                                    find_data.human = _.pluck(flinked_data, "ds_human_pk");
                                    return res.json(find_data);                                    
                                }
                            });
                        }                          
                    }          
            })
        }else{
            //其餘一律error
            var error_msg = "error AP001";
            console.log("error_msg_R1",error_msg);
            no_call_service.write_log(table_name,"R1_err", params, req.session.id, log_type);
            return res.send(error_msg);
        }
    },
    /*
        用途 : 查看搜尋內容 (R2)
        輸入 : ds_ap_id
        輸出 : 整個DB查到的資料
        不可輸入值 : ["ds_device_type", "ds_platform_type", "push_token"]
        快速連結 : http://localhost:1337/api/Ds_fingerprint_ap/search_by_id?ds_ap_id=1
    */
	search_by_id: function(req, res) {
        var params = req.params.all();
        //有不可填寫的參數即擋下
        var cannot_param = ["ds_device_type", "ds_platform_type", "push_token"];
        var check_cannot = no_call_service.check_ignore_data(params, cannot_param);
        if(check_cannot){
            no_call_service.write_log(table_name,"R_error_data", params, req.session.id, log_type);
            return res.json({error:3003});
        }
        
        var cond = {};
        if(params.ds_ap_id){
            //有ID優先用ID
            cond.ds_ap_id = params.ds_ap_id;
            cond.ds_deleted = ""; //啟用的才可以被查詢
            Ds_fingerprint_ap.findOne(cond).exec(function(err,find_data){
                    if(err){
                        no_call_service.write_log(table_name,"R2_die", err, req.session.id, log_type);
                        return res.json({error:3004});
                    }else{
                        no_call_service.write_log(table_name,"R2_ok", params, req.session.id, log_type);
                        return res.json(find_data);                              
                    }          
            })
        }else{
            //其餘一律error
            var error_msg = "error AP002";
            console.log("error_msg_R2",error_msg);
            no_call_service.write_log(table_name,"R2_err", params, req.session.id, log_type);
            return res.send(error_msg);
        }
    },    
    /*
        用途 : 修改設備
        輸入 : ["ds_ap_id", "ds_platform_type", "ds_device_type"]
        輸出 : 修改的object結果 or error
        不可輸入值: 無
        快速連結 : http://localhost:1337/api/Ds_fingerprint_ap/update?ds_ap_id=1&ds_platform_type=plattype2&ds_device_type=devicetype2
    */
	update: function(req, res) {
        var params = req.params.all();
        var check_array = ["ds_ap_id", "ds_platform_type", "ds_device_type"];
        var check_result = no_call_service.check_data(params, check_array);
        if(check_result==""){
            //參數不缺少
            var cond = no_call_service.complete_cond(params, ["ds_ap_id"], "ds_deleted");
            Ds_fingerprint_ap.update( cond, params ).exec(function(err,update_data){
                if(err){
                    no_call_service.write_log(table_name,"U_die", err, req.session.id, log_type);
                    return res.json({error:4001});
                }else{
                    no_call_service.write_log(table_name,"U_ok", params, req.session.id, log_type);
                    return res.json(update_data);                               
                }
            })       
        }else{
            //參數缺少 直接回應內容
            no_call_service.write_log(table_name,"U_less", params, req.session.id, log_type);
            return res.send(check_result);            
        }
    },
    /*
        用途 : 停止設備
        輸入 : ["ds_ap_id"]
        輸出 : 刪除的object結果 or error
        不可輸入值 : ["push_token"]
        快速連結 : http://localhost:1337/api/Ds_fingerprint_ap/stop?ds_ap_id=1
    */
	stop: function(req, res) {
        var moment = require('moment');
        var params = req.params.all();
        //有不可填寫的參數即擋下
        var cannot_param = ["push_token"];
        var check_cannot = no_call_service.check_ignore_data(params, cannot_param);
        if(check_cannot){
            no_call_service.write_log(table_name,"D_error_data", params, req.session.id, log_type);
            return res.json({error:5001});
        }
        
        var check_array = ["ds_ap_id"];
        var check_result = no_call_service.check_data(params, check_array);
        if(check_result==""){
            //參數不缺少
            var cond = no_call_service.complete_cond(params, check_array, "ds_deleted");
            Ds_fingerprint_ap.update( cond ,{"ds_deleted": moment().toISOString()} ).exec(function(err,update_data){
                if(err){
                    no_call_service.write_log(table_name,"D_die", err, req.session.id, log_type);
                    return res.json({error:5002});
                }else{
                    no_call_service.write_log(table_name,"D_ok", params, req.session.id, log_type);
                    return res.json(update_data);                                
                }
            })       
        }else{
            //參數缺少 直接回應內容
            no_call_service.write_log(table_name,"D_less", params, req.session.id, log_type);
            return res.send(check_result);            
        }
    },
};

