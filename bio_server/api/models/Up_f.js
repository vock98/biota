/**
* F_linked.js
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
    上傳主鍵 up_f_pk
    開始時間 up_STime
    掃描完成秒數 up_CTime
    比對分數 up_MScore
    比對完成秒數 up_MTime
    紀錄本地比對結果 up_is_success
    記錄本地對應操作 up_action

  */
  attributes: {
    up_f_pk: {
        type: "string",
        primaryKey: true,
        unique: true,
        autoIncrement: true,        
        columnName: 'id'
    },
    f_minutiae:{ type: "string",},
    f_pic_path:{ type: "string",},
    ds_human_pk:{ type: "string",},
    ds_bind_id:{ type: "string",},
    ds_nfc_tag_id:{ type: "string",},    
    up_STime:{ type: "string",},
    up_CTime:{  type: "float", },
    up_MScore:{  type: "float", },
    up_MTime:{  type: "float", },
    up_is_success:{  type: "string", },
    up_client_action:{ type: "string" },
    up_server_action:{ type: "string" },
  }
};

