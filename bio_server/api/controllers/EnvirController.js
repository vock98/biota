/**
 * ApController
 *
 * @description :: Server-side logic for managing aps
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var co = require('co');
var moment = require("moment");
module.exports = {   
    //列表頁面 http://localhost:1337/envir/list
	list:function(req,res){     
        var return_obj = {};
        return_obj.link_to_add = "/envir/add/";
        return_obj.now_url = "手動輸入記錄";
        return res.view( false , return_obj );                               	
	}, 
    //新增頁面 http://localhost:1337/envir/add
    add:function(req,res){
        var return_obj = {};
        return_obj.link_to_submit = "/api/Ef_envir/C";   
        return_obj.link_to_list = "/envir/list/"; 
        return_obj.now_url = "手動輸入記錄";  
        return res.view( false , return_obj );                               		
	},
    //編輯頁面 http://localhost:1337/envir/edit/:id
    edit:function(req,res){
        var params = req.allParams();
        //避免被injection 
        Ef_envir.findOne({ef_envir_pk:params.ef_envir_pk}).exec(function(err,find_data){
            if(err){
                res.notFound();
            }else{
                //資料處理
                find_data.ef_datetime = moment(find_data.ef_datetime).format("YYYY-MM-DD HH:mm:SS");
                var return_obj = {};
                return_obj.link_to_submit = "/api/Ef_envir/U";  
                return_obj.link_to_list = "/envir/list/"; 
                return_obj.now_url = "手動輸入記錄";                
                return_obj.find_data = find_data;
                return res.view( false , return_obj );                               
            }
        })			
	},
    //刪除頁面 有人同一時間改姓名會造成瞬間刪除失敗 (客戶需求) http://localhost:1337/envir/delete/:id/:ds_name
    delete:function(req,res){        
        var params = req.allParams();        
        var destroy_url = "/api/Ef_envir/D?ef_envir_pk="+params.ef_envir_pk+"&submit_to_link=/envir/list/";
        return res.redirect( destroy_url );
	},
};



