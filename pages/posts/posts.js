// pages/posts/posts.js

import {HTTP} from '../../utils/https.js';
let http = new HTTP();

var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
      dorp_down:false
  },

  // 公益活动
  btn_public:function(event){
    wx.navigateTo({
      url:'./post-detail/post-detail?index=0'
    })
  },

  // 亲子活动
  btn_parents:function(event){
    wx.navigateTo({
      url:'./post-detail/post-detail?index=1'
    })
  },

  // 详情页面
  btn_activity:function(event){
    console.log('btn_activity:',event.currentTarget.dataset)
    // 缓存传值
    wx.setStorageSync('activity_data',event.currentTarget.dataset)
    wx.navigateTo({
      url:'./activity-detail/activity-detail'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.showLoading({
      title: '加载中'
    })

    // 获取首页的数据
    http.request({
      url:'/api/get_index',
      method: "GET",
      success: (res) => {
        console.log('请求的首页',res)
        var activity = res.data.data.activity;
        activity.lastList.forEach(item => {
          item.close_time = item.close_time.substring(0,10)
        })
        activity.gycount.forEach(item => {
          item.close_time = item.close_time.substring(0,10)
        })
        activity.qzcount.forEach(item => {
          item.close_time = item.close_time.substring(0,10)
        })
        that.setData({
          post_data : activity
        })
        wx.setStorageSync('gycount',activity.gycount)
        wx.setStorageSync('qzcount',activity.qzcount)
        wx.hideLoading()
      }
    })

    // 请求我参加的活动列表
    var token = app.globalData.token,
        openId = app.globalData.openId;
    http.http({
      url:'/api/get_my_enroll',
      data:{
        token : token,
        openId : openId
      },
      success:(res) => {
        res.data.data.forEach(item => {
          app.globalData.have_to_sign_up.push(item.id)
        })
        console.log('首页app.globalData.have_to_sign_up',app.globalData.have_to_sign_up)
      },
      fail:function(res){
        console.log(res)
      }
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
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      drop_down:true
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})