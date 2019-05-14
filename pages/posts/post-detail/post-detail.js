// pages/posts/post-detail/post-detail.js

import {HTTP} from '../../../utils/https.js';
let http = new HTTP();

Page({

  /**
   * 页面的初始数据
   */
  data:{
    list: ['公益活动','亲子活动'],
    activeIndex: null,
    drop_down:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      activeIndex : options.index,
      gycount : wx.getStorageSync('gycount'),
      qzcount : wx.getStorageSync('qzcount')
    })
  },

  tabClick:function(e){
    var that = this;
    that.setData({
      activeIndex : e.currentTarget.dataset.activeindex
    })
  },

  btn_activity:function(event){
    console.log(event.currentTarget.dataset)
    // 缓存传值
    wx.setStorageSync('activity_data',event.currentTarget.dataset)
    wx.navigateTo({
      url:'/pages/posts/activity-detail/activity-detail'
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