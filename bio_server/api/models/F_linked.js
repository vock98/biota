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
    指紋主鍵 f_linked_pk
    指紋擁有者 ds_human_pk
    採樣設備資料 ds_device_id
    指紋採樣程式 ds_ap_id
    記錄環境主鍵 ef_envir_pk
    採樣時間 f_linked_updated
    採樣手指 f_which_one
    記錄指紋路徑 f_dat_path
    圖片儲存路徑 f_pic_path
  */
  attributes: {
    f_linked_pk: {
        primaryKey: true,
        unique: true,
        autoIncrement: true 
    },
    f_which_one:{ 
        type: "string",
        enum: ['r-thumb','r-index','r-middle','r-ring','r-pinky','l-thumb','l-index','l-middle','l-ring','l-pinky'] 
    },
    // ef_envir_pk:{ model: "ef_envir" },
    // ds_human_pk:{ model: "ds_human" },
    // ds_device_id:{ model: "ds_device" },
    // ds_ap_id:{ model: "ds_ap" },
    f_linked_updated:{ type: "datetime" },
    f_dat_path:{ type: "string" },
    f_pic_path:{ type: "string" } 
  }
};
