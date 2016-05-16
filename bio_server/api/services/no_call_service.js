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
    //製作一個快速寫入DB_LOG的function 時間是自動產生不用補
    write_log:function(table_name, CRUD, input_cond, who){
        var cond = {};
        cond.table_name = table_name;
        cond.CRUD = CRUD;
        cond.input_cond = input_cond;
        cond.who = who;
        Db_log.create(cond).exec(function(err,create_data){
            console.log("log",create_data);
        })
    },
};

