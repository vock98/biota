/**
* Ds_human.js
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
    使用者主鍵 ds_human_pk
    生日 ds_birthday 
    性別 ds_gender 
    血型 ds_bloodtype 
    工作 ds_job 
    顯示名稱 ds_name
    他方系統代號 ds_bind_id 
    管理者註記 ds_is_manager 
    刪除註記 ds_deleted
  */
  attributes: {
    ds_human_pk: {
        type: "int",
        primaryKey: true,
        unique: true,
        autoIncrement: true 
    },
    ds_gender:{ 
        type: "string",
        enum: ['MAN','WOMAN'] 
    },
    ds_birthday:{ type: "datetime" },
    ds_bloodtype:{type: "string"},
    ds_job:{type: "string"},
    ds_name:{type: "string"},
    ds_bind_id:{type: "string"},
    ds_is_manager:{type: "string"},
    ds_deleted:{ 
        type: "datetime" ,
        defaultsTo: ''
    },
    nfcs:{
        collection: "ds_nfc",
        via: "ds_human_pk"
    },
    f_linkeds:{
        collection: "f_linked",
        via: "ds_human_pk"
    }
  },
  //unique失效使用
  beforeCreate: function (values, next) {
    Ds_human.count({ds_human_pk:values.ds_human_pk}).exec(function countCB(error, found) {
      if(found==0){
        next();
      }else{
        no_call_service.write_log("Ds_human","C_repeat", values, "human");
        next( new Error('ID重複') );
      }
    });
  }
};

