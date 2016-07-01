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
    推播唯一碼 ds_push_token
    刪除註記 ds_deleted
  */
  attributes: {
    ds_uuid: {
        type: "string",
        primaryKey: true,
        unique: true,
        autoIncrement: true,        
        columnName: 'id'
    },
    ds_ap_id: {
        type: "string",
        primaryKey: true,
        unique: true
    },
    ds_device_type:{ type: "string" },
    ds_platform_type:{ type: "string" },
    ds_push_token:{ 
        type: "string",
        defaultsTo: ''
    },
    ds_deleted:{ type: "datetime" } //沒有值代表還沒刪除
  },
  //unique失效使用
  beforeCreate: function (values, next) {
    Ds_fingerprint_ap.count({ds_ap_id:values.ds_ap_id}).exec(function countCB(error, found) {
      if(found==0){
        next();
      }else{
        next( new Error('ID重複') );
      }
    });
  }
};

