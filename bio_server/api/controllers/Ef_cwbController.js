/**
 * Ef_cwbController
 *
 * @description :: Server-side logic for managing ef_cwbs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
    var co = require('co');
    var moment = require("moment");
    var table_name = "Ef_cwb";
    var log_type = "out";
module.exports = {
    /*
        all網址 : http://localhost:1337/api/Ef_cwb/find
        C網址   : http://localhost:1337/api/Ef_cwb?type=C&ef_sitename=12&ef_source=TEMP&ef_item=34&ef_date=20160101&ef_time=08&ef_value=50
        R網址   : http://localhost:1337/api/Ef_cwb?type=R&from=20160101&to=20160102
    */
	redirect: function(req, res) {
        co(function* () {                                                    
            var params = req.allParams();
            var who =  req.session.id;
            var return_obj = "";
            switch(params.type){
                case "C" : return_obj = yield cwb_service.create( params ,who); break;
                case "R" : return_obj = yield cwb_service.search( params ,who ); break;
                // case "R1": return_obj = yield cwb_service.search1( params ,who); break;
                // case "R2": return_obj = yield cwb_service.search2( params ,who); break;
                // case "U" : return_obj = yield cwb_service.update( params ,who); break;
                // case "D" : return_obj = yield cwb_service.destroy( params ,who); break;
                default: return_obj = no_call_service.add_biota_result( {} , false , "type 不正確" , ["type 不正確"] );
            }
            var submit_to_link = req.param("submit_to_link");
            if(return_obj.result.success && submit_to_link ){ //如果有網址代表要直接轉頁
                return res.redirect( submit_to_link );
            }else{                                                    
                return res.json( return_obj );
            }
        }).catch(function(err){
            console.log(table_name+"_second_routes_error",err);
            return res.send( table_name+"_second_routes_error");
        });
    },
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