// pages/from-fill/validation/validation.js

import {HTTP} from '../../../utils/https.js';
let http = new HTTP();

import WxValidate from '../../../utils/WxValidate.js';

var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    form_input:[
      {
        id:1,
        title:'姓名',
        value:'realname',
        type:'text'
      },{
        id:2,
        title:'身份证号码',
        value:'idcard',
        type:'number'
      },{
        id:3,
        title:'小记者编号',
        value:'idno',
        type:'text'
      },{
        id:4,
        title:'联系人',
        value:'contactor',
        type:'text'
      },{
        id:5,
        title:'联系方式',
        value:'phone',
        type:'text'
      },{
        id:6,
        title:'学校',
        value:'school',
        type:'text'
      },{
        id:7,
        title:'班级',
        value:'classic',
        type:'text'
      }
    ]
  },

  initValidate(){        // 创建实例对象
    this.validate = new WxValidate({
        realname: {
            required: true
        },
        idcard:{
            required: true,
            idcard: true
        },
        idno:{
            required: true
        },
        contactor:{
            required: true
        },
        phone:{
            required: true,
            tel: true
        },
        school:{
            required: true
        },
        classic:{
            required: true
        }
    }, {
        realcame: {
            required: '请输入您正确的姓名'
        },
        idcard:{
            required: '请输入您正确的身份证号码'
        },
        idno:{
            required: '请输入您正确的小记者编号'
        },
        contactor:{
            required: '请输入您正确的联系人'
        },
        phone:{
            required: '请输入您正确的联系方式'
        },
        school:{
            required: '请输入您正确的学校'
        },
        classic:{
            required: '请输入您正确的班级'
        }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initValidate()
  },

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

      var that = this,
          formData = e.detail.value;
          formData.token = token;
          formData.openId = openId;

      console.log('formData:',formData)

      http.http({
        url:'/api/store_report',
        method: 'GET',
        header:{
          'Content-Type': 'application/json'
        },
        data:formData,
        success:(res) => {
          console.log('身份验证 : ', res)
          if(res.data.code == 1){
            wx.showToast({
              title:'验证成功',
              duration:1000
            })
            setTimeout(function () {
              wx.navigateBack({
                delta: 1,
              })
            }, 1000)
          }else{
            wx.showToast({
              title:'验证失败,请修改',
              duration:1000
            })
          }
          
        },
        fail:function(res){
          console.log(res)
        },
      })

    }
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