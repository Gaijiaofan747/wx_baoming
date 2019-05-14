//app.js

import wxValidate from "./utils/WxValidate.js";

App({
  data:{

  },
  onLogin: function () {
    
    // 调用接口获取登录凭证（code）
    wx.login({
      success:function(res) {
        var code = res.code
        // 获取用户信息 获取头像昵称，不会弹框
        wx.getUserInfo({
          withCredentials:true,
          success:function(res) {
            wx.setStorageSync("nickName",res.userInfo.nickName)
            wx.setStorageSync("avatarUrl",res.userInfo.avatarUrl)
            wx.setStorageSync("country",res.userInfo.country)
            wx.setStorageSync("city",res.userInfo.city)

            console.log('wx.getUserInfo',res)
          }
        })
      }
    })
  },

  wxValidate: (rules, messages) => new wxValidate(rules, messages),

  globalData: {
    userInfo: null,
    url:'https://enroll.ty300.cn',
    token: null,
    userImg: null,
    openId: null,
    fullfill: 0,
    mid: null,
    status: 1,
    nickName:null,
    avatarUrl:null,
    have_to_sign_up:[],
    // 我的认证信息
    user_information:null
  }
})