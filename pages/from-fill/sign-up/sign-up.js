import {HTTP} from '../../../utils/https.js';
let http = new HTTP();

import WxValidate from '../../../utils/WxValidate.js';

var app = getApp()

Page({
  data:{
    items: [
      {id:1,name: '心脏病', value: '心脏病'},
      {id:2,name: '血压异常', value: '血压异常'},
      {id:3,name: '癫痫', value: '癫痫'},
      {id:4,name: '哮喘', value: '哮喘'},
      {id:5,name: '皮肤过敏', value: '皮肤过敏'},
      {id:6,name: '做过重大手术', value: '做过重大手术'},
    ],
    form_input_1:[
      {
        id:1,
        title:'小记者姓名',
        value:'realname',
        type:'text'
      },{
        id:2,
        title:'小记者身份证号码',
        value:'idcard',
        type:'number'
      },{
        id:3,
        title:'小记者护照证号码',
        value:'huzhao',
        type:'text'
      }
    ],
    form_input_2:[
      {
        id:1,
        title:'学校',
        value:'school',
        type:'text'
      },{
        id:2,
        title:'班级',
        value:'classic',
        type:'text'
      },{
        id:3,
        title:'家长姓名',
        value:'familyname',
        type:'text'
      },{
        id:4,
        title:'家长手机号',
        value:'familyphone',
        type:'number'
      }
    ],

    values:{
      realname:''
    },

    SessionIndex:0,

    more:false
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
        huzhao:{
            required: true
        },
        school:{
            required: true
        },
        classic:{
            required: true
        },
        familyname:{
            required: true
        },
        familyphone:{
            required: true,
            tel: true
        }
    }, {
        realcame: {
            required: '请输入您正确的姓名'
        },
        idcard:{
            required: '请输入您正确的身份证号码'
        },
        huzhao:{
            required: '请输入您正确的小记者护照证号码'
        },
        school:{
            required: '请输入您正确的学校'
        },
        classic:{
            required: '请输入您正确的班级'
        },
        familyname:{
            required: '请输入您正确的家长姓名'
        },
        familyphone:{
            required: '请输入您正确的家长手机号'
        }
    })
  },

  btn_more:function(e){
    this.setData({
      more:true
    })
    console.log('more')
  },

  bindSessionChange:function(e){
    this.setData({
      SessionIndex:e.detail.value
    })
  },

  onLoad: function (options) {
    var token = app.globalData.token,
        openId = app.globalData.openId;

    // 我的认证资料信息
    http.http({
      url:'/api/get_report_info',
      data:{
        token : token,
        openId : openId
      },
      success:(res) => {
        console.log('我的认证资料信息 : ', res.data.data[0])
        var user_information = res.data.data[0];
        this.setData({
          'form_input_1[0].user' : user_information.realname,
          'form_input_1[1].user' : user_information.idcard,
          /* 'form_input_1[2].user' : user_information.huzhao, */
          'form_input_2[0].user' : user_information.school,
          'form_input_2[1].user' : user_information.classic,
          'form_input_2[2].user' : user_information.contactor,
          'form_input_2[3].user' : user_information.phone
        })
      },
      fail:function(res){
        console.log(res)
      }
    })

    // 用户已提交过的数据自动填入
    console.log('app.globalData.user_information',app.globalData.user_information)
    if(app.globalData.user_information){
      var user_information = app.globalData.user_information;
      this.setData({
        'form_input_1[0].user' : user_information.realname,
        'form_input_1[1].user' : user_information.idcard,
        'form_input_1[2].user' : user_information.huzhao,
        'form_input_2[0].user' : user_information.school,
        'form_input_2[1].user' : user_information.classic,
        'form_input_2[2].user' : user_information.familyname,
        'form_input_2[3].user' : user_information.familyphone
      })
    }

    this.initValidate();
    this.setData({
      activity_id : options.id
    })
    console.log('活动的id',this.data.activity_id)

    // 请求活动场次时间
    var SessionArray=[],
        SessionId=[];
    http.http({
      url:'/api/get_act_times',
      method: 'GET',
      header:{
        'Content-Type': 'application/json'
      },
      data:{
        id:this.data.activity_id,
        token : app.globalData.token,
        openId : app.globalData.openId
      },
      success:(res) => {
        console.log('length',res.data.data.length)
        if(res.data.data.length > 0){
          console.log('请求活动场次时间 : ', res)
          res.data.data.forEach(i=>{
            SessionId.push(i.id)
            SessionArray.push(i.title)
          })
          this.setData({
            SessionId:SessionId,
            SessionArray:SessionArray
          })
          console.log('SessionId',this.data.SessionId)
          console.log('SessionArray',this.data.SessionArray)
        }else{
          this.setData({
            SessionId:0,
            SessionArray:[]
          })
        }
        
      },
      fail:function(res){
        console.log(res)
      },
    })
  },

  // 提交表单
  formSubmit:function(e){
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
      var formData = e.detail.value;
          formData.token = token;
          formData.openId = openId;
          formData.activity_id = this.data.activity_id;
          formData.activity_times_id = this.data.SessionId[this.data.SessionIndex];

      console.log('form发生了submit事件，携带数据为：', formData)
      // 发送请求
      http.http({
        url:'/api/store_info',
        method: 'GET',
        header:{
          'Content-Type': 'application/json'
        },
        data:formData,
        success:(res) => {
          console.log('公益报名提交 : ', res)
          if(res.data.code == 1){
            wx.showToast({
              title:'提交成功',
              duration:1000
            })
            setTimeout(function () {
              wx.navigateTo({
                url: './complete/complete',
              })
            }, 1000)
          }
        },
        fail:function(res){
          console.log(res)
        },
      }) 
    }
  }
})