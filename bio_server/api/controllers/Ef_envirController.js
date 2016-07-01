/**
 * Ef_envirController
 *
 * @description :: Server-side logic for managing ef_envirs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

    var table_name = "Ef_envir";
    var log_type = "out";
    var moment = require('moment');
    var co = require('co');
module.exports = {
    /*
        all網址 : http://localhost:1337/api/Ef_envir/find
        C網址   : http://localhost:1337/api/Ef_envir?type=C&datetime=2016-06-20T09:36:47.166Z&desc=aa&temp=50&humd=20
        R網址   : http://localhost:1337/api/Ef_envir?type=R&from=20160618&to=20160621
        U網址   : http://localhost:1337/api/Ef_envir?type=U&envir_pk=5767ccf592278110174624fe&ef_desc=dd
        D網址   : http://localhost:1337/api/Ef_envir?type=D&envir_pk=5767ccf592278110174624fe
    */
	redirect: function(req, res) {
        co(function* () {                                                    
            var params = req.allParams();
            var who =  req.session.id;
            var return_obj = "";
            switch(params.type){
                case "C" : return_obj = yield envir_service.create( params ,who); break;
                case "R" : return_obj = yield envir_service.search( params ,who ); break;
                // case "R1": return_obj = yield envir_service.search1( params ,who); break;
                // case "R2": return_obj = yield envir_service.search2( params ,who); break;
                case "U" : return_obj = yield envir_service.update( params ,who); break;
                case "D" : return_obj = yield envir_service.destroy( params ,who); break;
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
        快速連結 : http://localhost:1337/api/Ef_envir/find
    */
	find: function(req, res) {
        Ef_envir.find().sort("updatedAt desc").exec(function(err,find_data){
                if(err){
                    // no_call_service.write_log(table_name,"R_all_die", err, req.session.id, log_type);
                    return res.json({error:1701});
                }else{
                    // no_call_service.write_log(table_name,"R_all", "",req.session.id, log_type);
                    return res.json(find_data);                               
                }
        })
    },
    /*
        ajax撈取全部資料專用
    */
    viewAll: function(req, res) {
        //----定義所有欄位
        var cols_array = [
            "ef_datetime",
            "ef_desc",
            "ef_pic_path",
            "ef_temp",
            "ef_humd"
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
                Ef_envir.count({ ds_deleted: {"$exists":false} } ).exec(function(err, result){
                    callback(null, result);  
                });	            
            },
            find_iTotalDisplayRecords: function (callback, results) {      
                Ef_envir.count(options).exec(function(err, result){
                    callback(null, result);  
                });	            
            },
            find_data:["find_iTotalRecords","find_iTotalDisplayRecords", function (callback, results) {      
                var options2 = options;
                options2.skip = req.query.iDisplayStart;
                options2.limit = req.query.iDisplayLength;
                
                Ef_envir.find(options2).exec(function(err, fdata){
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
                            if(one_data.ef_datetime){
                                push_obj.ef_datetime  = moment(one_data.ef_datetime).format("YYYY-MM-DD HH:mm");
                            }
                            var modify_url = "/envir/edit/"+one_data.ef_envir_pk;
                            var delete_url = "/envir/delete/"+one_data.ef_envir_pk;
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

