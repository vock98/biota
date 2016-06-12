/**
 * HumanController
 *
 * @description :: Server-side logic for managing humans
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var moment = require("moment");
module.exports = {   
    //列表頁面 http://localhost:1337/log/device_list
	device_list:function(req,res){     
        var return_obj = {};
        return_obj.now_url = "設備操作記錄";
        return res.view( false , return_obj );                                	
	}, 
};

