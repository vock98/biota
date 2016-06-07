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

  '/': { view: 'homepage' },
  //基本資料管理
    //人員資料管理
        //基本資料維護
            '/human/list': { controller:'human',action:'human_list',locals:{layout:"layout/human",active:"human"} },
            '/human/add' : { controller:'human',action:'human_add' ,locals:{layout:"layout/human",active:"human"} },
            '/human/edit': { controller:'human',action:'human_edit',locals:{active:"human"} },
        //進出紀錄查詢
            '/human/inout': { controller:'human',action:'human_inout',locals:{active:"human"} },
/*    
    //設備資料管理
        //AP client管理
            //AP參數設定
            '/ap/list': { controller:'ap',action:'ap_list',locals:{active:"ap"} },
            '/ap/add' : { controller:'ap',action:'ap_add' ,locals:{active:"ap"} },
            '/ap/edit': { controller:'ap',action:'ap_edit',locals:{active:"ap"} },        
            //指紋機設備查詢
            '/device/list': { controller:'device',action:'device_list',locals:{active:"device"} },
            '/device/add' : { controller:'device',action:'device_add' ,locals:{active:"device"} },
            '/device/edit': { controller:'device',action:'device_edit',locals:{active:"device"} },
            //設備操作紀錄
            '/Db_device_log/list': { controller:'Db_device_log',action:'Db_device_log_list',locals:{active:"Db_device_log"} },
  //使用紀錄報表
    //人員進出報表
    '/table/human': { controller:'table',action:'table_human',locals:{active:"table"} },
    //設備操作紀錄報表
    '/table/device': { controller:'table',action:'table_device',locals:{active:"table"} },
    //FRR/FAR分析報表
    '/table/frr': { controller:'table',action:'table_frr',locals:{active:"table"} },
  //開發者應用程式模擬介面
    //應用程式接口
    '/simulator/pro': { controller:'Simulator',action:'Simulator_pro',locals:{active:"Simulator"} },
    //APNS/GCM推播模擬
    '/simulator/gcm': { controller:'Simulator',action:'Simulator_gcm',locals:{active:"Simulator"} },
  //參考資料載入
    //中央氣象局環境資料
    '/ef_cwb/list': { controller:'ef_cwb',action:'ef_cwb_list',locals:{active:"ef_cwb"} },
    //手動輸入紀錄
    '/ef_envir/list': { controller:'ef_envir',action:'ef_envir_list',locals:{active:"ef_envir"} },
    '/ef_envir/add' : { controller:'ef_envir',action:'ef_envir_add' ,locals:{active:"ef_envir"} },
    '/ef_envir/edit': { controller:'ef_envir',action:'ef_envir_edit',locals:{active:"ef_envir"} }, 
  //資料匯出
    //門禁紀錄
    '/export/access': { controller:'export',action:'export_access',locals:{active:"export"} },
  //定時排程
    //門禁記錄轉置
    '/cron/transrecord': { controller:'cron',action:'cron_transrecord',locals:{active:"cron"} },
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

};
