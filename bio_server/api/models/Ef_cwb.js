/**
* Ef_cwb.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  //強制限定樣式，不存在的Schema不可存
  schema: true,
  
  /*
    資料更新時間 ef_updated 
    觀測站名稱 ef_sitename 
    資料來源API ef_source  
    資料名稱 ef_item
    記錄日期 ef_date
    記錄時間 ef_h00 ~ 23
  */
  attributes: {
    ef_updated:{ type: "datetime" },
    ef_sitename:{ type: "string" },
    ef_source:{ type: "string" },
    ef_item:{ type: "string" },
    ef_date:{ type: "datetime" }
  }
};

