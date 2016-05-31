/**
 * Ds_nfc.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  //不要用自動的參數
  autoPK: false,
  //強制限定樣式，不存在的Schema不可存
  schema: true,
  
  /*
    使用者主鍵 ds_nfc_tag_id 
    使用者主鍵 ds_human_pk
    刪除註記 ds_deleted
  */
  attributes: {
    ds_nfc_tag_id: {
        type: "string",
        primaryKey: true,
        unique: true
    },
    ds_human_pk:{ model: "ds_human" },
    ds_deleted:{ type: "datetime" } //沒有值代表還沒刪除
  },
  //unique失效使用
  beforeCreate: function (values, next) {
    Ds_nfc.count({ds_nfc_tag_id:values.ds_nfc_tag_id}).exec(function countCB(error, found) {
      if(found==0){
        next();
      }else{
        no_call_service.write_log("Ds_nfc","C_repeat", values, "human");
        next( new Error('ID重複') );
      }
    });
  }
};

