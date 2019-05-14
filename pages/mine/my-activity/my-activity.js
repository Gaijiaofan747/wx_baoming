// pages/mine/my-activity/my-activity.js

import {HTTP} from '../../../utils/https.js';
let http = new HTTP();

var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  return:function(event){
    wx.switchTab({
      url:"/pages/mine/mine"
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // 缓存获取活动数据
    var activity_list = wx.getStorageSync('my_enroll')
    this.setData({
      activity_list:activity_list.activity
    })
    console.log('activity_list:',this.data.activity_list)

  },

  // 详情页面
  btn_activity:function(event){
    console.log(event.currentTarget.dataset)
    // 缓存传值
    wx.setStorageSync('activity_data',event.currentTarget.dataset)
    wx.navigateTo({
      url:"/pages/posts/activity-detail/activity-detail?addHttps=1&my_activity=1"
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