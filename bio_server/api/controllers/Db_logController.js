/**
 * Db_logController
 *
 * @description :: Server-side logic for managing db_logs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	/*
        用途 : 查看內容
        輸入 : 無
        輸出 : 整個DB
        快速連結 : http://localhost:1337/api/Db_log/find
    */
	find: function(req, res) {
        var params = req.allParams(); delete params["id"];
        delete params.id;
        Db_log.find(params).sort("updatedAt desc").limit("1000").exec(function(err,find_data){
                if(err){
                    return res.json(err);
                }else{
                    return res.json(find_data);                               
                }
        })
        // Db_log.destroy().exec(function(err,find_data){
            // return res.send("ok");
        // })
    }
};

