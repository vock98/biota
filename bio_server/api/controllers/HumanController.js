/**
 * HumanController
 *
 * @description :: Server-side logic for managing humans
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    //列表頁面
	human_list:function(req,res){
        Ds_human.find().exec(function(err,find_data){
            if(err){
                res.notFound();
            }else{
                console.log(123,find_data);
                
                var return_obj = {};
                return_obj.link_to_add = "/human/add/";
                return_obj.link_to_edit = "/human/edit/";
                return_obj.link_to_stop = "/human/stop/";
                return_obj.now_url = "基本資料維護";
                return_obj.find_data = find_data;
                return res.view( false , return_obj );                               
            }
        })		
	}, 
    //新增頁面
    human_add:function(req,res){
        Ds_human.find().exec(function(err,find_data){
            if(err){
                res.notFound();
            }else{
                console.log(123,find_data);
                
                var return_obj = {};
                return_obj.link_to_list = "/human/list/";
                return_obj.now_url = "基本資料維護";
                return_obj.find_data = find_data;
                return res.view( false , return_obj );                               
            }
        })			
	},
    //編輯頁面
    human_edit:function(req,res){
        Ds_human.find().exec(function(err,find_data){
            if(err){
                res.notFound();
            }else{
                console.log(123,find_data);
                
                var return_obj = {};
                return_obj.link_to_add = "/human/add/";
                return_obj.link_to_edit = "/human/edit/";
                return_obj.link_to_stop = "/human/stop/";
                return_obj.now_url = "基本資料維護";
                return_obj.find_data = find_data;
                return res.view( false , return_obj );                               
            }
        })			
	},
    //進出頁面
    human_inout:function(req,res){
        Ds_human.find().exec(function(err,find_data){
            if(err){
                res.notFound();
            }else{
                console.log(123,find_data);
                
                var return_obj = {};
                return_obj.link_to_add = "/human/add/";
                return_obj.link_to_edit = "/human/edit/";
                return_obj.link_to_stop = "/human/stop/";
                return_obj.now_url = "基本資料維護";
                return_obj.find_data = find_data;
                return res.view( false , return_obj );                               
            }
        })			
	},
};

