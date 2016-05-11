/**
 * Ds_fingerprint_deviceController
 *
 * @description :: Server-side logic for managing ds_fingerprint_devices
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    /*
        用途 : 查看內容
        輸入 : 無
        輸出 : 整個DB
        快速連結 : http://localhost:1337/api/Ds_fingerprint_device/find
    */
	find: function(req, res) {
       Ds_fingerprint_device.find().exec(function(err,find_data){
            return res.json(find_data);           
       })
    },

};

