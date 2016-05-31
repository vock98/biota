/**
 * Ds_nfcController
 *
 * @description :: Server-side logic for managing ds_nfcs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

    var table_name = "Ds_nfc";
    var log_type = "human";
module.exports = {
	/*
        用途 : 查看內容
        輸入 : 無
        輸出 : 整個DB
        不可輸入值: 無
        快速連結 : http://localhost:1337/api/Ds_nfc/find
    */
	find: function(req, res) {
        Ds_nfc.find().exec(function(err,find_data){
                if(err){
                    no_call_service.write_log(table_name,"R_all_die", err, req.session.id, log_type);
                    return res.json({error:1301});
                }else{
                    no_call_service.write_log(table_name,"R_all", "",req.session.id, log_type);
                    return res.json(find_data);                               
                }
        })
    },
    /*
        用途 : 創建設備
        輸入 : ["ds_nfc_tag_id", "ds_human_pk"]
        輸出 : 創建object or error
        不可輸入值: 無
        快速連結 : http://localhost:1337/api/Ds_nfc/add?ds_nfc_tag_id=id1&ds_human_pk=1
    */
	add: function(req, res) {
        var params = req.allParams(); delete params["id"];
        var check_array = ["ds_nfc_tag_id", "ds_human_pk"];
        var check_result = no_call_service.check_data(params, check_array);
        if(check_result==""){
            //參數不缺少
            Ds_nfc.create(params).exec(function(err,create_data){
                if(err){
                    no_call_service.write_log(table_name,"C_die", err, req.session.id, log_type);
                    return res.json({error:2301});
                }else{
                    no_call_service.write_log(table_name,"C_ok", params, req.session.id, log_type);
                    return res.json(create_data);                             
                }           
            })       
        }else{
            //參數缺少 直接回應內容
            no_call_service.write_log(table_name,"C_less", params, req.session.id, log_type);
            return res.send(check_result);            
        }
    },
    /*
        用途 : 查看搜尋內容
        輸入 : ["ds_human_pk"]        
        輸出 : DB查到的NFC個人資料
        不可輸入值: ["ds_nfc_tag_id"]
        快速連結 : http://localhost:1337/api/Ds_nfc/search_by_id?ds_human_pk=1
    */
	search_by_id: function(req, res) {
        var params = req.allParams(); delete params["id"];
        //有不可填寫的參數即擋下
        var cannot_param = ["ds_nfc_tag_id"];
        var check_cannot = no_call_service.check_ignore_data(params, cannot_param);
        if(check_cannot){
            no_call_service.write_log(table_name,"R_error_data", params, req.session.id, log_type);
            return res.json({error:3301});
        }
        
        var check_array = ["ds_human_pk"];
        var check_result = no_call_service.check_data(params, check_array);
        if(check_result==""){
            //參數不缺少
            var cond = no_call_service.complete_cond(params, check_array, "ds_deleted");
            
            Ds_nfc.findOne(cond).exec(function(err,find_data){
                if(err){
                    no_call_service.write_log(table_name,"R_die", err, req.session.id, log_type);
                    return res.json({error:3302});
                }else{
                    //資料直接回傳
                    no_call_service.write_log(table_name,"R_ok", params, req.session.id, log_type);
                    return res.json(find_data);                             
                }           
            })       
        }else{
            //參數缺少 直接回應內容
            no_call_service.write_log(table_name,"R_less", params, req.session.id, log_type);
            return res.send(check_result);            
        }
    },     
    /*
        用途 : 停止設備
        輸入 : ["ds_nfc_tag_id", "ds_human_pk"]
        輸出 : 刪除的object結果 or error
        不可輸入值: 無
        快速連結 : http://localhost:1337/api/Ds_nfc/stop?ds_nfc_tag_id=id1&ds_human_pk=1
    */
	stop: function(req, res) {
        var moment = require('moment');
        var params = req.allParams(); delete params["id"];
        
        var check_array = ["ds_nfc_tag_id", "ds_human_pk"];
        var check_result = no_call_service.check_data(params, check_array);
        if(check_result==""){
            //參數不缺少
            var cond = no_call_service.complete_cond(params, check_array, "ds_deleted");
            
            Ds_nfc.update( cond ,{"ds_deleted": moment().toISOString()} ).exec(function(err,update_data){
                if(err){
                    no_call_service.write_log(table_name,"D_die", err, req.session.id, log_type);
                    return res.json({error:5301});
                }else{
                    no_call_service.write_log(table_name,"D_ok", params, req.session.id, log_type);
                    return res.json(update_data);                                
                }
            })       
        }else{
            //參數缺少 直接回應內容
            no_call_service.write_log(table_name,"D_less", params, req.session.id, log_type);
            return res.send(check_result);            
        }
    },
};


