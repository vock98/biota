/**
 * ExportController
 *
 * @description :: Server-side logic for managing exports
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var json2csv = require('json2csv');
var moment = require('moment');

module.exports = {
	 //列表頁面 http://localhost:1337/ap/list
	access:function(req,res){             
            // Send a CSV response          
            var config = {
              fields : ['id','name', 'email'],
              data: [
                  {id:1,name:2,email:3},
                  {id:21,name:22,email:23}
              ]
            };

            json2csv(config, function(err, csv) {
              if (err) console.log(err);
              var filename = "report-" + moment().format("YYYY-MM-DD") + ".csv";
              res.attachment(filename);
              res.end(csv, 'UTF-8');
            });                     	
	}, 
};

