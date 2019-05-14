// pages/welcome/welcome.js

import {HTTP} from '../../utils/https.js';
let http = new HTTP();

var app = getApp()

Page({
  data:{
    code:'',
    data:{
      // 判断小程序的API，回调，参数，组件等是否在当前版本可用
      canIuse:wx.canIUse("")
    }
  },
  onLoad(){
    var that = this
    wx.login({
      success:function(res) {
        var code = res.code
        that.setData({
          code: code
        })
        // 获取用户信息 获取头像昵称，不会弹框
        wx.getUserInfo({
          withCredentials:true,
          success:function(res) {
            wx.setStorageSync("nickName",res.userInfo.nickName)
            wx.setStorageSync("avatarUrl",res.userInfo.avatarUrl)
            wx.setStorageSync("country",res.userInfo.country)
            wx.setStorageSync("city",res.userInfo.city)
            app.globalData.nickName = res.userInfo.nickName;
            app.globalData.avatarUrl = res.userInfo.avatarUrl;

            console.log('111',res)
          }
        })
      }
    })

    // 获得手机尺寸
    wx.getSystemInfo({
      success: function (res) {
         that.setData({
               height: res.windowHeight + "px"
          })
          console.log('手机的高度：',that.data.height)
       } 
    })
  },

  // 获取用户的头像和昵称信息 
  btn_bindGetUserInfo: function (res) {
    console.log('点击按钮' , res)
    if(res.detail.userInfo){
      var encryptedData = res.detail.encryptedData,
        iv = res.detail.iv,
        code = this.data.code;
        console.log('code',code)

      // 授权登录
      http.request({
        url:'/api/check_user',
        method: 'POST',
        data:{
          encryptedData: encryptedData,
          iv:iv,
          code:code
        },
        success:(res) => {
          console.log('wx.request : ', res)
          if (res.data.code == 1) {
            app.globalData.token = res.data.data.token;
            app.globalData.openId = res.data.data.openId;
            app.globalData.fullfill = res.data.data.fullfill;
            app.globalData.userImg = res.data.data.avatarUrl;
            app.globalData.mid = res.data.data.mid
            console.log('globalData : ', app.globalData)
            wx.reLaunch({
              url: '/pages/posts/posts',
            })
          }
        }
      })
    }
    
  }
})