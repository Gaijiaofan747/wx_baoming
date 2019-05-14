import {HTTP} from '../../../utils/https.js';
let http = new HTTP();

import WxValidate from '../../../utils/WxValidate.js';

var app = getApp();

Page({
  data: {
    region:['县','市','区'],
    customItem:'全部'
  },

  bindRegionChange:function(e){
    this.setData({
      region:e.detail.value
    })
  },

  initValidate(){        // 创建实例对象
    this.validate = new WxValidate({
        realName: {
            required: true,
        },
        phone:{
            required:true,
            tel:true
        },
        address:{
            required:true
        }
    }, {
        realName: {
            required: '请填写您的姓名'
        },
        phone:{
            required:'请填写您正确的手机号'
        },
        address:{
            required:'请填写您的详细地址'
        }
    })
  },

  onLoad: function (options) {
      this.initValidate()

      // 将缓存的用户信息自动填入到表单里面
      this.setData({
        name_user:wx.getStorageSync('name_user'),
        name_phone:wx.getStorageSync('name_phone'),
        name_gender:wx.getStorageSync('name_gender'),
        region:wx.getStorageSync('name_region'),
        name_address:wx.getStorageSync('name_address')
      })
  },

  formSubmit(e){        // 校验表单
      console.log('form发生了submit事件，携带数据为：', e.detail.value)
      if (!this.validate.checkForm(e.detail.value)){         
          const error = this.validate.errorList[0];
          wx.showToast({
              title: `${error.msg} `,
              icon: 'none'
          })            
          return false
      }else{
        var token = app.globalData.token,
            openId = app.globalData.openId;
        console.log('token',app.globalData.token)
        console.log('openId',app.globalData.openId)

        var that = this,
            formData = e.detail.value;
            formData.token = token;
            formData.openId = openId;
            formData.province = e.detail.value.region[0];
            formData.city = e.detail.value.region[1];
            formData.county = e.detail.value.region[2];
        // 发送请求
        http.http({
          url:'/api/store_user_info',
          method: 'GET',
          header:{
            'Content-Type': 'application/json'
          },
          data:formData,
          success:(res) => {
            console.log('个人信息存储 : ', res)
            // 缓存用户提交的信息
            wx.setStorageSync('name_user',e.detail.value.realName)
            wx.setStorageSync('name_phone',e.detail.value.phone)
            wx.setStorageSync('name_gender',e.detail.value.gender)
            wx.setStorageSync('name_region',e.detail.value.region)
            wx.setStorageSync('name_address',e.detail.value.address)

            if(res.data.code == 1){
              wx.showToast({
                title:'保存成功',
                duration:1000
              })
              setTimeout(function () {
                wx.reLaunch({
                  url: '../mine',
                })
              }, 1000)
            }
          },
          fail:function(res){
            console.log(res)
          },
        })  // 保存操作...
      }        

  },

  onShow:function(){
  
  }

})