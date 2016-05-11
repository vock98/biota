/**
* Ir_main.js
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
    實驗主鍵 ir_main_pk 
    開始執行時間 ir_starttime 
    實驗執行秒數 ir_cost   
  */
  attributes: {
    ir_main_pk: {
        primaryKey: true,
        unique: true,
        autoIncrement: true 
    },
    ir_starttime:{ type: "datetime" },
    ir_cost:{ type: "int" },
  }
};

