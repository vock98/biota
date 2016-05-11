/**
* Ds_fingerprint_ap.js
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
    設備唯一碼 ds_ap_id 
    設備型態 ds_device_type
    平台型態 ds_platform_type
    資料更新時間 ds_update
    推播唯一碼 ds_push_token
    刪除註記 ds_deleted
  */
  attributes: {
    ds_ap_id: {
        type: "string",
        primaryKey: true,
        unique: true
    },
    ds_device_type:{ type: "string" },
    ds_platform_type:{ type: "string" },
    ds_push_token:{ type: "string" },
    ds_update:{ type: "date_time" },
    ds_deleted:{ type: "date_time" }
  },
  //unique失效使用
  beforeCreate: function (values, next) {
    Ds_fingerprint_ap.count({ds_ap_id:values.ds_ap_id}).exec(function countCB(error, found) {
      if(found==0){
        next();
      }else{
        next( new Error('Limit must be greater than number') );
      }
    });
  }
};

