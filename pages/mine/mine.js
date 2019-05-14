// pages/mine/mine.js

import {HTTP} from '../../utils/https.js';
let http = new HTTP();

/* import {Data} from '../../utils/data.js';
let getData = new Data(); */

var app = getApp()

Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    mine:{
      userImg:'',
    },
    integral:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;
    var token = app.globalData.token,
        openId = app.globalData.openId;

    // 请求用户信息内容
    http.http({
      url:'/api/get_user_info',
      data:{
        token : token,
        openId : openId
      },
      success:(res) => {
        console.log('用户信息：wx.request : ', res)
        if(res.data.code == 1){
          that.setData({
            info : { 
              userName: res.data.data.nickName, 
              userImg: res.data.data.avatarUrl
            }
          })
          this.setData({
            integral:res.data.data.point
          })
        }
      },
      fail:function(res){
        console.log(res)
      },
      complete:function(res){
        console.log('complete:',res)
      }
    })

    // 请求我参加的活动列表
    http.http({
      url:'/api/get_my_enroll',
      data:{
        token : token,
        openId : openId
      },
      success:(res) => {
        console.log('我参加的活动列表 : ', res)
        res.data.data.forEach(item => {
          item.created_at = item.created_at.substring(0,10)
          item.close_time = item.close_time.substring(0,10)
          app.globalData.have_to_sign_up.push(item.id)
        })
        console.log('app.globalData.have_to_sign_up',app.globalData.have_to_sign_up)
        that.setData({
          my_enroll:res.data.data
        })
        console.log('请求我参加的活动列表',that.data.my_enroll)
      },
      fail:function(res){
        console.log(res)
      }
    })

    // 请求我报名还没有结束的活动
    http.http({
      url:'/api/get_my_enroll_proccess',
      data:{
        token : token,
        openId : openId
      },
      success:(res) => {
        console.log('我报名还没有结束的活动 : ', res)
        res.data.data.forEach(item => {
          item.created_at = item.created_at.substring(0,10)
          item.close_time = item.close_time.substring(0,10)
        })
        that.setData({
          my_enroll_proccess:res.data.data
        })
        console.log('请求我报名还没有结束的活动',that.data.my_enroll_proccess)
      },
      fail:function(res){
        console.log(res)
      }
    })
  },

  // 我的活动
  btn_mine_activity:function(event){
    // 缓存传值
    wx.setStorageSync('my_enroll',event.currentTarget.dataset)
    wx.navigateTo({
      url:'/pages/mine/my-activity/my-activity'
    })
  },

  // 我报名未参加的活动
  btn_activity:function(event){
    console.log("点击 我报名未参加的活动",event.currentTarget.dataset)
    // 缓存传值
    wx.setStorageSync('activity_data',event.currentTarget.dataset)
    wx.navigateTo({
      url:"/pages/posts/activity-detail/activity-detail?addHttps=1&my_activity=1"
    })
  },

  // 编辑
  btn_editor:function(event){
    wx.navigateTo({
      url:"/pages/mine/information-editing/information-editing"
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