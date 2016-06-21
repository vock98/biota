/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  // '/': { view: 'homepage' },
  //預設首頁導向基本資料維護
  '/': { controller:'human',action:'human_list',locals:{layout:"layout/normal",active:"human"} },
  //基本資料管理
    //人員資料管理
        //基本資料維護
            '/human/list': { controller:'human',action:'human_list',locals:{layout:"layout/normal",active:"human"} },
            '/human/add' : { controller:'human',action:'human_add' ,locals:{layout:"layout/normal",active:"human"} },
            '/human/edit/:ds_human_pk': { controller:'human',action:'human_edit',locals:{layout:"layout/normal",active:"human"} },
            '/human/delete/:ds_human_pk/:ds_name': { controller:'human',action:'human_delete' },
        //進出紀錄查詢
            '/human/inout': { controller:'human',action:'human_inout',locals:{layout:"layout/normal",active:"human"} },
    //設備資料管理
        //AP client管理
            //AP參數設定
            '/ap/list': { controller:'ap',action:'ap_list',locals:{layout:"layout/normal", active:"ap"} },
            '/ap/add' : { controller:'ap',action:'ap_add' ,locals:{layout:"layout/normal", active:"ap"} },
            '/ap/edit/:id': { controller:'ap',action:'ap_edit',locals:{layout:"layout/normal", active:"ap"} },        
            '/ap/delete/:id/:device_type/:platform_type': { controller:'ap',action:'ap_delete' },
            //指紋機設備查詢
            '/device/list': { controller:'device',action:'device_list',locals:{layout:"layout/normal", active:"device"} },
            '/device/add' : { controller:'device',action:'device_add' ,locals:{layout:"layout/normal", active:"device"} },
            '/device/edit/:id/:device_id': { controller:'device',action:'device_edit',locals:{layout:"layout/normal", active:"device"} },
            '/device/delete/:id/:device_id': { controller:'device',action:'device_delete',locals:{layout:"layout/normal", active:"device"} },
            //設備操作紀錄
            '/log/device_list': { controller:'log',action:'device_list',locals:{layout:"layout/normal", active:"Db_device_log"} },
/*    
  //使用紀錄報表
    //人員進出報表
    '/table/human': { controller:'table',action:'table_human',locals:{layout:"layout/normal",active:"table"} },
    //設備操作紀錄報表
    '/table/device': { controller:'table',action:'table_device',locals:{layout:"layout/normal",active:"table"} },
    //FRR/FAR分析報表
    '/table/frr': { controller:'table',action:'table_frr',locals:{layout:"layout/normal",active:"table"} },
*/    
  //開發者應用程式模擬介面
    //應用程式接口
    '/simulator/pro': { controller:'Simulator',action:'pro',locals:{layout:"layout/normal",active:"Simulator"} },
    //APNS/GCM推播模擬
    // '/simulator/gcm': { controller:'Simulator',action:'gcm',locals:{layout:"layout/normal",active:"Simulator"} },
  //參考資料載入
    //中央氣象局環境資料
    '/ef_cwb/list': { controller:'ef_cwb',action:'list',locals:{layout:"layout/normal",active:"ef_cwb"}  },
    //手動輸入紀錄
    '/envir/list': { controller:'envir',action:'list',locals:{layout:"layout/normal",active:"envir"}  },
    '/envir/add' : { controller:'envir',action:'add' ,locals:{layout:"layout/normal",active:"envir"} },
    '/envir/edit/:envir_pk': { controller:'envir',action:'edit',locals:{layout:"layout/normal",active:"envir"} }, 
    '/envir/delete/:envir_pk': { controller:'envir',action:'delete',locals:{layout:"layout/normal", active:"envir"} },
  //資料匯出
    //門禁紀錄
    '/export/access': { controller:'export',action:'access',locals:{layout:"layout/normal",active:"export"} },
/*    
  //定時排程
    //門禁記錄轉置
    '/cron/transrecord': { controller:'cron',action:'cron_transrecord',locals:{layout:"layout/normal",active:"cron"} },
*/
    
  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/
  //特製功能區
   '/api/Ds_fingerprint_ap': { controller:'Ds_fingerprint_ap',action:'redirect'},
   '/api/Ds_fingerprint_device': { controller:'Ds_fingerprint_device',action:'redirect'},
   '/api/Ds_human': { controller:'Ds_human',action:'redirect'},
   '/api/Ds_nfc': { controller:'Ds_nfc',action:'redirect'},
   '/api/Ef_cwb': { controller:'Ef_cwb',action:'redirect'},
   '/api/Ef_envir': { controller:'Ef_envir',action:'redirect'}
  
};
