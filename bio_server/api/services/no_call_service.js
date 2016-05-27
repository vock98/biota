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
    //轉換ef_time +ef_value ->ef_h00~ef_h23
	convert_time:function( input_params ){
        var new_params = input_params;
        var return_array = [];
        delete new_params['ef_time'];
        delete new_params['ef_value'];
        return_array[0] = new_params;
        switch(input_params.ef_time){
            case "00": new_params.ef_h00 = input_params.ef_value; break;
            case "01": new_params.ef_h01 = input_params.ef_value; break;
            case "02": new_params.ef_h02 = input_params.ef_value; break;
            case "03": new_params.ef_h03 = input_params.ef_value; break;
            case "04": new_params.ef_h04 = input_params.ef_value; break;
            case "05": new_params.ef_h05 = input_params.ef_value; break;
            case "06": new_params.ef_h06 = input_params.ef_value; break;
            case "07": new_params.ef_h07 = input_params.ef_value; break;
            case "08": new_params.ef_h08 = input_params.ef_value; break;
            case "09": new_params.ef_h09 = input_params.ef_value; break;
            case "10": new_params.ef_h10 = input_params.ef_value; break;
            case "11": new_params.ef_h11 = input_params.ef_value; break;
            case "12": new_params.ef_h12 = input_params.ef_value; break;
            case "13": new_params.ef_h13 = input_params.ef_value; break;
            case "14": new_params.ef_h14 = input_params.ef_value; break;
            case "15": new_params.ef_h15 = input_params.ef_value; break;
            case "16": new_params.ef_h16 = input_params.ef_value; break;
            case "17": new_params.ef_h17 = input_params.ef_value; break;
            case "18": new_params.ef_h18 = input_params.ef_value; break;
            case "19": new_params.ef_h19 = input_params.ef_value; break;
            case "20": new_params.ef_h20 = input_params.ef_value; break;
            case "21": new_params.ef_h21 = input_params.ef_value; break;
            case "22": new_params.ef_h22 = input_params.ef_value; break;
            case "23": new_params.ef_h23 = input_params.ef_value; break;           
        }
        return_array[1] = new_params;
        return return_array;
    },
};

