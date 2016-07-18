/**
 * TableController
 *
 * @description :: Server-side logic for managing tables
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


var moment = require('moment');
var co = require('co');
/*
var ffi = require('ffi');
var ref = require('ref');
var dir = __dirname;


var dllFM220api = ffi.Library(dir+"/fm220api.dll", {
	"FP_ConnectCaptureDriver": [ 'int', [ 'int' ] ],
	"FP_DisconnectCaptureDriver": ['int', ['int']],
	"FP_Diagnose": ['string', ['int']],
	"FP_CheckBlank": ['string', ['int']],
	"FP_CreateCaptureHandle": ['int', ['int']],
	"FP_DestroyCaptureHandle": ['int', ['int', 'int']],
	"FP_Capture": ['int', ['int', 'int']],
	"FP_CreateImageHandle": ['int', ['int', 'int', 'int']],
	"FP_DestroyImageHandle": ['int', ['int', 'int']],
	"FP_SaveImage": ['int', ['int', 'int', 'int', 'string']],
	"FP_GetImageQuality":['int', ['int']],
	"FP_Snap": ['int', ['int']],
	"FP_GetTemplate": ['int', ['int', 'pointer', 'int', 'int']],
	"FP_GetPrimaryCode": ['int', ['int', 'pointer']],
	"FP_GetImage": ['int', ['int', 'int']],
	"FP_CreateEnrollHandle": ['int', ['int', 'int']],
	"FP_DestroyEnrollHandle": ['int', ['int', 'int']],
	//"FP_GetISOImage": ['int', ['int', 'int', 'int', 'pointer']],
	"FP_SaveISOImage": ['int', ['int', 'int', 'int', 'string', 'int', 'int']],
	"FP_SaveWsqFile": ['int', ['int', 'string', 'int']],
	"FP_LoadM1minutia": ['int', ['int', 'string', 'pointer']],
	//"FP_SaveM1Minutia": ['int', ['int', 'string', 'pointer']],
	"FP_LoadISOminutia": ['int', ['int', 'string', 'pointer']],
	//"FP_SaveISOMinutia": ['int', ['int', 'string', 'pointer']],
	"FP_CodeMatchEx": ['int', ['int', 'pointer', 'pointer', 'int', 'pointer']],
	"FP_CodeMatch": ['int', ['int', 'pointer', 'pointer', 'int']],
	"FP_ImageMatchEx": ['int', ['int', 'pointer', 'int', 'pointer']],
	"FP_ImageMatch": ['int', ['int', 'pointer', 'int']],
	"FP_TemplateSelect": ['int', ['int', 'int', 'pointer', 'pointer', 'pointer', 'pointer', 'pointer']],
	"FP_EnrollEx": ['int', ['int', 'int', 'pointer', 'pointer', 'int']],
	"FP_Enroll": ['int', ['int', 'int', 'pointer', 'pointer']]
});
*/
module.exports = {
	//列表頁面 http://localhost:1337/api/table/test
	test:function(req,res){
        co(function* () {                                                    
            // var x = dllFM220api.FP_ConnectCaptureDriver(0);
            console.log("good");
            res.send();
        }).catch(function(err){
            console.log("轉出錯誤",err);
            res.send("轉出錯誤");
        });         
	},
};
