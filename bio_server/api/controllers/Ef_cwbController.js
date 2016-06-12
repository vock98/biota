/**
 * Ef_cwbController
 *
 * @description :: Server-side logic for managing ef_cwbs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
    var table_name = "Ef_cwb";
    var log_type = "out";
module.exports = {
	/*
        用途 : 查看內容
        輸入 : 無
        輸出 : 整個DB
        不可輸入值: 無
        快速連結 : http://localhost:1337/api/Ef_cwb/find
    */
	find: function(req, res) {
        Ef_cwb.find().exec(function(err,find_data){
                if(err){
                    no_call_service.write_log(table_name,"R_all_die", err, req.session.id, log_type);
                    return res.json({error:1601});
                }else{
                    no_call_service.write_log(table_name,"R_all", "",req.session.id, log_type);
                    return res.json(find_data);                               
                }
        })
    },
    /*
        用途 : 創建天氣
        輸入 : ["ef_sitename","ef_source", "ef_item", "ef_date", "ef_time","ef_value"]        
        輸出 : 創建object or 更新object or error
        不可輸入值: ["from", "to"]
        快速連結 : http://localhost:1337/api/Ef_cwb/C?ef_sitename=a&ef_source=a2&ef_item=a3&ef_date=20110101&ef_time=00
    */
	C: function(req, res) {
        var params = req.allParams(); delete params["id"];
        //有不可填寫的參數即擋下
        var cannot_param = ["from", "to"];
        var check_cannot = no_call_service.check_ignore_data(params, cannot_param);
        if(check_cannot){
            no_call_service.write_log(table_name,"C_error_data", params, req.session.id, log_type);
            return res.json({error:2601});
        }
        
        var check_array = ["ef_sitename","ef_source", "ef_item", "ef_date", "ef_time","ef_value"];
        var check_result = no_call_service.check_data(params, check_array);
        
        if(check_result==""){
            //參數不缺少
            var new_params = no_call_service.convert_time(params);
            Ef_cwb.findOne(new_params[0]).exec(function(err, cwb_Data){
                if(err){                            
                    no_call_service.write_log(table_name,"C_die", err, req.session.id, log_type);
                    return res.json({error:2602});                    
                }else{
                    if( _.isEmpty(cwb_Data) ){
                        //表示沒有抓到值 要新增一筆
                        Ef_cwb.create(new_params[1]).exec(function(err2, add_data){
                             if(err2){                            
                                no_call_service.write_log(table_name,"C_die", err2, req.session.id, log_type);
                                return res.json({error:2603});                    
                            }else{
                                no_call_service.write_log(table_name,"C_ok", params,req.session.id, log_type);
                                return res.json(add_data);  
                            }
                        })
                    }else{
                        //表示有抓到值 要更新資料
                        Ef_cwb.update(new_params[0],new_params[1]).exec(function(err3, up_data){
                             if(err){                            
                                no_call_service.write_log(table_name,"C_die", err, req.session.id, log_type);
                                return res.json({error:2604});                    
                            }else{
                                no_call_service.write_log(table_name,"C_ok", params,req.session.id, log_type);
                                return res.json(up_data);  
                            }
                        })
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
        用途 : 查看搜尋內容 
        輸入 : ["from", "to"]
        輸出 : 整個DB查到的資料
        不可輸入值 : ["ef_value"]
        快速連結 : http://localhost:1337/api/Ef_cwb/R?from=20160101&to=20160105
    */
	R: function(req, res) {
        var params = req.allParams(); delete params["id"];
        //有不可填寫的參數即擋下
        var cannot_param = ["ef_value"];
        var check_cannot = no_call_service.check_ignore_data(params, cannot_param);
        if(check_cannot){
            no_call_service.write_log(table_name,"R_error_data", params, req.session.id, log_type);
            return res.json({error:3601});
        }
          
        var check_array = ["from", "to"];
        var check_result = no_call_service.check_data(params, check_array);
        
        if(check_result==""){
            //參數不缺少
            var moment = require('moment');
            params.createdAt = { '>': moment(params.from).startOf('day').toISOString(), '<': moment(params.to).endOf('day').toISOString() };
            delete params['from'];
            delete params['to'];
            delete params['id'];
            Ef_cwb.find(params).exec(function(err, cwb_Data){
                if(err){                            
                    no_call_service.write_log(table_name,"R_die", err, req.session.id, log_type);
                    return res.json({error:2602});                    
                }else{
                    no_call_service.write_log(table_name,"R_ok", params,req.session.id, log_type);
                    return res.json(cwb_Data);                                                   
                }
            })  
        }else{
            //參數缺少 直接回應內容
            no_call_service.write_log(table_name,"R_less", params, req.session.id, log_type);
            return res.send(check_result);            
        }
    },
    list: function(req, res) {
        var return_obj = {};
        return_obj.now_url = "中央氣象局環境資料";
        return res.view( false , return_obj );    
    },
    /*
        ajax撈取全部資料專用
    */
    viewAll: function(req, res) {
        //----定義所有欄位
        var cols_array = [
            "ef_sitename",
            "ef_item"  ,
            "ef_date"    ,
            "ef_h00"     ,
            "ef_h01"     ,
            "ef_h02"     ,
            "ef_h03"     ,
            "ef_h04"     ,
            "ef_h05"     ,
            "ef_h06"     ,
            "ef_h07"     ,
            "ef_h08"     ,
            "ef_h09"     ,
            "ef_h10"     ,
            "ef_h11"     ,
            "ef_h12"     ,
            "ef_h13"     ,
            "ef_h14"     ,
            "ef_h15"     ,
            "ef_h16"     ,
            "ef_h17"     ,
            "ef_h18"     ,
            "ef_h19"     ,
            "ef_h21"     ,
            "ef_h22"     ,
            "ef_h23"     
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
                Ef_cwb.count({ ds_deleted: {"$exists":false} } ).exec(function(err, result){
                    callback(null, result);  
                });	            
            },
            find_iTotalDisplayRecords: function (callback, results) {      
                Ef_cwb.count(options).exec(function(err, result){
                    callback(null, result);  
                });	            
            },
            find_data:["find_iTotalRecords","find_iTotalDisplayRecords", function (callback, results) {      
                var options2 = options;
                options2.skip = req.query.iDisplayStart;
                options2.limit = req.query.iDisplayLength;
                
                Ef_cwb.find(options2).exec(function(err, fdata){
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
                            // if(one_data.ef_item){
                                // push_obj.ef_item  = no_call_service.change_type_to_ch(one_data.ef_item);
                            // }
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