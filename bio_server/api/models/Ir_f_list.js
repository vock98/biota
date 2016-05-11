/**
* Ir_f_list.js
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
    指紋A主鍵 f_linked_a_pk 
    特徵碼A ir_minutiae_a 
    指紋A擷取秒數 ir_cap_time_a 
    指紋B主鍵 f_linked_b_pk 
    特徵碼B ir_minutiae_b 
    指紋B擷取秒數 ir_cap_time_b 
    分數 f_score   
  */
  attributes: {
    // ir_main_pk:{ model: "ir_main" },
    // f_linked_a_pk:{ model: "f_linked_a" },
    // f_linked_b_pk:{ model: "f_linked_b" },
    ir_minutiae_a:{ type: "text" },
    ir_cap_time_a:{ type: "int" },
    ir_minutiae_b:{ type: "text" },
    ir_cap_time_b:{ type: "int" },
    f_score:{ type: "int" },
  }
};

