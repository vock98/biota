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
    採樣手指 f_which_one
    記錄指紋路徑 f_dat_path
    圖片儲存路徑 f_pic_path
  */
  attributes: {
    f_linked_pk: {
        type: "string",
        primaryKey: true,
        unique: true,
        autoIncrement: true,        
        columnName: 'id'
    },
    f_which_one:{ 
        type: "string",
        enum: ['r-thumb','r-index','r-middle','r-ring','r-pinky','l-thumb','l-index','l-middle','l-ring','l-pinky'] 
    },
    ef_envir_pk:{ model: "ef_envir" },
    ds_human_pk:{ model: "ds_human" },
    ds_device_id:{ model: "ds_fingerprint_device" },
    ds_ap_id:{ model: "ds_fingerprint_ap" },
    f_dat_path:{ type: "string" },
    f_pic_path:{ type: "string" },
    f_minutiae:{ type: "string" },
  },
  //unique失效使用
  beforeCreate: function (values, next) {
        function padRight(str,lenght){
            if(str.length >= lenght)
                return str;
            else
                return padRight(str+"0",lenght);
        }
      var now_minu = values.f_minutiae;      
      var new_minu = "錯誤";
      
      if(now_minu.length==1024){
        var new_minu = now_minu;
      }else if(now_minu.length<1024){
        var new_minu = padRight(now_minu+"0",1024);
      }else if(now_minu.length>1024){
        var new_minu = now_minu.substr(0,1024)
      }

      values.f_minutiae = new_minu;
      next();
  }
};

