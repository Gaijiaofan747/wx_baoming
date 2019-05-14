import {HTTP} from '../../../utils/https.js';
let http = new HTTP();

// 富文本
var WxParse = require('../../../utils/wxParse/wxParse.js');

var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    members_list:null,
    activity_data : null,
    more_isShow:false,
    my_activity:0
  },

  more:function(event){
    this.onReady();
    this.setData({
      _members_list:this.data.members_list,
      more_isShow:false
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("options",options)
    wx.showLoading({
      title: '加载中'
    })

    // 缓存获取活动数据
    var activity_data = wx.getStorageSync('activity_data')
    this.setData({
      activity_data:activity_data.activity
    })
    console.log('activity_data:',this.data.activity_data)
    
    // 判断是否已经报名过了
    console.log('activity-detail:have_to_sign_up',app.globalData.have_to_sign_up)
    app.globalData.have_to_sign_up.forEach(item => {
      if(item == this.data.activity_data.id){
        this.setData({
          my_activity:1
        })
      }
    })
    
    // 富文本
    var that = this;
    var content = this.data.activity_data.content;
    WxParse.wxParse('content', 'html', content, that,5);

    // 判断是否是从我的活动列表里面点击过来的
    if(options.addHttps){
      var img = 'https://enroll.ty300.cn/upload/' + this.data.activity_data.img
      this.setData({
        'activity_data.img':img
      })
      console.log('https + img' , this.data.activity_data.img)
    }else{
  
    }

    wx.hideLoading()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    var token = app.globalData.token,
        openId = app.globalData.openId;
        console.log('token',app.globalData.token)
        console.log('openId',app.globalData.openId)

    var that = this;
    var data = {
      token:token,
      openId:openId
    }

    // // 获取小记者验证审核的状态
    // http.http({
    //   url:'/api/get_report_passed',
    //   method: 'GET',
    //   header:{
    //     'Content-Type': 'application/json'
    //   },
    //   data:data,
    //   success:(res) => {
    //     console.log('小记者审核状态 : ', res)
    //     that.setData({
    //       validation_state:res.data.code
    //     })
    //   },
    //   fail:function(res){
    //     console.log(res)
    //   },
    // })

    var data = {id:this.data.activity_data.id};

    // 获取活动参与人员头像
    http.request({
      url:'/api/get_user_by_actid',
      method: 'GET',
      header:{
        'Content-Type': 'application/json'
      },
      data:data,
      success:(res) => {
        console.log('活动参与人员头像 : ', res)
        that.setData({
          members_list:res.data.data
        })
        console.log('members_list',this.data.members_list)

        // 判断报名人数是否超过七个
        if(this.data.members_list.length > 7){
          var _members_list = this.data.members_list.slice(0,7)
          this.setData({
            _members_list : _members_list,
            more_isShow:true
          })
          console.log('报名的参加人数：',this.data._members_list)
          console.log('是否显示更多按钮',this.data.more_isShow)
        }else if(this.data.members_list.length <= 7){
          this.setData({
            _members_list : this.data.members_list,
            more_isShow:false
          })
          console.log('报名的参加人数：',this.data._members_list)
          console.log('是否显示更多按钮',this.data.more_isShow)
        }

        // 判断如果参加人数达到报名人数就无法报名
        console.log('this.data.members_list.length',this.data.members_list.length)
        console.log('this.data.activity_data.num',this.data.activity_data.num)
        if(this.data.members_list.length >= this.data.activity_data.num){
          this.setData({
            my_activity:2
          })
        }
      },
      fail:function(res){
        console.log(res)
      },
    })
  },

  // 点击报名
  btn_sign_up:function(event){
    var token = app.globalData.token,
        openId = app.globalData.openId;
        console.log('token',app.globalData.token)
        console.log('openId',app.globalData.openId)

    var that = this;
    var data = {
      token:token,
      openId:openId
    }
    // 获取小记者验证审核的状态
    http.http({
      url:'/api/get_report_passed',
      method: 'GET',
      header:{
        'Content-Type': 'application/json'
      },
      data:data,
      success:(res) => {
        console.log('小记者审核状态 : ', res)
        that.setData({
          validation_state:res.data.code
        })
        // 判断状态是否通过验证
        if(this.data.validation_state == 1){
          // 判断活动的类型  1 = 亲子活动   2 = 公益活动
          console.log('活动的type：',this.data.activity_data.type)
          if(this.data.activity_data.type == 1){
            wx.navigateTo({
              url:'../../from-fill/children/children?id=' + this.data.activity_data.id
            })
          }else if(this.data.activity_data.type == 2){
            wx.navigateTo({
              url:'../../from-fill/sign-up/sign-up?id=' + this.data.activity_data.id
            })
          }
        }else if(this.data.validation_state == 0){
          wx.showModal({
            title: '验证提醒',
            content: '对不起，您的身份未验证，暂无参加活动的权限！',
            confirmText: "立即验证",
            cancelText: "关闭",
            success: function (res) {
                console.log(res);
                if (res.confirm) {
                    wx.navigateTo({
                      url:'/pages/from-fill/validation/validation'
                    })
                }else{
                  
                }
            }
          })
        }else if(this.data.validation_state == 2){
          wx.showToast({
            title:'正在审核中',
            icon: 'none'
          })
        }
      },
      fail:function(res){
        console.log(res)
      },
    })

    // // 判断状态是否通过验证
    // if(this.data.validation_state == 1){
    //   // 判断活动的类型  1 = 亲子活动   2 = 公益活动
    //   console.log('活动的type：',this.data.activity_data.type)
    //   if(this.data.activity_data.type == 1){
    //     wx.navigateTo({
    //       url:'../../from-fill/children/children?id=' + this.data.activity_data.id
    //     })
    //   }else if(this.data.activity_data.type == 2){
    //     wx.navigateTo({
    //       url:'../../from-fill/sign-up/sign-up?id=' + this.data.activity_data.id
    //     })
    //   }
    // }else if(this.data.validation_state == 0){
    //   wx.showModal({
    //     title: '验证提醒',
    //     content: '对不起，您的身份未验证，暂无参加活动的权限！',
    //     confirmText: "立即验证",
    //     cancelText: "关闭",
    //     success: function (res) {
    //         console.log(res);
    //         if (res.confirm) {
    //             wx.navigateTo({
    //               url:'/pages/from-fill/validation/validation'
    //             })
    //         }else{
              
    //         }
    //     }
    //   })
    // }else if(this.data.validation_state == 2){
    //   wx.showToast({
    //     title:'正在审核中',
    //     icon: 'none'
    //   })
    // }
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