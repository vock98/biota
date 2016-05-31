/**
 * Ds_humanController
 *
 * @description :: Server-side logic for managing ds_humen
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

    var table_name = "Ds_human";
    var log_type = "human";
module.exports = {
	/*
        用途 : 查看內容
        輸入 : 無
        輸出 : 整個DB
        不可輸入值: 無
        快速連結 : http://localhost:1337/api/Ds_human/find
    */
	find: function(req, res) {
        Ds_human.find().exec(function(err,find_data){
                if(err){
                    no_call_service.write_log(table_name,"R_all_die", err, req.session.id, log_type);
                    return res.json({error:1201});
                }else{
                    no_call_service.write_log(table_name,"R_all", "",req.session.id, log_type);
                    return res.json(find_data);                               
                }
        })
    },
    /*
        用途 : 創建設備
        輸入 : ["ds_name"]
        輸出 : 創建object or error
        不可輸入值: ["ds_human_pk"]
        快速連結 : http://localhost:1337/api/Ds_human/add?ds_name=ccc
    */
	add: function(req, res) {
        var params = req.allParams(); delete params["id"];
        //有不可填寫的參數即擋下
        var cannot_param = ["ds_human_pk"];
        var check_cannot = no_call_service.check_ignore_data(params, cannot_param);
        if(check_cannot){
            no_call_service.write_log(table_name,"C_error_data", params, req.session.id, log_type);
            return res.json({error:2201});
        }
        
        var check_array = ["ds_name"];
        var check_result = no_call_service.check_data(params, check_array);
        if(check_result==""){
            //參數不缺少
            Ds_human.create(params).exec(function(err,create_data){
                if(err){
                    no_call_service.write_log(table_name,"C_die", err, req.session.id, log_type);
                    return res.json({error:2202});
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
        用途 : 查看搜尋內容 (R1)
        輸入 : 無必填       
        輸出 : 整個DB查到的資料
        不可輸入值: ["ds_human_pk"]
        快速連結 : http://localhost:1337/api/Ds_human/search?ds_name=ccc
    */
	search: function(req, res) {
        var params = req.allParams(); delete params["id"];
        //有不可填寫的參數即擋下
        var cannot_param = ["ds_human_pk"];
        var check_cannot = no_call_service.check_ignore_data(params, cannot_param);
        if(check_cannot){
            no_call_service.write_log(table_name,"R_error_data", params, req.session.id, log_type);
            return res.json({error:3201});
        }

        var not_check = ["ds_birthday", "ds_gender", "ds_bloodtype", "ds_job", "ds_name", "ds_bind_id"];
        var cond = no_call_service.complete_not_cond(params, not_check, "ds_deleted");
        Ds_human.find(cond).populateAll().exec(function(err,find_data){
            if(err){
                no_call_service.write_log(table_name,"R_die", err, req.session.id, log_type);
                return res.json({error:3202});
            }else{
                //資料直接回傳
                no_call_service.write_log(table_name,"R_ok", cond, req.session.id, log_type);
                return res.json(find_data);                             
            }           
        })       

    }, 
    /*
        用途 : 查看搜尋內容 (R2)
        輸入 : ["ds_human_pk"]        
        輸出 : 整個DB查到的資料
        不可輸入值: ["ds_birthday", "ds_gender", "ds_bloodtype", "ds_job", "ds_name", "ds_bind_id"]
        快速連結 : http://localhost:1337/api/Ds_human/search_by_id?ds_human_pk=1
    */
	search_by_id: function(req, res) {
        var params = req.allParams(); delete params["id"];
        //有不可填寫的參數即擋下
        var cannot_param = ["ds_co_id", "ds_ver", "ds_speed", "ds_company", "ds_addr", "ds_product"];
        var check_cannot = no_call_service.check_ignore_data(params, cannot_param);
        if(check_cannot){
            no_call_service.write_log(table_name,"R_error_data", params, req.session.id, log_type);
            return res.json({error:3203});
        }
        
        var check_array = ["ds_human_pk"];
        var check_result = no_call_service.check_data(params, check_array);
        if(check_result==""){
            //參數不缺少
            var cond = no_call_service.complete_cond(params, check_array, "ds_deleted");
            
            Ds_human.findOne(cond).exec(function(err,find_data){
                if(err){
                    no_call_service.write_log(table_name,"R_die", err, req.session.id, log_type);
                    return res.json({error:3204});
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
        用途 : 修改設備
        輸入 : ["ds_human_pk"] 
        輸出 : 修改的object結果 or error
        不可輸入值: 無
        快速連結 : http://localhost:1337/api/Ds_human/update?ds_human_pk=574dbb4836754d98107b5170
    */
	update: function(req, res) {
        var params = req.allParams(); delete params["id"];
        var check_array = ["ds_human_pk"];
        var check_result = no_call_service.check_data(params, check_array);
        if(check_result==""){
            //參數不缺少
            var cond = no_call_service.complete_cond(params, check_array, "ds_deleted");
            
            Ds_human.update( cond, params ).exec(function(err,update_data){
                if(err){
                    no_call_service.write_log(table_name,"U_die", err, req.session.id, log_type);
                    return res.json({error:4201});
                }else{
                    no_call_service.write_log(table_name,"U_ok", params, req.session.id, log_type);
                    return res.json(update_data);                               
                }
            })       
        }else{
            //參數缺少 直接回應內容
            no_call_service.write_log(table_name,"U_less", params, req.session.id, log_type);
            return res.send(check_result);            
        }
    },
    /*
        用途 : 停止設備
        輸入 : ["ds_human_pk", "ds_name"]
        輸出 : 刪除的object結果 or error
        不可輸入值: ["ds_birthday", "ds_gender", "ds_bloodtype", "ds_job"]
        快速連結 : http://localhost:1337/api/Ds_human/stop?ds_human_pk=1&ds_name=1
    */
	stop: function(req, res) {
        var moment = require('moment');
        var params = req.allParams(); delete params["id"];
        //有不可填寫的參數即擋下
        var cannot_param = ["ds_birthday", "ds_gender", "ds_bloodtype", "ds_job"];
        var check_cannot = no_call_service.check_ignore_data(params, cannot_param);
        if(check_cannot){
            no_call_service.write_log(table_name,"D_error_data", params, req.session.id, log_type);
            return res.json({error:5201});
        }
        
        var check_array = ["ds_human_pk", "ds_name", "ds_bind_id"];
        var check_result = no_call_service.check_data(params, check_array);
        if(check_result==""){
            //參數不缺少
            var cond = no_call_service.complete_cond(params, check_array, "ds_deleted");
            
            Ds_human.update( cond ,{"ds_deleted": moment().toISOString()} ).exec(function(err,update_data){
                if(err){
                    no_call_service.write_log(table_name,"D_die", err, req.session.id, log_type);
                    return res.json({error:5202});
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

