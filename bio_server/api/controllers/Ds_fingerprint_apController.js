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
        用途 : 創建設備
        輸入 : ["ds_ap_id", "ds_platform_type", "ds_device_type"]
        輸出 : 無
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
};

