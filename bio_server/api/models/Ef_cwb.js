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
    ef_sitename:{ type: "string" },
    ef_source:{ type: "string" },
    ef_item:{ type: "string" },
    ef_date:{ type: "datetime" },
    ef_00:{ type: "double" , defaultsTo: ''},
    ef_01:{ type: "double" , defaultsTo: ''},
    ef_02:{ type: "double" , defaultsTo: ''},
    ef_03:{ type: "double" , defaultsTo: ''},
    ef_04:{ type: "double" , defaultsTo: ''},
    ef_05:{ type: "double" , defaultsTo: ''},
    ef_06:{ type: "double" , defaultsTo: ''},
    ef_07:{ type: "double" , defaultsTo: ''},
    ef_08:{ type: "double" , defaultsTo: ''},
    ef_09:{ type: "double" , defaultsTo: ''},
    ef_10:{ type: "double" , defaultsTo: ''},
    ef_11:{ type: "double" , defaultsTo: ''},
    ef_12:{ type: "double" , defaultsTo: ''},
    ef_13:{ type: "double" , defaultsTo: ''},
    ef_14:{ type: "double" , defaultsTo: ''},
    ef_15:{ type: "double" , defaultsTo: ''},
    ef_16:{ type: "double" , defaultsTo: ''},
    ef_17:{ type: "double" , defaultsTo: ''},
    ef_18:{ type: "double" , defaultsTo: ''},
    ef_19:{ type: "double" , defaultsTo: ''},
    ef_20:{ type: "double" , defaultsTo: ''},
    ef_21:{ type: "double" , defaultsTo: ''},
    ef_22:{ type: "double" , defaultsTo: ''},
    ef_23:{ type: "double" , defaultsTo: ''}
  }
};

