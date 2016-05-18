//此處出現的所有共用參數都不需要有callback
module.exports = {
    //所有輸入值的驗證
	check_data:function(input_obj, check_array){
        var return_str ="";
        _.map(check_array, function(num){
            if(!input_obj[num]) return_str +="缺少參數:"+num+" \n<BR>";
        });
            return return_str;
    },
    //驗證不可出現的參數
	check_ignore_data:function(input_params, check_array){
        var return_str =false;
        _.map(check_array, function(num){
            if(input_params[num]) return_str =true;
        });
            return return_str;
    },
    //製作一個快速寫入DB_LOG的function 時間是自動產生不用補
    write_log:function(table_name, CRUD, input_cond, who, type){
        var cond = {};
        cond.table_name = table_name;
        cond.CRUD = CRUD;
        cond.input_cond = input_cond;
        cond.who = who;
        if(type=="device"){
            //設備操作紀錄LOG
            Db_device_log.create(cond).exec(function(err,create_data){
                console.log("log",create_data);
            }) 
        }else if(type=="human"){
            //人員資料LOG
            Db_human_log.create(cond).exec(function(err,create_data){
                console.log("log",create_data);
            })            
        }else{
            //資料LOG
            Db_log.create(cond).exec(function(err,create_data){
                console.log("log",create_data);
            }) 
        }
    },
    //快速補出條件(必填用)
	complete_cond:function( input_params, check_array, other_cond ){
        var now_cond = {};
        _.map(check_array,function(num){
            now_cond[num] = input_params[num];
        })
        if(other_cond)  now_cond[other_cond] = "";
        return now_cond;
    },
    //快速補出條件(非必填用)
	complete_not_cond:function( input_params, check_array, other_cond ){
        var now_cond = {};
        _.map(check_array,function(num){
            if(input_params[num]!=undefined)now_cond[num] = input_params[num];
        })
        if(other_cond)  now_cond[other_cond] = "";
        return now_cond;
    },
};

