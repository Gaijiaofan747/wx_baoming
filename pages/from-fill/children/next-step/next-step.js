import {HTTP} from '../../../../utils/https.js';
let http = new HTTP();

import WxValidate from '../../../../utils/WxValidate.js';

var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    form_input:[
      {
        id:1,
        title:'家长姓名',
        value:'familyname',
        type:'text'
      },{
        id:2,
        title:'家长手机号',
        value:'familyphone',
        type:'number'
      },{
        id:3,
        title:'家长身份证号码',
        value:'famliyidcard',
        type:'number'
      },{
        id:4,
        title:'家长护照号码',
        value:'familyhuzhao',
        type:'text'
      },{
        id:5,
        title:'家长微信号',
        value:'familyweixin',
        type:'text'
      },{
        id:6,
        title:'另一位家长姓名（选填）',
        value:'familyname1',
        type:'text'
      },{
        id:7,
        title:'另一位家长手机号（选填）',
        value:'familyphone1',
        type:'number'
      },{
        id:8,
        title:'另一位家长身份证号码（选填）',
        value:'familyidcard1',
        type:'number'
      },{
        id:9,
        title:'另一位家长微信号（选填）',
        value:'familyweixin1',
        type:'text'
      }
    ],

    region:['省','市','区'],
    customItem:'全部'
  },

  bindRegionChange:function(e){
    this.setData({
      region:e.detail.value
    })
  },

  initValidate(){        // 创建实例对象
    this.validate = new WxValidate({
        familyname: {
            required: true
        },
        familyphone:{
            required: true,
            tel:true
        },
        famliyidcard:{
            required: true,
            idcard: true
        },
        familyhuzhao:{
            required: true
        },
        familyweixin:{
            required: true
        }
    }, {
        familyname: {
            required: '请输入您正确的家长姓名'
        },
        familyphone:{
            required: '请输入您正确的家长手机号'
        },
        famliyidcard:{
          required: '请输入您正确的家长身份证号码'
        },
        familyhuzhao:{
          required: '请输入您正确的家长护照证号码'
        },
        familyweixin:{
          required: '请输入您正确的家长微信号'
        }
      })
    },
    
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      console.log(JSON.parse(options.formData))
      this.setData({
          formData_chidren : JSON.parse(options.formData),
          id : options.id
      })
      this.initValidate()

      // 用户已提交过的数据自动填入
      var user_information = wx.getStorageSync('user_information');
      console.log("user_information",user_information)
      this.setData({
        'form_input[0].user' : user_information.contactor,
        'form_input[1].user' : user_information.phone
      })
    },
    
    // 提交表单
    formSubmit:function(e){
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

        var formData = this.data.formData_chidren;
            formData.token = token;
            formData.openId = openId;
            formData.activity_id = this.data.id;
            formData.province = e.detail.value.region[0];
            formData.city = e.detail.value.region[1];
            formData.county = e.detail.value.region[2]; 
            formData.familyname = e.detail.value.familyname;
            formData.familyname1 = e.detail.value.familyname1;
            formData.familyphone = e.detail.value.familyphone;
            formData.familyphone1 = e.detail.value.familyphone1;
            formData.famliyidcard = e.detail.value.famliyidcard;
            formData.familyidcard1 = e.detail.value.familyidcard1;
            formData.familyweixin = e.detail.value.familyweixin;
            formData.familyweixin1 = e.detail.value.familyweixin1;
            formData.familyhuzhao = e.detail.value.familyhuzhao;
  
        // 发送请求
        http.http({
          url:'/api/store_info',
          method: 'GET',
          header:{
            'Content-Type': 'application/json'
          },
          data:formData,
          success:(res) => {
            console.log('亲子报名第二步 : ', res)
            if(res.data.code == 1){
              wx.showToast({
                title:'提交成功',
                duration:1000
              })
              setTimeout(function () {
                wx.navigateTo({
                  url: '../../sign-up/complete/complete'
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

  return:function(e){
    wx.navigateBack({
      delta:1
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})