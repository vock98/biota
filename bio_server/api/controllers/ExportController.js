/**
 * ExportController
 *
 * @description :: Server-side logic for managing exports
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var json2csv = require('json2csv');
var moment = require('moment');
var co = require('co');
var Iconv  = require('iconv').Iconv;
module.exports = {
	 //列表頁面 http://localhost:1337/ap/list
	access:function(req,res){
            co(function* () {                                                    
                // Send a CSV response
                var db_data = yield call_service.find_csv();
                var config = {
                  fields : ['Datetime','Action', 'User', 'Description', 'Result'],
                  data: db_data,
                };

                json2csv(config, function(err, csv) {
                  if (err) console.log(err);
                  var filename = "report-" + moment().format("YYYY-MM-DD") + ".csv";
                  res.attachment(filename);
                    var iconv = new Iconv('UTF-8', 'BIG5');
                    content = iconv.convert(csv);
                  res.end(content, 'UTF-8');
                });
            }).catch(function(err){
                console.log("轉出錯誤",err);
                res.send("轉出錯誤");
            });         
	},
};

