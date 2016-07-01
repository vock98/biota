/**
 * F_linkedController
 *
 * @description :: Server-side logic for managing f_linkeds
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
    var co = require('co');
    var moment = require("moment");
    var table_name = "F_linked";
    var log_type = "human";
module.exports = {
    /*                                      
        all網址 : http://localhost:1337/api/F_linked/find
        C網址   : http://localhost:1337/api/F_linked?type=C&id=57725dd57685ce8c10495442&bind_id=aaa&f_id=001&which=r-index&pic=xxx&minutiae=xxx
        D網址   : http://localhost:1337/api/F_linked?type=D&id=57725dd57685ce8c10495442&f_id=001
    */                                                         
	redirect: function(req, res) {
        co(function* () {                                                    
            var params = req.allParams();
            var who =  req.session.id;
            var return_obj = ""; 
            switch(params.type){ 
                case "C" : return_obj = yield F_linked_service.create( params ,who); break;
                // case "R" : return_obj = yield F_linked_service.search( params ); break;
                // case "R1": return_obj = yield F_linked_service.search1( params ,who); break;
                // case "R2": return_obj = yield F_linked_service.search2( params ,who); break;
                // case "U" : return_obj = yield F_linked_service.update( params ,who); break;
                case "D" : return_obj = yield F_linked_service.destroy( params ,who); break;
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
	/*
        用途 : 查看內容
        輸入 : 無
        輸出 : 整個DB
        不可輸入值: 無
        快速連結 : http://localhost:1337/api/F_linked/find
    */
	find: function(req, res) {
        F_linked.find().sort("updatedAt desc").exec(function(err,find_data){
                if(err){
                    // no_call_service.write_log(table_name,"R_all_die", err, req.session.id, log_type);
                    return res.json({error:1501});
                }else{
                    // no_call_service.write_log(table_name,"R_all", "",req.session.id, log_type);
                    return res.json(find_data);                               
                }
        })
    },
};

