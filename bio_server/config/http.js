/**
 * HTTP Server Settings
 * (sails.config.http)
 *
 * Configuration for the underlying HTTP server in Sails.
 * Only applies to HTTP requests (not WebSockets)
 *
 * For more information on configuration, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.http.html
 */

module.exports.http = {
    
    locals: {
        //ejs共用function
        filters: {
            //轉換時間為現在時間
            trans_html_daytime: function(ctime) { 
                return moment(ctime).format("YYYY-MM-DD HH:mm:ss");   
            },
            //轉換生日為年紀
            birthday_to_age: function(input_date) { 
                return moment().diff(moment(input_date), 'years')+"歲";          
            },
//快速產生HTML列表 系列
/*
    已製作有
        create_input
        create_password
        create_img
        create_date_time
        create_date
        create_select
        create_area
*/
            //創建普通input
            //<%-: {is_require:true, is_readonly:true, input_ch:"文字抬頭", id_name:"input_id"}|create_input %>
            create_input: function( input_obj ) { 
                var final_str  = "<div class='form-group'>";
                    final_str += "<label>"+input_obj.input_ch;
                        if(input_obj.is_require){
                            final_str += "<span class='required'>*</span>";            
                        }
                    final_str += "</label>";
                        if(input_obj.is_readonly){
                            final_str += "<input type='text' id='"+input_obj.id_name+"' name='"+input_obj.id_name+"'class='form-control' readonly/>"; 
                        }else{
                            final_str += "<input type='text' id='"+input_obj.id_name+"' name='"+input_obj.id_name+"'class='form-control'/>";                 
                        }
                    final_str += "<span id='"+input_obj.id_name+"_string'></span>";
                    final_str += "</div>";
                    return final_str;       
            },
            //創建日期input
            //<%-: {is_require:true, is_readonly:true, input_ch:"文字抬頭", id_name:"input_id"}|create_date %>
            create_date: function( input_obj ) { 
                if(input_obj.is_readonly){
                    var read_setting = "readonly disabled"; 
                }else{
                    var read_setting = ""; 
                }
                
                var final_str  = "<div class='form-group'>";
                    final_str += "<label class='control-label'>"+input_obj.input_ch;
                        if(input_obj.is_require){
                            final_str += "<span class='required'>*</span>";            
                        }
                    final_str += "</label>";
                    final_str += '<input type="text" name="'+input_obj.id_name+'" id="'+input_obj.id_name+'" class="form-control date-picker" data-date-today-highlight="true" data-date-format="yyyy-mm-dd" size="16" '+read_setting+'/>';
                    final_str += "</div>";
                        if(input_obj.is_deafult==undefined){
                             final_str += "<script>$('#"+input_obj.id_name+"').datepicker('setDate', new Date());</script>";      
                        }
              return final_str;        
            },
            //創建下拉選單
            //<%-: {is_require:true, is_autocomplete:true, input_ch:"文字抬頭", id_name:"input_id", input_data:[{text:"aaa",value:"bbb"}], input_extra:null}|create_select %>
            create_select: function( input_obj ) { 
                var final_str  = "<div class='form-group'>";
                    final_str += "<label class='control-label'>"+input_obj.input_ch;
                        if(input_obj.is_require){
                            final_str += "<span class='required'>*</span>";            
                        }
                    final_str += "</label>";
                        if(input_obj.is_autocomplete){
                            final_str += '<select class="bs-select form-control" data-live-search="true" data-size="8" id="'+input_obj.id_name+'" name="'+input_obj.id_name+'">';
                        }else{
                            final_str += '<select class="form-control" id="'+input_obj.id_name+'" name="'+input_obj.id_name+'" aria-required="true" aria-invalid="false" aria-describedby="select-error">';                
                        }
                    final_str += '<option value="">請選擇</option>';
                        if(input_obj.input_data){
                            _.each(input_obj.input_data,function(num){
                               final_str += '<option value="'+num.value+'">'+num.text+'</option>';
                            })
                        }
                    final_str += '</select>';
                        if(input_obj.input_extra){
                            final_str += input_extra;
                        }
                    final_str += "</div>";
              return final_str;      
            },
        }
    },
  /****************************************************************************
  *                                                                           *
  * Express middleware to use for every Sails request. To add custom          *
  * middleware to the mix, add a function to the middleware config object and *
  * add its key to the "order" array. The $custom key is reserved for         *
  * backwards-compatibility with Sails v0.9.x apps that use the               *
  * `customMiddleware` config option.                                         *
  *                                                                           *
  ****************************************************************************/

  middleware: {

  /***************************************************************************
  *                                                                          *
  * The order in which middleware should be run for HTTP request. (the Sails *
  * router is invoked by the "router" middleware below.)                     *
  *                                                                          *
  ***************************************************************************/

    // order: [
    //   'startRequestTimer',
    //   'cookieParser',
    //   'session',
    //   'myRequestLogger',
    //   'bodyParser',
    //   'handleBodyParserError',
    //   'compress',
    //   'methodOverride',
    //   'poweredBy',
    //   '$custom',
    //   'router',
    //   'www',
    //   'favicon',
    //   '404',
    //   '500'
    // ],

  /****************************************************************************
  *                                                                           *
  * Example custom middleware; logs each request to the console.              *
  *                                                                           *
  ****************************************************************************/

    // myRequestLogger: function (req, res, next) {
    //     console.log("Requested :: ", req.method, req.url);
    //     return next();
    // }


  /***************************************************************************
  *                                                                          *
  * The body parser that will handle incoming multipart HTTP requests. By    *
  * default as of v0.10, Sails uses                                          *
  * [skipper](http://github.com/balderdashy/skipper). See                    *
  * http://www.senchalabs.org/connect/multipart.html for other options.      *
  *                                                                          *
  * Note that Sails uses an internal instance of Skipper by default; to      *
  * override it and specify more options, make sure to "npm install skipper" *
  * in your project first.  You can also specify a different body parser or  *
  * a custom function with req, res and next parameters (just like any other *
  * middleware function).                                                    *
  *                                                                          *
  ***************************************************************************/

    // bodyParser: require('skipper')({strict: true})

  },

  /***************************************************************************
  *                                                                          *
  * The number of seconds to cache flat files on disk being served by        *
  * Express static middleware (by default, these files are in `.tmp/public`) *
  *                                                                          *
  * The HTTP static cache is only active in a 'production' environment,      *
  * since that's the only time Express will cache flat-files.                *
  *                                                                          *
  ***************************************************************************/

  // cache: 31557600000
};
