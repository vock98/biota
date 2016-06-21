/**
 * ApController
 *
 * @description :: Server-side logic for managing aps
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var moment = require("moment");
module.exports = {   
    //列表頁面 http://localhost:1337/ap/list
	ap_list:function(req,res){     
        var return_obj = {};
        return_obj.link_to_add = "/ap/add/";
        return_obj.now_url = "AP參數設定";
        return res.view( false , return_obj );                               	
	}, 
    //新增頁面 http://localhost:1337/ap/add
    ap_add:function(req,res){
        var return_obj = {};
        return_obj.link_to_submit = "/api/Ds_fingerprint_ap";  
        return_obj.link_to_list = "/ap/list/"; 
        return_obj.now_url = "AP參數設定";  
        return res.view( false , return_obj );                               		
	},
    //編輯頁面 http://localhost:1337/ap/edit/:id
    ap_edit:function(req,res){
        var params = req.allParams();
        //避免被injection
        Ds_fingerprint_ap.findOne({ds_ap_id:params.id}).exec(function(err,find_data){
            if(err){
                res.notFound();
            }else{
                //資料處理
                var return_obj = {};
                return_obj.link_to_submit = "/api/Ds_fingerprint_ap";  
                return_obj.link_to_list = "/ap/list/"; 
                return_obj.now_url = "AP參數設定";                
                return_obj.find_data = find_data;
                return res.view( false , return_obj );                               
            }
        })			
	},
    //刪除頁面 有人同一時間改姓名會造成瞬間刪除失敗 (客戶需求) http://localhost:1337/ap/delete/:id/:ds_name
    ap_delete:function(req,res){        
        var params = req.allParams();        
        var destroy_url = "/api/Ds_fingerprint_ap?type=D&id="+params.id+"&device_type="+params.device_type+"&platform_type="+params.platform_type+"&submit_to_link=/ap/list/";
        return res.redirect( destroy_url );
	},
};



