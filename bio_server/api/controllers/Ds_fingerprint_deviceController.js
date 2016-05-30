/**
 * Ds_fingerprint_deviceController
 *
 * @description :: Server-side logic for managing ds_fingerprint_aps
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

    var table_name = "Ds_fingerprint_device";
    var log_type = "device";
module.exports = {
	/*
        用途 : 查看內容
        輸入 : 無
        輸出 : 整個DB
        不可輸入值: 無
        快速連結 : http://localhost:1337/api/Ds_fingerprint_device/find
    */
	find: function(req, res) {
        Ds_fingerprint_device.find().exec(function(err,find_data){
                if(err){
                    no_call_service.write_log(table_name,"R_all_die", err, req.session.id, log_type);
                    return res.json({error:1101});
                }else{
                    no_call_service.write_log(table_name,"R_all", "",req.session.id, log_type);
                    return res.json(find_data);                               
                }
        })
    },
    /*
        用途 : 創建設備
        輸入 : ["ds_device_id", "ds_co_id", "ds_ver", "ds_speed", "ds_company", "ds_addr", "ds_product", "ds_ap_id"]
        輸出 : 創建object or error
        不可輸入值: 無
        快速連結 : http://localhost:1337/api/Ds_fingerprint_device/add?ds_device_id=1&ds_co_id=co1&ds_ver=ver1&ds_speed=sp1&ds_company=co1&ds_addr=ad1&ds_product=pr1&ds_ap_id=1
    */
	add: function(req, res) {
        var params = req.params.all();
        var check_array = ["ds_device_id", "ds_co_id", "ds_ver", "ds_speed", "ds_company", "ds_addr", "ds_product", "ds_ap_id"];
        var check_result = no_call_service.check_data(params, check_array);
        if(check_result==""){
            //參數不缺少
            Ds_fingerprint_device.create(params).exec(function(err,create_data){
                if(err){
                    no_call_service.write_log(table_name,"C_die", err, req.session.id, log_type);
                    return res.json({error:2101});
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
        用途 : 查看搜尋內容
        輸入 : ["ds_device_id", "ds_ap_id"]        
        輸出 : 整個DB查到的資料
        不可輸入值: ["ds_co_id", "ds_ver", "ds_speed", "ds_company", "ds_addr", "ds_product"]
        快速連結 : http://localhost:1337/api/Ds_fingerprint_device/search_by_id?ds_ap_id=1&ds_device_id=1
    */
	search_by_id: function(req, res) {
        var params = req.params.all();
        //有不可填寫的參數即擋下
        var cannot_param = ["ds_co_id", "ds_ver", "ds_speed", "ds_company", "ds_addr", "ds_product"];
        var check_cannot = no_call_service.check_ignore_data(params, cannot_param);
        if(check_cannot){
            no_call_service.write_log(table_name,"R_error_data", params, req.session.id, log_type);
            return res.json({error:3101});
        }
        
        var check_array = ["ds_device_id", "ds_ap_id"];
        var check_result = no_call_service.check_data(params, check_array);
        if(check_result==""){
            //參數不缺少
            var cond = no_call_service.complete_cond(params, check_array, "ds_deleted");
            
            Ds_fingerprint_device.findOne(cond).exec(function(err,find_data){
                if(err){
                    no_call_service.write_log(table_name,"R_die", err, req.session.id, log_type);
                    return res.json({error:3102});
                }else{
                    //資料直接回傳
                    no_call_service.write_log(table_name,"R_ok", params, req.session.id, log_type);
                    return res.json(find_data);                             
                }           
            })       
        }else{
            //參數缺少 直接回應內容
            no_call_service.write_log(table_name,"R_less", params, req.session.id, log_type);
            return res.send(check_result);            
        }
    }, 
    /*
        用途 : 修改設備
        輸入 : ["ds_device_id", "ds_ap_id"]
        輸出 : 修改的object結果 or error
        不可輸入值: 無
        快速連結 : http://localhost:1337/api/Ds_fingerprint_device/update?ds_device_id=1&ds_co_id=co1&ds_ver=ver1&ds_speed=sp1&ds_company=co1&ds_addr=ad1&ds_product=pr2&ds_ap_id=1
    */
	update: function(req, res) {
        var params = req.params.all();
        var check_array = ["ds_device_id", "ds_ap_id"];
        var check_result = no_call_service.check_data(params, check_array);
        if(check_result==""){
            //參數不缺少
            var cond = no_call_service.complete_cond(params, check_array, "ds_deleted");
            
            Ds_fingerprint_device.update( cond, params ).exec(function(err,update_data){
                if(err){
                    no_call_service.write_log(table_name,"U_die", err, req.session.id, log_type);
                    return res.json({error:4101});
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
        輸入 : ["ds_device_id", "ds_ap_id"]
        輸出 : 刪除的object結果 or error
        不可輸入值: 無
        快速連結 : http://localhost:1337/api/Ds_fingerprint_device/stop?ds_ap_id=1&ds_device_id=1&ds_co_id
    */
	stop: function(req, res) {
        var moment = require('moment');
        var params = req.params.all();
        var check_array = ["ds_device_id", "ds_ap_id"];
        var check_result = no_call_service.check_data(params, check_array);
        if(check_result==""){
            //參數不缺少
            var cond = no_call_service.complete_cond(params, check_array, "ds_deleted");
            
            Ds_fingerprint_device.update( cond ,{"ds_deleted": moment().toISOString()} ).exec(function(err,update_data){
                if(err){
                    no_call_service.write_log(table_name,"D_die", err, req.session.id, log_type);
                    return res.json({error:5101});
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

