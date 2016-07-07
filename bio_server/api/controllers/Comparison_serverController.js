/**
 * ComparisonController
 *
 * @description :: Server-side logic for managing Comparisons
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
    var co = require('co');
    var moment = require("moment");
    var table_name = "Comparison_server";
    var log_type = "human";
module.exports = {
	/*                                      
        Ri網址  : http://localhost:1337/api/Comparison_server?type=Ri&minutiae=xxx
        Rv網址  : http://localhost:1337/api/Comparison_server?type=Rv&minutiae=xxx&id=57725dd57685ce8c10495442&bind_id=aaa
    */
	redirect: function(req, res) {
        co(function* () {                                                    
            var params = req.allParams();
            var who =  req.session.id;
            var return_obj = "";
            switch(params.type){
                case "Ri" : return_obj = yield Comparison_server.Ri( params ,who); break;
                case "Rv" : return_obj = yield Comparison_server.Rv( params ,who); break;
                default: return_obj = no_call_service.add_biota_result( {} , false , "type 不正確" , ["type 不正確"] );
            }
            var submit_to_link = req.param("submit_to_link");
            if(return_obj.result.success && submit_to_link ){ //如果有網址代表要直接轉頁
                return res.redirect( submit_to_link );
            }else{                                                    
                return res.json( return_obj );
            }
        }).catch(function(err){
            console.log(table_name+"_second_routes_error",err);
            return res.send( table_name+"_second_routes_error");
        });
    },
};