/**
 * ApController
 *
 * @description :: Server-side logic for managing aps
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var moment = require("moment");
module.exports = {   
    //列表頁面 http://localhost:1337/
	login:function(req,res){    
        var params = req.allParams();   
        var return_obj = {};
        return_obj.error = params.error || "not";
        return res.view( false , return_obj );                                	
	},
    check:function(req,res){//檢查帳號密碼是否正確		
		var params = req.allParams();
		if(params.account=="biota" && params.password=="qwer4321"){ 
            req.session.user = "good";            
            return res.redirect(sails.config.myconf.my_firstpage);
        }else{
            return res.redirect(sails.config.myconf.error_firstpage);            
        }
	},
	logout:function(req,res){//登出功能		
		req.session.destroy();
		return res.redirect('/');		
	}
};



