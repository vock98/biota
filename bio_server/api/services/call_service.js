var moment = require('moment');
//此處出現的都是co要用的
module.exports = {
    //製作非refernce的obj
    goclone:function(source) {
        if (Object.prototype.toString.call(source) === '[object Array]') {
            var clone = [];
            for (var i=0; i<source.length; i++) {
                clone[i] = call_service.goclone(source[i]);
            }
            return clone;
        } else if (typeof(source)=="object") {
            var clone = {};
            for (var prop in source) {
                if (source.hasOwnProperty(prop)) {
                    clone[prop] =  call_service.goclone(source[prop]);
                }
            }
            return clone;
        } else {
            return source;
        }
    },
    //撈出門禁csv專用資料
	find_csv:function(){
        return new Promise(function(resolve, reject){
            //找出門禁紀錄
            var cond = {
                table_name: "Comparison_client"
            }
            Db_human_log.find( cond ).exec(function(err,find_data){
                if(err) reject(new Error("csv error :"+err));
                var final_data = _.map(find_data,function(one_data){
                    var default_action ="建立遠端 MatchLog";
                    var status = one_data.CRUD.substr(one_data.CRUD.indexOf("_")+1); //找到第一個_之後的文字
                    switch(status){
                        case "ok":
                            var default_desc ="建立遠端 MatchLog(MatchLog"+JSON.stringify(one_data.input_cond)+") 成功";                        
                            break;
                        case "err":
                            var default_desc ="建立遠端 MatchLog(MatchLog"+JSON.stringify(one_data.input_cond)+") 錯誤";                        
                            break;
                        case "no_data":
                        case "no_data1":
                        case "no_data2":
                            var default_desc ="建立遠端 MatchLog(MatchLog"+JSON.stringify(one_data.input_cond)+") 無資料";                        
                            break;
                        default:
                            var default_desc ="建立遠端 MatchLog(MatchLog"+JSON.stringify(one_data.input_cond)+") 意外狀況";                        
                            break;
                    }
                    var return_obj ={};
                    return_obj.Datetime     = one_data.createdAt;
                    return_obj.Action       = status;
                    return_obj.User         = one_data.who;
                    return_obj.Description  = default_desc;
                    return_obj.Result       = "true";
                    return return_obj;
                })
                resolve(final_data);
            })   
        });
    },
    //撈出天氣資料 給呈現圖表使用(手動輸入)
	find_self_weather:function(input_cond){
        return new Promise(function(resolve, reject){
            Ef_envir.find( input_cond ).exec(function(err,find_data){
                if(err) reject(new Error("Ef_envir error :"+err));
                var return_obj = _.map(find_data, function(one_data) {
                    return {
                        datetime: moment(one_data.ef_datetime).format("YYYY-MM-DD HH:mm"), 
                            temp: one_data.ef_temp, 
                            humd: one_data.ef_humd,
                    };
                });
                resolve(return_obj);
            })   
        });
    },
    //撈出AP做成option
	find_ap_option:function( input_sitename ){
        return new Promise(function(resolve, reject){
            Ds_fingerprint_ap.find().exec(function(err,find_data){
                if(err) reject(new Error("Ds_fingerprint_ap error :"+err));
                var sitename_obj = _.uniq(_.pluck(find_data,"ds_ap_id"));
                var return_obj = _.map(sitename_obj, function(one_data) {
                    return {
                        text: one_data, 
                        value: one_data
                    };
                });
                resolve(return_obj);
            })   
        });
    },
    //撈出設備紀錄
	find_device_record:function(input_ap){
        return new Promise(function(resolve, reject){
            var options = { 
                table_name:["Ds_fingerprint_ap","Ds_fingerprint_device"],
                createdAt:{ '>=': moment().subtract(50, 'day').startOf('day').toISOString() , '<=': moment().endOf('day').toISOString() }
            };
            
            Db_device_log.find( options ).exec(function(err,find_data){ 
                if(err) reject(new Error("Db_device_log error :"+err));
                var first_array=[];
                var return_obj=[];
                
                _.each(find_data, function(one_data) {
                    if(one_data.input_cond.id != input_ap)return;
                    var now_day =  moment(one_data.createdAt).format("YYYY-MM-DD");
                    if(!first_array[now_day])first_array[now_day] = {
                                                                        datetime : now_day,
                                                                        success : 0,
                                                                        fail : 0,
                                                                    };
                    
                    if(one_data.CRUD.substr(2) == "ok"){
                        first_array[now_day]["success"] = first_array[now_day]["success"]+1;
                    }else{
                        first_array[now_day]["fail"] = first_array[now_day]["fail"]+1;                        
                    }
                });
                //都用.each會同步
                for(var key in first_array){
                    return_obj.push(first_array[key]);                    
                }

                resolve(return_obj);
            })   
        });
    },
    //撈出天氣sitename做成optiono
	find_nation_option:function( input_sitename ){
        return new Promise(function(resolve, reject){
            Ef_cwb.find({ef_source:"NOW"}).exec(function(err,find_data){
                if(err) reject(new Error("Ef_envir error :"+err));
                var sitename_obj = _.uniq(_.pluck(find_data,"ef_sitename"));
                var return_obj = _.map(sitename_obj, function(one_data) {
                    return {
                        text: one_data, 
                        value: one_data
                    };
                });
                resolve(return_obj);
            })   
        });
    },
    //撈出天氣資料 給呈現圖表使用(氣象局輸入)
	find_nation_weather:function(input_sitename){
        return new Promise(function(resolve, reject){
            //WDSD = 風速 TEMP = 溫度 HUMD = 相對濕度 PRES = 氣壓 H_24R = 日累積雨量  
            var options = { 
                ef_sitename: input_sitename,
                ef_item:["TEMP","HUMD"],
                ef_date:{ '>=': moment().subtract(50, 'day').format("YYYY-MM-DD"), '<=': moment().format("YYYY-MM-DD") }
            };
            Ef_cwb.find( options ).exec(function(err,find_data){ 
                if(err) reject(new Error("Ef_envir error :"+err));
                var first_array=[];
                var return_obj=[];
                
                _.each(find_data, function(one_data) {
                    var temp_array = _.without([
                        one_data.ef_h00,one_data.ef_h10,one_data.ef_h20,
                        one_data.ef_h01,one_data.ef_h11,one_data.ef_h21,
                        one_data.ef_h02,one_data.ef_h12,one_data.ef_h22,
                        one_data.ef_h03,one_data.ef_h13,one_data.ef_h23,
                        one_data.ef_h04,one_data.ef_h14,
                        one_data.ef_h05,one_data.ef_h15,
                        one_data.ef_h06,one_data.ef_h16,
                        one_data.ef_h07,one_data.ef_h17,
                        one_data.ef_h08,one_data.ef_h18,
                        one_data.ef_h09,one_data.ef_h19,                                       
                    ],0);
                    var sum = _.reduce( temp_array, function(memo, num){ return memo + num; }, 0); //算出總和
                    var average = Math.round(sum / (temp_array.length) *100 )/100;
                    if(!first_array[one_data.ef_date])first_array[one_data.ef_date] = {};
                    first_array[one_data.ef_date]["datetime"] = one_data.ef_date;
                    first_array[one_data.ef_date][one_data.ef_item] = average;
                });
                //都用.each會同步
                for(var key in first_array){
                    return_obj.push(first_array[key]);                    
                }

                resolve(return_obj);
            })   
        });
    },
    //撈出f_linked資料的(單一)
	find_flinked:function(input_cond){
        return new Promise(function(resolve, reject){
            F_linked.findOne( input_cond ).exec(function(err,find_data){
                if(err) reject(new Error("f_linked error :"+err));
                resolve(find_data);
            })   
        });
    },
    //撈出human資料的(單一)
	find_human:function(input_cond){
        return new Promise(function(resolve, reject){
            Ds_human.findOne( input_cond ).exec(function(err,find_data){
                if(err) reject(new Error("Ds_human error :"+err));
                resolve(find_data);
            })   
        });
    },
    //撈出AP資料的id供下拉選單用
	find_ap_id:function(){
        return new Promise(function(resolve, reject){
            Ds_fingerprint_ap.find({ds_deleted:{"$exists":false}}).exec(function(err,find_data){
                if(err) reject(new Error("ap_id error :"+err));
                var return_array =[];
                _.map(find_data,function(one_data){
                    return_array.push({text: one_data.ds_ap_id, value: one_data.ds_ap_id})
                })
                resolve(return_array);
            })   
        });
    },
    //撈出AP資料的DB
	find_ap_data:function(){
        return new Promise(function(resolve, reject){
            Ds_fingerprint_ap.find().exec(function(err,find_data){
                if(err) reject(new Error("Ap error :"+err));
                resolve(find_data);
            })   
        });
    },
    //撈出device資料的一筆
	find_device_data:function(ap_id, device_id){
        return new Promise(function(resolve, reject){
            var cond ={};
            cond.ds_ap_id = ap_id;
            cond.ds_device_id = device_id;
            Ds_fingerprint_device.findOne(cond).exec(function(err,find_data){
                if(err) reject(new Error("device error :"+err));
                resolve(find_data);
            })	
        });
    },
    //檢查必填及不可填欄位
	check_fill_nfill:function(input_params, fill_array, nfill_array){
        return new Promise(function(resolve, reject){            
            var input_copy = call_service.goclone(input_params);
            var return_array =[];
            
            _.map(fill_array, function(num){
                if( input_copy[num] == undefined ) return_array.push( "缺少參數:"+num );
            });
            _.map(nfill_array, function(num2){
                if( input_copy[num2] ) return_array.push( "不可填寫參數:"+num2 );
            });
                
            if(return_array.length==0){
                resolve("ok");
            }else{
                resolve( no_call_service.add_biota_result( {} , false , return_array.join(" , ") , return_array ) );               
            }
        });
    },
    //變換參數為查詢或者新增條件
    /*
        change_rule_obj = { 
            "改變前1": "改變後1", 
            "改變前2": "改變後2", 
        } ,
        cond_array = ["改變後1","改變後2" ]
    */
	check_change_cond:function(input_params, change_rule_obj, cond_array, input_type){
        return new Promise(function(resolve, reject){
            input_type = typeof input_type !== 'undefined' ? input_type : 3;
            var return_obj1 = call_service.goclone(input_params); //params
            var return_obj2 ={}; //cond
            switch(input_type){
                case 0: //預設查詢條件 全不拔除
                    delete return_obj1["type"];
                    delete return_obj1["submit_to_link"];
                break;
                case 1: //ap_device U專用 拔除1個
                    delete return_obj1["device_type"];
                    delete return_obj1["type"];
                    delete return_obj1["submit_to_link"];
                break;
                case 2: //ap_device [R1 R2 D]用 以及 fingerprint_device用 拔除2個
                    delete return_obj1["device_type"];
                    delete return_obj1["push_token"];
                    delete return_obj1["type"];
                    delete return_obj1["submit_to_link"];
                break;  
                case 3: //一律不讀取
                    delete return_obj1["device_id"];
                    delete return_obj1["device_type"];
                    delete return_obj1["push_token"];
                    delete return_obj1["type"];
                    delete return_obj1["submit_to_link"];
                break;                  
            }
            
            _.map(change_rule_obj, function(num,key){
                if(return_obj1[ key ]!= undefined){
                    return_obj1[ num ] = return_obj1[ key ];
                    delete return_obj1[key];                    
                }
            });
            
            _.map(cond_array, function(num2){
                if(return_obj1[ num2 ] != undefined){
                    return_obj2[ num2 ] = return_obj1[ num2 ];                
                }
            });
            resolve( [return_obj1, return_obj2] );
        });
    },
    //變換參數回使用者輸入模式
	back_change_cond:function(input_params, change_rule_obj){
        return new Promise(function(resolve, reject){
            var return_obj1 = input_params; //params                
            if( Array.isArray(input_params["data"]) ){
                //array的換法
                for(var i = 0; i < input_params["data"].length; i++){
                     _.map(change_rule_obj, function(num,key){
                            return_obj1["data"][i][ key ] = input_params["data"][i][ num ];
                            delete input_params["data"][i][num];                    
                    });                      
                }
            }else{
                _.map(change_rule_obj, function(num,key){
                        return_obj1["data"][ key ] = input_params["data"][ num ];
                        delete input_params["data"][num];                    
                });                
            }
            
            resolve( return_obj1 );
        });
    },
};

