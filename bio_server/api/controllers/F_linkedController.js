/**
 * F_linkedController
 *
 * @description :: Server-side logic for managing f_linkeds
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
    var table_name = "F_linked";
    var log_type = "device";
module.exports = {
	/*
        用途 : 查看內容
        輸入 : 無
        輸出 : 整個DB
        快速連結 : http://localhost:1337/api/F_linked/find
    */
	find: function(req, res) {
        F_linked.find().exec(function(err,find_data){
                if(err){
                    no_call_service.write_log(table_name,"R_all_die", err, req.session.id, log_type);
                    return res.json({error:1001});
                }else{
                    no_call_service.write_log(table_name,"R_all", "",req.session.id, log_type);
                    return res.json(find_data);                               
                }
        })
    },
};

