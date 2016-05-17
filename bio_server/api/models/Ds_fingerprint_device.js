/**
* Ds_fingerprint_device.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  //不要用自動的參數
  autoPK: false,
  //強制限定樣式，不存在的Schema不可存
  schema: true,
  
  /*
    產品識別碼 ds_device_id 
    廠商識別碼 ds_co_id 
    版本 ds_ver 
    速度 ds_speed 
    製造商 ds_co 
    位置識別碼 ds_addr 
    產品名稱 ds_product 
    連結裝置PK ds_ap_id 
    刪除註記 ds_deleted  
  */
  attributes: {
    ds_device_id: {
        type: "string",
        primaryKey: true,
        unique: true,
        autoIncrement: true 
    },
    ds_co_id:{ type: "string" },
    ds_ver:{ type: "string" },
    ds_speed:{ type: "string" },
    ds_co:{ type: "string" },
    ds_addr:{ type: "string" },
    ds_product:{ type: "string" },
    ds_ap_id:{ model: "Ds_fingerprint_ap" },
    ds_deleted:{ type: "date_time" }
  },
  //unique失效使用
  beforeCreate: function (values, next) {
    Ds_fingerprint_device.count({ds_device_id:values.ds_device_id}).exec(function countCB(error, found) {
      if(found==0){
        next();
      }else{
        no_call_service.write_log("Ds_fingerprint_device","C_repeat", values, "device");
        next( new Error('Limit must be greater than number') );
      }
    });
  }
};

