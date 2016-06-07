/**
 * HumanController
 *
 * @description :: Server-side logic for managing humans
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var moment = require("moment");
module.exports = {   
    //列表頁面 http://localhost:1337/human/list
	human_list:function(req,res){     
        var return_obj = {};
        return_obj.link_to_add = "/human/add/";
        return_obj.link_to_edit = "/human/edit/";
        return_obj.link_to_stop = "/human/stop/";
        return_obj.now_url = "基本資料維護";
        return res.view( false , return_obj );                               	
	}, 
    //新增頁面 http://localhost:1337/human/add
    human_add:function(req,res){
        var return_obj = {};
        return_obj.link_to_submit = "/api/Ds_human/C";  
        return_obj.link_to_list = "/human/list/"; 
        return_obj.now_url = "基本資料維護";  
        return res.view( false , return_obj );                               		
	},
    //編輯頁面
    human_edit:function(req,res){
        var params = req.allParams();
        //避免被injection
        Ds_human.findOne({ds_human_pk:params.ds_human_pk}).exec(function(err,find_data){
            if(err){
                res.notFound();
            }else{
                //資料處理
                find_data.ds_birthday = moment(find_data.ds_birthday).format("YYYY-MM-DD");
                var return_obj = {};
                return_obj.link_to_submit = "/api/Ds_human/U";  
                return_obj.link_to_list = "/human/list/"; 
                return_obj.now_url = "基本資料維護";                
                return_obj.find_data = find_data;
                console.log(find_data);
                return res.view( false , return_obj );                               
            }
        })			
	},
    //刪除頁面 有人同一時間改姓名會造成瞬間刪除失敗 (客戶需求)
    human_delete:function(req,res){        
        var params = req.allParams();        
        var destroy_url = "/api/Ds_human/D?ds_human_pk="+params.ds_human_pk+"&ds_name="+params.ds_name+"&submit_to_link=/human/list/";
        return res.redirect( destroy_url );
	},
    //進出頁面
    human_inout:function(req,res){
        var return_obj = {};
        return_obj.link_to_add = "/human/add/";
        return_obj.link_to_edit = "/human/edit/";
        return_obj.link_to_stop = "/human/stop/";
        return_obj.now_url = "基本資料維護";
        return res.view( false , return_obj );		
	},
};

