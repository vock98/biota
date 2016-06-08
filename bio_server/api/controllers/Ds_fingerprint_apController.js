/**
 * Ds_fingerprint_apController
 *
 * @description :: Server-side logic for managing ds_fingerprint_aps
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
    var moment = require("moment");
    var table_name = "Ds_fingerprint_ap";
    var log_type = "device";
module.exports = {
	/*
        用途 : 查看內容
        輸入 : 無
        輸出 : 整個DB
        快速連結 : http://localhost:1337/api/Ds_fingerprint_ap/find
    */
	find: function(req, res) {
        Ds_fingerprint_ap.find().exec(function(err,find_data){
                if(err){
                    no_call_service.write_log(table_name,"R_all_die", err, req.session.id, log_type);
                    return res.json({error:1001});
                }else{
                    no_call_service.write_log(table_name,"R_all", "",req.session.id, log_type);
                    return res.json(find_data);                               
                }
        })
    },
    /*
        用途 : 創建設備
        輸入 : ["ds_ap_id", "ds_platform_type", "ds_device_type"]
        輸出 : 創建object or error
        不可輸入值 : 無
        快速連結 : http://localhost:1337/api/Ds_fingerprint_ap/C?ds_ap_id=1&ds_platform_type=plattype1&ds_device_type=devicetype1
    */
	C: function(req, res) {
        var params = req.allParams(); delete params["id"];  
        var check_array = ["ds_ap_id", "ds_platform_type", "ds_device_type"];
        var check_result = no_call_service.check_data(params, check_array);            
        if(check_result==""){
            //參數不缺少
            Ds_fingerprint_ap.create(params).exec(function(err,create_data){
                if(err){
                    no_call_service.write_log(table_name,"C_die", err, req.session.id, log_type);
                    return res.json({error:2002});
                }else{
                    no_call_service.write_log(table_name,"C_ok", params, req.session.id, log_type);
                    if(params.submit_to_link){
                        //如果有網址代表要直接轉頁
                        return res.redirect( params.submit_to_link );
                    }else{
                        return res.json(create_data);                                                     
                    }
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
        輸入 : ds_ap_id or ["ds_platform_type", "ds_device_type"]
        輸出 : 整個DB查到的資料(會呈現Human資料給使用者看)
        不可輸入值 : ["push_token"]
        快速連結 : http://localhost:1337/api/Ds_fingerprint_ap/R1?ds_ap_id=1
    */
	R1: function(req, res) {
        var params = req.allParams(); delete params["id"];
        //有不可填寫的參數即擋下
        var cannot_param = ["push_token"];
        var check_cannot = no_call_service.check_ignore_data(params, cannot_param);
        if(check_cannot){
            no_call_service.write_log(table_name,"R1_error_data", params, req.session.id, log_type);
            return res.json({error:2001});
        }
          
        if(params.ds_ap_id){
            var check_array = ["ds_ap_id","ds_platform_type","ds_device_type"];
            var cond = no_call_service.complete_not_cond(params, check_array, "ds_deleted");
            
            Ds_fingerprint_ap.findOne(cond).exec(function(err,find_data){
                    if(err){
                        no_call_service.write_log(table_name,"R1_die", err, req.session.id, log_type);
                        return res.json({error:3001});
                    }else{                        
                        //撈取符合的使用者資料
                        if( _.isEmpty(find_data) ){
                            //查無資料直接回傳
                            no_call_service.write_log(table_name,"R1_no_data", params, req.session.id, log_type);
                            return res.json(find_data);    
                        }else{
                            F_linked.find({ds_ap_id: cond.ds_ap_id}).exec(function(err,flinked_data){
                                if(err){
                                    no_call_service.write_log(table_name,"R1_Flink_die", err, req.session.id, log_type);
                                    return res.json({error:3002});
                                }else{
                                    no_call_service.write_log(table_name,"R1_ok", params, req.session.id, log_type);
                                    find_data.human = _.pluck(flinked_data, "ds_human_pk");
                                    return res.json([find_data]);                                    
                                }
                            });
                        }                          
                    }          
            })
        }else{
            //其餘一律error
            var error_msg = "error AP001";
            console.log("error_msg_R1",error_msg);
            no_call_service.write_log(table_name,"R1_err", params, req.session.id, log_type);
            return res.send(error_msg);
        }
    },
    /*
        用途 : 查看搜尋內容 (R2)
        輸入 : ["ds_ap_id"]
        輸出 : 整個DB查到的資料
        不可輸入值 : ["ds_device_type", "ds_platform_type", "push_token"]
        快速連結 : http://localhost:1337/api/Ds_fingerprint_ap/R2?ds_ap_id=1
    */
	R2: function(req, res) {
        var params = req.allParams(); delete params["id"];
        //有不可填寫的參數即擋下
        var cannot_param = ["ds_device_type", "ds_platform_type", "push_token"];
        var check_cannot = no_call_service.check_ignore_data(params, cannot_param);
        if(check_cannot){
            no_call_service.write_log(table_name,"R_error_data", params, req.session.id, log_type);
            return res.json({error:3003});
        }
        
        var cond = {};
        if(params.ds_ap_id){
            //有ID優先用ID
            var check_array = ["ds_ap_id"];
            var cond = no_call_service.complete_cond(params, check_array, "ds_deleted");
            Ds_fingerprint_ap.findOne(cond).exec(function(err,find_data){
                    if(err){
                        no_call_service.write_log(table_name,"R2_die", err, req.session.id, log_type);
                        return res.json({error:3004});
                    }else{
                        no_call_service.write_log(table_name,"R2_ok", params, req.session.id, log_type);
                        return res.json(find_data);                              
                    }          
            })
        }else{
            //其餘一律error
            var error_msg = "error AP002";
            console.log("error_msg_R2",error_msg);
            no_call_service.write_log(table_name,"R2_err", params, req.session.id, log_type);
            return res.send(error_msg);
        }
    },    
    /*
        用途 : 修改設備
        輸入 : ["ds_ap_id", "ds_platform_type", "ds_device_type"]
        輸出 : 修改的object結果 or error
        不可輸入值: 無
        快速連結 : http://localhost:1337/api/Ds_fingerprint_ap/U?ds_ap_id=1&ds_platform_type=plattype2&ds_device_type=devicetype2
    */
	U: function(req, res) {
        var params = req.allParams(); delete params["id"];
        var check_array = ["ds_ap_id", "ds_platform_type", "ds_device_type"];
        var check_result = no_call_service.check_data(params, check_array);
        if(check_result==""){
            //參數不缺少
            var cond = no_call_service.complete_cond(params, ["ds_ap_id"], "ds_deleted");
            Ds_fingerprint_ap.update( cond, params ).exec(function(err,update_data){
                if(err){
                    no_call_service.write_log(table_name,"U_die", err, req.session.id, log_type);
                    return res.json({error:4001});
                }else{
                    no_call_service.write_log(table_name,"U_ok", cond, req.session.id, log_type);
                    if(params.submit_to_link){
                        //如果有網址代表要直接轉頁
                        return res.redirect( params.submit_to_link );
                    }else{
                        return res.json(update_data);                                                     
                    }
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
        輸入 : ["ds_ap_id"]
        輸出 : 刪除的object結果 or error
        不可輸入值 : ["push_token"]
        快速連結 : http://localhost:1337/api/Ds_fingerprint_ap/D?ds_ap_id=1
    */
	D: function(req, res) {
        var params = req.allParams(); delete params["id"];
        //有不可填寫的參數即擋下
        var cannot_param = ["push_token"];
        var check_cannot = no_call_service.check_ignore_data(params, cannot_param);
        if(check_cannot){
            no_call_service.write_log(table_name,"D_error_data", params, req.session.id, log_type);
            return res.json({error:5001});
        }
        
        var check_array = ["ds_ap_id"];
        var check_result = no_call_service.check_data(params, check_array);
        if(check_result==""){
            //參數不缺少
            var cond = no_call_service.complete_cond(params, check_array, "ds_deleted");
            Ds_fingerprint_ap.update( cond ,{"ds_deleted": moment().toISOString()} ).exec(function(err,update_data){
                if(err){
                    no_call_service.write_log(table_name,"D_die", err, req.session.id, log_type);
                    return res.json({error:5002});
                }else{
                    no_call_service.write_log(table_name,"D_ok", params, req.session.id, log_type);
                    if(params.submit_to_link){
                        //如果有網址代表要直接轉頁
                        return res.redirect( params.submit_to_link );
                    }else{
                        return res.json(update_data);                                                     
                    }
                }
            })       
        }else{
            //參數缺少 直接回應內容
            no_call_service.write_log(table_name,"D_less", params, req.session.id, log_type);
            return res.send(check_result);            
        }
    },
    /*
        ajax撈取全部資料專用
    */
    viewAll: function(req, res) {
        //----定義所有欄位
        var cols_array = [
            "ds_ap_id", 
            "ds_device_type", 
            "ds_gender", 
            "ds_platform_type", 
            "ds_push_token", 
            "updatedAt"   
        ];
        
        //產生右上角用的搜尋條件
        var search_or_cond = _.map(cols_array,function(cols){
                var return_obj ={};
                return_obj[cols] = {'contains': req.query.sSearch};
                return return_obj; 
            });
            
        //搜尋用的waterline    
        var options = {
            where: { 
                ds_deleted: {"$exists":false},
                or: search_or_cond,            
            }, 
            sort: cols_array[req.query.iSortCol_0] +' '+ req.query.sSortDir_0,
        };
        
        async.auto({
            find_iTotalRecords: function (callback, results) {      
                Ds_fingerprint_ap.count({ ds_deleted: {"$exists":false} } ).exec(function(err, result){
                    callback(null, result);  
                });	            
            },
            find_iTotalDisplayRecords: function (callback, results) {      
                Ds_fingerprint_ap.count(options).exec(function(err, result){
                    callback(null, result);  
                });	            
            },
            find_data:["find_iTotalRecords","find_iTotalDisplayRecords", function (callback, results) {      
                var options2 = options;
                options2.skip = req.query.iDisplayStart;
                options2.limit = req.query.iDisplayLength;
                
                Ds_fingerprint_ap.find(options2).exec(function(err, fdata){
                    if(err){
                        res.send(500, { error: 'DB error' });
                    } else {
                        //製作 前端產生結果
                        var retuser = [];
                        fdata.forEach(function(one_data){
                            var push_obj ={};
                            _.each(cols_array,function(cols){
                                push_obj[cols] = one_data[cols]||"";
                            });
                            //----需要特殊處理的另外寫
                            if(one_data.updatedAt){
                                push_obj.updatedAt  = moment(one_data.updatedAt).format("YYYY-MM-DD HH:mm:ss");
                            }
                            var modify_url = "/ap/edit/"+one_data.ds_ap_id
                            var delete_url = "/ap/delete/"+one_data.ds_ap_id+"/"+one_data.ds_device_type+"/"+one_data.ds_platform_type;
                            push_obj.final_modify = "<a href='"+modify_url+"'>修改</a> <a href='"+delete_url+"' onclick='return delete_click()'>刪除</a>";                    
                            retuser.push( push_obj );
                        });
                        
                        var json = {
                            aaData: retuser,
                            iTotalRecords: results.find_iTotalRecords,
                            iTotalDisplayRecords: results.find_iTotalDisplayRecords
                        };
                        res.contentType('application/json');
                        res.json(json);
                    }
                });	            
            }]
        })//async end
    },
};

