/**
 * F_linkedController
 *
 * @description :: Server-side logic for managing f_linkeds
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
    var table_name = "F_linked";
    var log_type = "human";
module.exports = {
	/*
        用途 : 查看內容
        輸入 : 無
        輸出 : 整個DB
        不可輸入值: 無
        快速連結 : http://localhost:1337/api/F_linked/find
    */
	find: function(req, res) {
        F_linked.find().exec(function(err,find_data){
                if(err){
                    no_call_service.write_log(table_name,"R_all_die", err, req.session.id, log_type);
                    return res.json({error:1401});
                }else{
                    no_call_service.write_log(table_name,"R_all", "",req.session.id, log_type);
                    return res.json(find_data);                               
                }
        })
    },
    /*
        用途 : 創建設備
        (特別說明: 兩組Array都要輸入 分開是因為不同資料表 而第二章表最後兩個值 是照片跟特徵點 到時候經過處理只剩下路徑)
        輸入 : ["ds_human_pk","ds_bind_id"] and ["f_linked_pk", "f_which_one", "pic", "minutiae"]        
        輸出 : 創建object or error
        不可輸入值: 無
        快速連結 : http://localhost:1337/api/F_linked/add?ds_name=ccc
    */
	add: function(req, res) {
        var params = req.params.all();        
        var check_array = ["ds_name"];
        var check_result = no_call_service.check_data(params, check_array);
        if(check_result==""){
            //參數不缺少
            F_linked.create(params).exec(function(err,create_data){
                if(err){
                    no_call_service.write_log(table_name,"C_die", err, req.session.id, log_type);
                    return res.json({error:2202});
                }else{
                    console.log(table_name,"C_ok");
                    console.log(table_name, params);
                    console.log(table_name, req.session.id);
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
        不可輸入值: ["F_linked_pk"]
        快速連結 : http://localhost:1337/api/F_linked/search
    */
	search: function(req, res) {
        var params = req.params.all();
        //有不可填寫的參數即擋下
        var cannot_param = ["F_linked_pk"];
        var check_cannot = no_call_service.check_ignore_data(params, cannot_param);
        if(check_cannot){
            no_call_service.write_log(table_name,"C_error_data", params, req.session.id, log_type);
            return res.json({error:3201});
        }

        var not_check = ["ds_birthday", "ds_gender", "ds_bloodtype", "ds_job", "ds_name", "ds_bind_id"];
        var cond = no_call_service.complete_not_cond(params, not_check, "ds_deleted");
        F_linked.findOne(cond).populateAll().exec(function(err,find_data){
            if(err){
                no_call_service.write_log(table_name,"R_die", err, req.session.id, log_type);
                return res.json({error:3202});
            }else{
                //資料直接回傳
                no_call_service.write_log(table_name,"R_ok", params, req.session.id, log_type);
                return res.json(find_data);                             
            }           
        })       

    }, 
    /*
        用途 : 查看搜尋內容 (R2)
        輸入 : ["F_linked_pk"]        
        輸出 : 整個DB查到的資料
        不可輸入值: ["ds_birthday", "ds_gender", "ds_bloodtype", "ds_job", "ds_name", "ds_bind_id"]
        快速連結 : http://localhost:1337/api/F_linked/search_by_id?F_linked_pk=1
    */
	search_by_id: function(req, res) {
        var params = req.params.all();
        //有不可填寫的參數即擋下
        var cannot_param = ["ds_co_id", "ds_ver", "ds_speed", "ds_company", "ds_addr", "ds_product"];
        var check_cannot = no_call_service.check_ignore_data(params, cannot_param);
        if(check_cannot){
            no_call_service.write_log(table_name,"C_error_data", params, req.session.id, log_type);
            return res.json({error:3203});
        }
        
        var check_array = ["F_linked_pk"];
        var check_result = no_call_service.check_data(params, check_array);
        if(check_result==""){
            //參數不缺少
            var cond = no_call_service.complete_cond(params, check_array, "ds_deleted");
            
            F_linked.findOne(cond).exec(function(err,find_data){
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
        輸入 : ["F_linked_pk"] 
        輸出 : 修改的object結果 or error
        不可輸入值: 無
        快速連結 : http://localhost:1337/api/F_linked/update?F_linked_pk=1&ds_job=ccc
    */
	update: function(req, res) {
        var params = req.params.all();
        var check_array = ["F_linked_pk"];
        var check_result = no_call_service.check_data(params, check_array);
        if(check_result==""){
            //參數不缺少
            var cond = no_call_service.complete_cond(params, check_array, "ds_deleted");
            
            F_linked.update( cond, params ).exec(function(err,update_data){
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
        輸入 : ["F_linked_pk", "ds_name", "ds_bind_id"]
        輸出 : 刪除的object結果 or error
        不可輸入值: ["ds_birthday", "ds_gender", "ds_bloodtype", "ds_job"]
        快速連結 : http://localhost:1337/api/F_linked/stop?F_linked_pk=1&ds_name=1&ds_bind_id=1
    */
	stop: function(req, res) {
        var moment = require('moment');
        var params = req.params.all();
        //有不可填寫的參數即擋下
        var cannot_param = ["ds_birthday", "ds_gender", "ds_bloodtype", "ds_job"];
        var check_cannot = no_call_service.check_ignore_data(params, cannot_param);
        if(check_cannot){
            no_call_service.write_log(table_name,"C_error_data", params, req.session.id, log_type);
            return res.json({error:5201});
        }
        
        var check_array = ["F_linked_pk", "ds_name", "ds_bind_id"];
        var check_result = no_call_service.check_data(params, check_array);
        if(check_result==""){
            //參數不缺少
            var cond = no_call_service.complete_cond(params, check_array, "ds_deleted");
            
            F_linked.update( cond ,{"ds_deleted": moment().toISOString()} ).exec(function(err,update_data){
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

