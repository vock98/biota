var moment = require('moment');
//���B�X�{�����Oco�n�Ϊ�
module.exports = {
    //���XAP��ƪ�id�ѤU�Կ���
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
    //���XAP��ƪ�DB
	find_ap_data:function(){
        return new Promise(function(resolve, reject){
            Ds_fingerprint_ap.find().exec(function(err,find_data){
                if(err) reject(new Error("Ap error :"+err));
                resolve(find_data);
            })   
        });
    },
    //���Xdevice��ƪ��@��
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
};

