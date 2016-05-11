/**
* Ef_envir.js
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
    記錄環境主鍵 ef_envir_pk 
    記錄環境時間 ef_datetime 
    環境描述 ef_desc 
    環境照片路徑 ef_pic_path 
    環境溫度 ef_temp 
    環境溼度 ef_humd   
  */
  attributes: {
    ef_envir_pk: {
        primaryKey: true,
        unique: true,
        autoIncrement: true 
    },
    ef_datetime:{ type: "datetime" },    
    ef_desc:{ type: "string" },
    ef_pic_path:{ type: "string" },
    ef_temp:{ type: "float" },
    ef_humd:{ type: "float" },
  }
};

