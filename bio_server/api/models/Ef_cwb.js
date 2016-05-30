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
    ef_date:{ type: "string" },
    ef_h00:{ type: "float" , defaultsTo: 0},
    ef_h01:{ type: "float" , defaultsTo: 0},
    ef_h02:{ type: "float" , defaultsTo: 0},
    ef_h03:{ type: "float" , defaultsTo: 0},
    ef_h04:{ type: "float" , defaultsTo: 0},
    ef_h05:{ type: "float" , defaultsTo: 0},
    ef_h06:{ type: "float" , defaultsTo: 0},
    ef_h07:{ type: "float" , defaultsTo: 0},
    ef_h08:{ type: "float" , defaultsTo: 0},
    ef_h09:{ type: "float" , defaultsTo: 0},
    ef_h10:{ type: "float" , defaultsTo: 0},
    ef_h11:{ type: "float" , defaultsTo: 0},
    ef_h12:{ type: "float" , defaultsTo: 0},
    ef_h13:{ type: "float" , defaultsTo: 0},
    ef_h14:{ type: "float" , defaultsTo: 0},
    ef_h15:{ type: "float" , defaultsTo: 0},
    ef_h16:{ type: "float" , defaultsTo: 0},
    ef_h17:{ type: "float" , defaultsTo: 0},
    ef_h18:{ type: "float" , defaultsTo: 0},
    ef_h19:{ type: "float" , defaultsTo: 0},
    ef_h20:{ type: "float" , defaultsTo: 0},
    ef_h21:{ type: "float" , defaultsTo: 0},
    ef_h22:{ type: "float" , defaultsTo: 0},
    ef_h23:{ type: "float" , defaultsTo: 0}
  }
};

