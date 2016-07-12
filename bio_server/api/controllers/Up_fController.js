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
        用途 : 查看內容
        輸入 : 無
        輸出 : 整個DB
        不可輸入值: 無
        快速連結 : http://localhost:1337/api/Up_f/find
    */
	find: function(req, res) {
        Up_f.find().sort("updatedAt desc").exec(function(err,find_data){
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

