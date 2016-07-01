/**
 * Ds_humanController
 *
 * @description :: Server-side logic for managing ds_humen
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
    var co = require('co');
    var moment = require("moment");
    var table_name = "Ds_human";
    var log_type = "human";
module.exports = {
	/*
        all網址 : http://localhost:1337/api/Ds_human/find
        C網址   : http://localhost:1337/api/Ds_human?type=C&name=kk
        R1網址  : http://localhost:1337/api/Ds_human?type=R1&name=kk
        R2網址  : http://localhost:1337/api/Ds_human?type=R2&id=576418303ec3e73425109da6
        U網址   : http://localhost:1337/api/Ds_human?type=U&id=576418303ec3e73425109da6&job=ks
        D網址   : http://localhost:1337/api/Ds_human?type=D&id=576418303ec3e73425109da6&name=kk
    */
	redirect: function(req, res) {
        co(function* () {                                                    
            var params = req.allParams();
            var who =  req.session.id;
            var return_obj = "";
            switch(params.type){
                case "C" : return_obj = yield human_service.create( params ,who); break;
                // case "R" : return_obj = yield human_service.search( params ); break;
                case "R1": return_obj = yield human_service.search1( params ,who); break;
                case "R2": return_obj = yield human_service.search2( params ,who); break;
                case "U" : return_obj = yield human_service.update( params ,who); break;
                case "D" : return_obj = yield human_service.destroy( params ,who); break;
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
        快速連結 : http://localhost:1337/api/Ds_human/find
    */
	find: function(req, res){   
        Ds_human.find().sort("updatedAt desc").exec(function(err,find_data){
                if(err){
                    // no_call_service.write_log(table_name,"R_all_die", err, req.session.id, log_type);
                    return res.json({error:1201});
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
            "ds_human_pk", 
            "ds_birthday", 
            "ds_gender", 
            "ds_bloodtype", 
            "ds_job", 
            "ds_name", 
            "ds_bind_id", 
            "ds_is_manager"        
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
                Ds_human.count({ ds_deleted: {"$exists":false} } ).exec(function(err, result){
                    callback(null, result);  
                });	            
            },
            find_iTotalDisplayRecords: function (callback, results) {      
                Ds_human.count(options).exec(function(err, result){
                    callback(null, result);  
                });	            
            },
            find_data:["find_iTotalRecords","find_iTotalDisplayRecords", function (callback, results) {      
                var options2 = options;
                options2.skip = req.query.iDisplayStart;
                options2.limit = req.query.iDisplayLength;
                
                Ds_human.find(options2).exec(function(err, fdata){
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
                            if(one_data.ds_birthday){
                                push_obj.ds_birthday  = moment(one_data.ds_birthday).format("YYYY-MM-DD");
                            }
                            push_obj.final_modify = "<a href='/human/edit/"+one_data.ds_human_pk+"'>修改</a> <a href='/human/delete/"+one_data.ds_human_pk+"/"+one_data.ds_name+"' onclick='return delete_click()'>刪除</a>";                    
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

