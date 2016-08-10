/**
 * SimulatorController
 *
 * @description :: Server-side logic for managing simulators
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	//列表頁面 http://localhost:1337/simulator/pro
	pro:function(req,res){     
        var return_obj = {};
        return_obj.now_url = "應用程式接口";
        return res.view( false , return_obj );                               	
	}, 
    //列表頁面 http://localhost:1337/simulator/gcm
	gcm:function(req,res){     
        var return_obj = {};
        return_obj.now_url = "APNS/GCM推播模擬";
        return res.view( false , return_obj );                               	
	}, 
};

