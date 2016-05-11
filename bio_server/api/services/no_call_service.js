//此處出現的所有共用參數都不需要有callback
module.exports = {
    //所有輸入值的驗證
	check_data:function(input_obj, check_array){
        var return_str ="";
        _.map(check_array, function(num){
            if(!input_obj[num]) return_str +="缺少參數:"+num+" \n<BR>";
        });
            return return_str;
    }
};

