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
                if( !input_copy[num] ) return_array.push( "缺少參數:"+num );
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
            input_type = typeof input_type !== 'undefined' ? input_type : 0;
            var return_obj1 = call_service.goclone(input_params); //params
            var return_obj2 ={}; //cond
            switch(input_type){
                case 0: //預設查詢條件 全拔除
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

