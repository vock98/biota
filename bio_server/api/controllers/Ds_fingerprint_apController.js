/**
 * Ds_fingerprint_apController
 *
 * @description :: Server-side logic for managing ds_fingerprint_aps
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

    var table_name = "Ds_fingerprint_ap";
module.exports = {
	/*
        用途 : 查看內容
        輸入 : 無
        輸出 : 整個DB
        快速連結 : http://localhost:1337/api/Ds_fingerprint_device/find
    */
	find: function(req, res) {
        Ds_fingerprint_ap.find().exec(function(err,find_data){
                if(err){
                    no_call_service.write_log(table_name,"R_all_err", err, req.session.id);
                    return res.json({error:1001});
                }else{
                    no_call_service.write_log(table_name,"R_all", "",req.session.id);
                    return res.json(find_data);                               
                }
        })
    },
    /*
        用途 : 查看搜尋內容
        輸入 : ds_ap_id or ["ds_platform_type", "ds_device_type"]
        輸出 : 整個DB查到的資料
        快速連結 : http://localhost:1337/api/Ds_fingerprint_device/find
    */
	search: function(req, res) {
        var params = req.params.all();
        var cond = {};
        if(params.ds_ap_id){
            //有ID優先用ID
            cond.ds_ap_id = params.ds_ap_id;
            Ds_fingerprint_ap.findOne(cond).exec(function(err,find_data){
                    if(err){
                        no_call_service.write_log(table_name,"R_id_err", err, req.session.id);
                        return res.json({error:1002});
                    }else{
                        no_call_service.write_log(table_name,"R_id", params, req.session.id);
                        return res.json(find_data);                              
                    }          
            })
        }else if(params.ds_platform_type!=undefined || params.ds_device_type!=undefined){
            //沒ID使用 ["ds_platform_type", "ds_device_type"]
            if(params.ds_platform_type!=undefined) cond.ds_platform_type = params.ds_platform_type;
            if(params.ds_device_type!=undefined) cond.ds_device_type = params.ds_device_type;
            
            Ds_fingerprint_ap.find(cond).exec(function(err,find_data){
                if(err){
                    no_call_service.write_log(table_name,"R_cond_err", err, req.session.id);
                    return res.json({error:1003});
                }else{
                    no_call_service.write_log(table_name,"R_cond", params, req.session.id);
                    return res.json(find_data);                             
                }          
            })
        }else{
            //其餘一律error
            var error_msg = "error AP001";
            console.log("error_msg",error_msg);
            no_call_service.write_log(table_name,"R_error", params, req.session.id);
            return res.send(error_msg);
        }
    },
    /*
        用途 : 創建設備
        輸入 : ["ds_ap_id", "ds_platform_type", "ds_device_type"]
        輸出 : 創建object or error
        快速連結 : http://localhost:1337/api/Ds_fingerprint_ap/add?ds_ap_id=id1&ds_platform_type=plattype1&ds_device_type=devicetype1
    */
	add: function(req, res) {
        var params = req.params.all();
        var check_array = ["ds_ap_id", "ds_platform_type", "ds_device_type"];
        var check_result = no_call_service.check_data(params, check_array);
        if(check_result==""){
            //參數不缺少
            Ds_fingerprint_ap.create(params).exec(function(err,create_data){
                if(err){
                    no_call_service.write_log(table_name,"C_error", err, req.session.id);
                    return res.json({error:2001});
                }else{
                    console.log(table_name,"C_ok");
                    console.log(table_name, params);
                    console.log(table_name, req.session.id);
                    no_call_service.write_log(table_name,"C_ok", params, req.session.id);
                    return res.json(create_data);                             
                }           
            })       
        }else{
            //參數缺少 直接回應內容
            no_call_service.write_log(table_name,"C_less", params, req.session.id);
            return res.send(check_result);            
        }
    },
    /*
        用途 : 修改設備
        輸入 : ["ds_ap_id", "ds_platform_type", "ds_device_type"]
        輸出 : 修改的object結果 or error
        快速連結 : http://localhost:1337/api/Ds_fingerprint_ap/update?ds_ap_id=id1&ds_platform_type=plattype2&ds_device_type=devicetype2
    */
	update: function(req, res) {
        var params = req.params.all();
        var check_array = ["ds_ap_id", "ds_platform_type", "ds_device_type"];
        var check_result = no_call_service.check_data(params, check_array);
        if(check_result==""){
            //參數不缺少
            Ds_fingerprint_ap.update({ ds_ap_id: params.ds_ap_id }, params ).exec(function(err,update_data){
                if(err){
                    no_call_service.write_log(table_name,"U_error", err, req.session.id);
                    return res.json({error:3001});
                }else{
                    no_call_service.write_log(table_name,"U_ok", params, req.session.id);
                    return res.json(update_data);                               
                }
            })       
        }else{
            //參數缺少 直接回應內容
            no_call_service.write_log(table_name,"U_less", params, req.session.id);
            return res.send(check_result);            
        }
    },
    /*
        用途 : 停止設備
        輸入 : ["ds_ap_id"]
        輸出 : 刪除的object結果 or error
        快速連結 : http://localhost:1337/api/Ds_fingerprint_ap/stop?ds_ap_id=id1
    */
	stop: function(req, res) {
        var moment = require('moment');
        var params = req.params.all();
        var check_array = ["ds_ap_id"];
        var check_result = no_call_service.check_data(params, check_array);
        if(check_result==""){
            //參數不缺少
            Ds_fingerprint_ap.update( { "ds_ap_id": params.ds_ap_id },{"ds_deleted": moment().toISOString()} ).exec(function(err,update_data){
                if(err){
                    no_call_service.write_log(table_name,"D_error", err, req.session.id);
                    return res.json({error:4001});
                }else{
                    no_call_service.write_log(table_name,"D_ok", params, req.session.id);
                    return res.json(update_data);                                
                }
            })       
        }else{
            //參數缺少 直接回應內容
            no_call_service.write_log(table_name,"D_less", params, req.session.id);
            return res.send(check_result);            
        }
    },
};

