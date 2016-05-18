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
        primaryKey: true,
        unique: true,
        autoIncrement: true 
    },
    ds_human_pk:{ model: "ds_human" },
    ds_deleted:{ type: "datetime" }
  }
};

