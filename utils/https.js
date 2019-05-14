import {config} from '../config.js';

const app = getApp();

const tips = {
  1 : '抱歉，出现了一个错误',
  1000 : '输入参数错误',
  1001 : '输入的json格式不正确',
  1002 : '找不到资源',
  1003 : '未知错误',
  1004 : '禁止访问',
  1005 : '不正确的开发者key',
  1006 : '服务器内部错误'
}

// 封装HTTP请求
class HTTP{
  // 封装 判断token
  http(params){
    if(!params.method){
      params.method = "GET"
    }
    let token = app.globalData.token;
    if(!token){
      this.getToken(token)
    }else{
      this.request(params)
    }
  }

  request(params){
    // url data method
    wx.request({
      url: config.api_url + params.url,
      method:params.method,
      data:params.data,
      header:{
        "Content-Type":"application/json",
        "appkey":config.appKey
      },
      success:(res) => {
        // https 状态码
        let code = res.statusCode.toString();
        // startsWith,endsWith
        if(code.startsWith('2')){
          params.success(res)
        }else{
          // 服务器异常
          let error_code = res.data.error_code;
          /* this._show_error(error_code) */
        }
      },
      fill:(err) => {
        // API调用失败
        /* this._show_error(1) */
      }
    })
  }

  /* _show_error(error_code){
    if(!error_code){
      error_code = 1
    }
    wx.showToast({
      title: tips[crror_code],
      duration: 2000
    })
  } */

  getToken(cb){
    wx.login({
      success:function(res){
        let code = res.code;
        wx.getUserInfo({
          success:res => {
            // console.log("刷新token：userInfo:",res)
            let encryptedData = res.encryptedData;
            let iv = res.iv;
            wx.request({
              url:config.api_url + '/api/check_user',
              method:'POST',
              data:{
                code:code,
                iv:iv,
                encryptedData:encryptedData
              },
              header:{
                "Content-Type":"application/json"
              },
              success:function(res){
                // console.log("刷新token：getToken:",res)
                wx.setStorageSync('token', res.data.data.token);
                app.globalData.token = res.data.data.token;
              }
            })
          }
        })
      }
    })
  }
}

export {HTTP}