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
    up_STime:{ type: "string",},
    up_CTime:{  type: "string", },
    up_MScore:{  type: "string", },
    up_MTime:{  type: "string", },
    up_is_success:{  type: "string", },
    up_action:{ type: "string" },
  }
};

