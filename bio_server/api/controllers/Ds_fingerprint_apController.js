/**
 * Ds_fingerprint_apController
 *
 * @description :: Server-side logic for managing ds_fingerprint_aps
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	/*
        用途 : 查看內容
        輸入 : 無
        輸出 : 整個DB
        快速連結 : http://localhost:1337/api/Ds_fingerprint_device/find
    */
	find: function(req, res) {
        Ds_fingerprint_ap.find().exec(function(err,find_data){
                return res.json(find_data);           
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
        if(params.ds_ap_id){
            //有ID優先用ID
            Ds_fingerprint_ap.findOne({ds_ap_id:params.ds_ap_id}).exec(function(err,find_data){
                    return res.json(find_data);           
            })
        }else if(params.ds_platform_type!=undefined || params.ds_device_type!=undefined){
            //沒ID使用 ["ds_platform_type", "ds_device_type"]
            var cond = {};
            if(params.ds_platform_type!=undefined) cond.ds_platform_type = params.ds_platform_type;
            if(params.ds_device_type!=undefined) cond.ds_device_type = params.ds_device_type;
            
            Ds_fingerprint_ap.find(cond).exec(function(err,find_data){
                    return res.json(find_data);           
            })
        }else{
            //其餘一律error
            var error_msg = "error AP001";
            console.log("error_msg",error_msg);
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
                return res.json(create_data);           
            })       
        }else{
            //參數缺少 直接回應內容
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
                return res.json(update_data);           
            })       
        }else{
            //參數缺少 直接回應內容
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
                return res.json(update_data);           
            })       
        }else{
            //參數缺少 直接回應內容
            return res.send(check_result);            
        }
    },
};

