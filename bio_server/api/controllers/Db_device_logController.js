/**
 * Db_logController
 *
 * @description :: Server-side logic for managing db_logs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var moment = require("moment");
module.exports = {
	/*
        用途 : 查看內容
        輸入 : 無
        輸出 : 整個DB
        快速連結 : http://localhost:1337/api/Db_device_log/find
    */
	find: function(req, res) {
        var params = req.allParams(); delete params["id"];
        delete params.id;
                if(err){
                    return res.json({error:1001});
                }else{
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
            "table_name",
            "CRUD",
            "input_cond",
            "who",
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
                Db_device_log.count({ ds_deleted: {"$exists":false} } ).exec(function(err, result){
                    callback(null, result);  
                });	            
            },
            find_iTotalDisplayRecords: function (callback, results) {      
                Db_device_log.count(options).exec(function(err, result){
                    callback(null, result);  
                });	            
            },
            find_data:["find_iTotalRecords","find_iTotalDisplayRecords", function (callback, results) {      
                var options2 = options;
                options2.skip = req.query.iDisplayStart;
                options2.limit = req.query.iDisplayLength;
                
                Db_device_log.find(options2).exec(function(err, fdata){
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
                                    var stringi = JSON.stringify(one_data.input_cond);                           
                                push_obj.input_cond  = `
                                <div style='display:none' class='o_content'>${stringi}</div>
                                <button onclick="bubble_click('操作情形', $(this).prev('.o_content').html() )">詳細內容按我</button>
                                `;
                            }
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

