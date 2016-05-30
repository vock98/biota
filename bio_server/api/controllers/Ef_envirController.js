/**
 * Ef_envirController
 *
 * @description :: Server-side logic for managing ef_envirs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

    var table_name = "Ef_envir";
    var log_type = "out2";
    var moment = require('moment');
module.exports = {
	/*
        用途 : 查看內容
        輸入 : 無
        輸出 : 整個DB
        不可輸入值: 無
        快速連結 : http://localhost:1337/api/Ef_envir/find
    */
	find: function(req, res) {
        Ef_envir.find().exec(function(err,find_data){
                if(err){
                    no_call_service.write_log(table_name,"R_all_die", err, req.session.id, log_type);
                    return res.json({error:1701});
                }else{
                    no_call_service.write_log(table_name,"R_all", "",req.session.id, log_type);
                    return res.json(find_data);                               
                }
        })
    },
    /*
        用途 : 創建設備
        輸入 : ["ef_datetime","ef_desc","ef_pic_path","ef_temp","ef_humd"]
        輸出 : 創建object or error
        不可輸入值: ["from","to"]
        快速連結 : http://localhost:1337/api/Ef_envir/add?ef_datetime=20160101&ef_desc=good&ef_pic_path=88&ef_temp=15&ef_humd=20
    */    
	add: function(req, res) {
        var params = req.params.all();
        //有不可填寫的參數即擋下
        var cannot_param = ["from","to"];
        var check_cannot = no_call_service.check_ignore_data(params, cannot_param);
        if(check_cannot){
            no_call_service.write_log(table_name,"C_error_data", params, req.session.id, log_type);
            return res.json({error:2701});
        }
        
        var check_array = ["ef_datetime","ef_desc","ef_pic_path","ef_temp","ef_humd"];
        var check_result = no_call_service.check_data(params, check_array);
        if(check_result==""){
            //參數不缺少
            params.ef_datetime = moment(params.ef_datetime).toISOString();
            Ef_envir.create(params).exec(function(err,create_data){
                if(err){
                    no_call_service.write_log(table_name,"C_die", err, req.session.id, log_type);
                    return res.json({error:2702});
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
        輸入 : ["from","to"]       
        輸出 : 整個DB查到的資料
        不可輸入值: 無
        快速連結 : http://localhost:1337/api/Ef_envir/search?from=20160101&to=20160101
    */
	search: function(req, res) {
        var params = req.params.all();

        params.createdAt = { '>': moment(params.from).startOf('day').toISOString(), '<': moment(params.to).endOf('day').toISOString() };
        delete params['from'];
        delete params['to'];
        delete params['id'];
        delete params['ef_datetime'];
        Ef_envir.findOne(params).exec(function(err,find_data){
            if(err){
                no_call_service.write_log(table_name,"R_die", err, req.session.id, log_type);
                return res.json({error:3701});
            }else{
                //資料直接回傳
                no_call_service.write_log(table_name,"R_ok", params, req.session.id, log_type);
                return res.json(find_data);                             
            }           
        })       

    },     
    /*
        用途 : 修改設備
        輸入 : ["ef_envir_pk"] 
        輸出 : 修改的object結果 or error
        不可輸入值: ["from","to"]
        快速連結 : http://localhost:1337/api/Ef_envir/update?ef_envir_pk=1&ef_desc=ccc
    */
	update: function(req, res) {
        var params = req.params.all();
        //有不可填寫的參數即擋下
        var cannot_param = ["from","to"];
        var check_cannot = no_call_service.check_ignore_data(params, cannot_param);
        if(check_cannot){
            no_call_service.write_log(table_name,"U_error_data", params, req.session.id, log_type);
            return res.json({error:4701});
        }
        
        
        var check_array = ["ef_envir_pk"];
        var check_result = no_call_service.check_data(params, check_array);
        if(check_result==""){
            //參數不缺少
            params.ef_datetime = moment(params.ef_datetime).toISOString();            
            
            var cond = no_call_service.complete_cond(params, check_array);
            Ef_envir.update( cond, params ).exec(function(err,update_data){
                if(err){
                    no_call_service.write_log(table_name,"U_die", err, req.session.id, log_type);
                    return res.json({error:4702});
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
        輸入 : ["ef_envir_pk"]
        輸出 : 刪除的object結果 or error
        不可輸入值: ["from","to"]
        快速連結 : http://localhost:1337/api/Ef_envir/stop?ef_envir_pk=2
    */
	stop: function(req, res) {
        var params = req.params.all();
        //有不可填寫的參數即擋下
        var cannot_param = ["from","to"];
        var check_cannot = no_call_service.check_ignore_data(params, cannot_param);
        if(check_cannot){
            no_call_service.write_log(table_name,"D_error_data", params, req.session.id, log_type);
            return res.json({error:5701});
        }
        
        var check_array = ["ef_envir_pk"];
        var check_result = no_call_service.check_data(params, check_array);
        if(check_result==""){
            //參數不缺少
            params.ef_datetime = moment(params.ef_datetime).toISOString();
            var cond = no_call_service.complete_cond(params, check_array);
            
            Ef_envir.destroy( cond ).exec(function(err){
                if(err){
                    no_call_service.write_log(table_name,"D_die", err, req.session.id, log_type);
                    return res.json({error:5202});
                }else{
                    no_call_service.write_log(table_name,"D_ok", params, req.session.id, log_type);
                    return res.send("D_ok");                                
                }
            })       
        }else{
            //參數缺少 直接回應內容
            no_call_service.write_log(table_name,"D_less", params, req.session.id, log_type);
            return res.send(check_result);            
        }
    },
};

