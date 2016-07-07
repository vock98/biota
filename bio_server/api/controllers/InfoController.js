/**
 * infoController
 *
 * @description :: Server-side logic for managing infos
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var moment = require("moment");
module.exports = {   
    //列表頁面 http://localhost:1337/info/list
	list:function(req,res){     
        var return_obj = {};
        return_obj.link_to_add = "/info/add/";
        return_obj.now_url = "公告 / 提醒事項維護";
        return res.view( false , return_obj );                               	
	}, 
    //新增頁面 http://localhost:1337/info/add
    add:function(req,res){
        var return_obj = {};
        return_obj.link_to_submit = "/api/info_list";  
        return_obj.link_to_list = "/info/list/"; 
        return_obj.now_url = "公告 / 提醒事項維護";  
        return res.view( false , return_obj );                               		
	},
    //編輯頁面 http://localhost:1337/info/edit/:subject_pk
    edit:function(req,res){
        var params = req.allParams();
        //避免被injection
        Info_list.findOne({ds_subject_pk:params.subject_pk}).exec(function(err,find_data){
            if(err){
                res.notFound();
            }else{
                //資料處理
                find_data.ds_time = moment(find_data.ds_time).format("YYYY-MM-DD HH:mm:SS");
                var return_obj = {};
                return_obj.link_to_submit = "/api/info_list";  
                return_obj.link_to_list = "/info/list/"; 
                return_obj.now_url = "公告 / 提醒事項維護";                
                return_obj.find_data = find_data;
                return res.view( false , return_obj );                               
            }
        })			
	},
    //刪除頁面 http://localhost:1337/info/delete/:subject_pk
    delete:function(req,res){        
        var params = req.allParams();        
        var destroy_url = "/api/info_list?type=D&subject_pk="+params.subject_pk+"&submit_to_link=/info/list/";
        return res.redirect( destroy_url );
	},
};



