/**
 * F_linkedController
 *
 * @description :: Server-side logic for managing f_linkeds
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
 /*
 2503附近尚未製作完成
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
        用途 : 創建指紋
        (特別說明: 兩組Array都要輸入 分開是因為不同資料表 而第二章表最後兩個值 是照片跟特徵點 到時候經過處理只剩下路徑)
        輸入 : ["ds_human_pk","ds_bind_id"] and ["f_linked_pk", "f_which_one", "pic", "minutiae"]        
        輸出 : 創建object or error
        不可輸入值: 無
        快速連結 : http://localhost:1337/api/F_linked/add?ds_name=ccc
    */
	add: function(req, res) {
        var params = req.params.all();        
        var check_array = ["ds_human_pk","ds_bind_id", "f_linked_pk", "f_which_one", "pic", "minutiae"];
        var check_result = no_call_service.check_data(params, check_array);
        
        if(check_result==""){
            //參數不缺少
            async.auto({
                //1.驗證人員資料是否有誤
                find_human: function (callback, results) {      
                    var cond = no_call_service.complete_cond(params, ["ds_human_pk","ds_bind_id"] , "ds_deleted");                    
                    Ds_human.findOne(cond).exec(function(err, human_Data){
                        if(err){                            
                            callback(null, "no");                     
                        }else{
                            callback(null, human_Data);                                                   
                        }
                    })	            
                },
                //2.無誤新增 錯誤阻擋
                create_flinked: ["find_human",function (callback, results) {                          
                    var human_obj = results.find_human;
                        if(_.isEmpty(human_obj)){
                            //空的表示沒有找到符合的human資料
                            no_call_service.write_log(table_name,"C_nodata", err, req.session.id, log_type);
                            return res.json({error:2501});
                        }else if(human_obj=="no"){
                            //no表示find human錯誤
                            no_call_service.write_log(table_name,"C_die", err, req.session.id, log_type);
                            return res.json({error:2502});
                        }else{
                            //有human資料 可以新增
                            F_linked.create(params).exec(function(err2,create_data){
                                if(err2){
                                    no_call_service.write_log(table_name,"C_die", err2, req.session.id, log_type);
                                    return res.json({error:2503});
                                }else{
                                    console.log(table_name,"C_ok");
                                    console.log(table_name, params);
                                    console.log(table_name, req.session.id);
                                    no_call_service.write_log(table_name,"C_ok", params, req.session.id, log_type);
                                    return res.json(create_data);                             
                                }           
                            })
                        }
                }]
            });    
        }else{
            //參數缺少 直接回應內容
            no_call_service.write_log(table_name,"C_less", params, req.session.id, log_type);
            return res.send(check_result);            
        }
    },
    /*
        用途 : 停止設備
        (特別說明: 兩組Array都要輸入 分開是因為不同資料表 而第二章表最後兩個值 是照片跟特徵點 到時候經過處理只剩下路徑)
        輸入 : ["ds_human_pk","ds_bind_id"] and ["f_linked_pk", "f_which_one", "pic", "minutiae"]        
        輸出 : 創建object or error
        不可輸入值: 無
        快速連結 : http://localhost:1337/api/F_linked/stop?F_linked_pk=1&ds_name=1&ds_bind_id=1
    */
	stop: function(req, res) {
        var moment = require('moment');
        var params = req.params.all();
        
        var check_array = ["f_linked_pk"];
        var check_result = no_call_service.check_data(params, check_array);
        if(check_result==""){
            //參數不缺少
            var cond = no_call_service.complete_cond(params, check_array, "ds_deleted");
            
            F_linked.update( cond ,{"ds_deleted": moment().toISOString()} ).exec(function(err,update_data){
                if(err){
                    no_call_service.write_log(table_name,"D_die", err, req.session.id, log_type);
                    return res.json({error:5501});
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

