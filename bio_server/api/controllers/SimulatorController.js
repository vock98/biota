/**
 * SimulatorController
 *
 * @description :: Server-side logic for managing simulators
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	//列表頁面 http://localhost:1337/ap/list
	pro:function(req,res){     
        var return_obj = {};
        return_obj.now_url = "應用程式接口";
        return res.view( false , return_obj );                               	
	}, 
};

