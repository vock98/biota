/**
 * Info_list.js
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
    主鍵 ds_subject_pk
    主旨 ds_subject 
    發佈者 ds_tricker 
    時間 ds_time 
    類型 ds_style 
    刪除註記 ds_deleted
  */
  attributes: {
    ds_subject_pk: {
        type: "string",
        primaryKey: true,
        unique: true,
        autoIncrement: true,        
        columnName: 'id'
    },
    ds_subject:{ type: "string"},
    ds_tricker:{ type: "string" },
    ds_time:{ type: "datetime" },
    ds_style:{
        type: "string",
        enum: ['announcement','reminder'] 
    },
    ds_deleted:{ type: "datetime" }, //沒有值代表還沒刪除
  },
};

