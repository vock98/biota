/**
 * Ds_fingerprint_apController
 *
 * @description :: Server-side logic for managing ds_fingerprint_aps
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
    var co = require('co');
    var moment = require("moment");
    var table_name = "Ds_fingerprint_ap";
    var log_type = "device";
    
module.exports = {
    /*
        all網址 : http://localhost:1337/api/Ds_fingerprint_ap/find
        C網址   : http://localhost:1337/api/Ds_fingerprint_ap?type=C&ds_ap_id=1&ds_platform_type=plattype1&ds_device_type=devicetype1
        R1網址  : http://localhost:1337/api/Ds_fingerprint_ap?type=R1&id=1
        R2網址  : http://localhost:1337/api/Ds_fingerprint_ap?type=R2&id=1
        U網址   : http://localhost:1337/api/Ds_fingerprint_ap?type=U&id=1&device_type=kk&platform_type=js
        D網址   : http://localhost:1337/api/Ds_fingerprint_ap?type=D&id=1&device_type=kk&platform_type=js
    */
	redirect: function(req, res) {
        co(function* () {                                                    
            var params = req.allParams();
            var who =  req.session.id;
            var return_obj = "";
            switch(params.type){ 
                case "C" : return_obj = yield ap_service.create( params ,who); break;
                // case "R" : return_obj = yield ap_service.search( params ); break;
                case "R1": return_obj = yield ap_service.search1( params ,who); break;
                case "R2": return_obj = yield ap_service.search2( params ,who); break;
                case "U" : return_obj = yield ap_service.update( params ,who); break;
                case "D" : return_obj = yield ap_service.destroy( params ,who); break;
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
        快速連結 : http://localhost:1337/api/Ds_fingerprint_ap/find
    */
	find: function(req, res) {
        Ds_fingerprint_ap.find().exec(function(err,find_data){
            return res.json(find_data);                               
        })
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

