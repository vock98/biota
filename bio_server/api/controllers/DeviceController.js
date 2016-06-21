/**
 * DeviceController
 *
 * @description :: Server-side logic for managing devices
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var co = require('co');
var moment = require("moment");
module.exports = {   
    //列表頁面 http://localhost:1337/device/list
	device_list:function(req,res){     
        var return_obj = {};
        return_obj.link_to_add = "/device/add/";
        return_obj.now_url = "指紋機設備設定";
        return res.view( false , return_obj );                               	
	}, 
    //新增頁面 http://localhost:1337/device/add
    device_add:function(req,res){
        co(function* () {                                                    
            var return_obj = {};
            return_obj.link_to_submit = "/api/Ds_fingerprint_device";  
            return_obj.link_to_list = "/device/list/"; 
            return_obj.now_url = "指紋機設備設定";  
            return_obj.ap_option = yield call_service.find_ap_id(); 
            return res.view( false , return_obj );  
        }).catch(function(err){
            console.log("device_add",err);
        });
	},
    //編輯頁面 http://localhost:1337/device/edit/:id/:device_id
    device_edit:function(req,res){
        co(function* () {                                                    
            var params = req.allParams();
            var return_obj = {};
            var linklist= "/device/list/"
            var device_data = yield call_service.find_device_data(params.id, params.device_id);            
            if(!device_data){return res.redirect( linklist );}//避免使用者亂填的阻擋
            
                return_obj.link_to_submit = "/api/Ds_fingerprint_device";  
                return_obj.link_to_list = linklist; 
                return_obj.now_url = "指紋機設備設定";  
                return_obj.ap_option = yield call_service.find_ap_id(); 
                return_obj.find_data = device_data;
            return res.view( false , return_obj );  
        }).catch(function(err){
            console.log("device_edit",err);
        });		
	},
    //刪除頁面 有人同一時間改姓名會造成瞬間刪除失敗 (客戶需求) http://localhost:1337/device/delete/:id/:device_id
    device_delete:function(req,res){        
        var params = req.allParams();        
        var destroy_url = "/api/Ds_fingerprint_device?type=D&device_id="+params.device_id+"&id="+params.id+"&submit_to_link=/device/list/";
        return res.redirect( destroy_url );
	},
};



