/**
 * TableController
 *
 * @description :: Server-side logic for managing tables
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


var moment = require('moment');
var co = require('co');

module.exports = {
	//列表頁面 http://localhost:1337/table/human
	table_human:function(req,res){
        co(function* () {                                                    
            var return_obj = {};
            return_obj.now_url = "人員進出報表";
            return res.view( false , return_obj );  
        }).catch(function(err){
            res.send("錯誤");
        });           
	},
    //列表頁面 http://localhost:1337/table/device
	table_device:function(req,res){
        co(function* () {
            var params = req.allParams();            
            var return_obj = {};
            var sitename_option = yield call_service.find_ap_option(); //產生設備選單
            var select_ap = params.select_ap || sitename_option[0].text; //下拉預設值 
            var device_record = yield call_service.find_device_record(select_ap); // 天氣資料
            
            return_obj.now_url = "設備操作記錄報表";
            return_obj.fake_obj = device_record;
            return_obj.sitename_option = sitename_option;
            return_obj.select_ap = select_ap;
            return_obj.form_action = "/table/device";
            
            return res.view( false , return_obj );  
        }).catch(function(err){
            res.send("錯誤");
        });          
	},
    //列表頁面 http://localhost:1337/table/far
	table_far:function(req,res){
        co(function* () {
            var params = req.allParams();            
            var return_obj = {};
            // var weather = yield call_service.find_self_weather(); // 天氣資料
            var sitename_option = yield call_service.find_nation_option(); //產生選單
            var select_area = params.select_area || sitename_option[0].text; //下拉預設值 
            var weather = yield call_service.find_nation_weather(select_area); // 天氣資料
            
            return_obj.now_url = "FAR 分析報表";
            return_obj.fake_obj = weather;
            return_obj.sitename_option = sitename_option;
            return_obj.select_area = select_area;
            return_obj.form_action = "/table/far";
            
            return res.view( false , return_obj );  
        }).catch(function(err){
            res.send("錯誤");
        });          
	},
    /*
        ajax撈取全部資料專用
    */
    human_all: function(req, res) {
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
