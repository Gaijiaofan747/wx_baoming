import {HTTP} from '../../../utils/https.js';
let http = new HTTP();

import WxValidate from '../../../utils/WxValidate.js';

var app = getApp()

Page({
  data: {
    multiSelector:['00.0','00.0','B'],
    customItem:'全部',

    heightArray:['00.0','180.0','170.0','160.0'],
    heightIndex:0,

    weightArray:['00.0','60.0','70.0','80.0'],
    weightIndex:0,

    bloodArray:['A','B','AB','O'],
    bloodIndex:0,

    SessionIndex:0,

    more:false,

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
        title:'孩子姓名',
        value:'realname',
        type:'text'
      },{
        id:2,
        title:'身份证号码',
        value:'idcard',
        type:'number'
      },{
        id:3,
        title:'护照证号码',
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
      }
    ]
  },

  // 点击更多
  btn_more:function(e){
    this.setData({
      more:true
    })
    console.log('more')
  },

  // 身高
  bindHeigheChange:function(e){
    this.setData({
      heightIndex:e.detail.value
    })
  },

  // 血型
  bindBloodChange:function(e){
    this.setData({
      bloodIndex:e.detail.value
    })
  },

  // 体重
  bindWeightChange:function(e){
    this.setData({
      weightIndex:e.detail.value
    })
  },

  // 活动场次
  bindSessionChange:function(e){
    console.log('sessionIndex:' ,e)
    this.setData({
      SessionIndex:e.detail.value
    })
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
        }
    })
  },

  onLoad: function (options) {
    var token = app.globalData.token,
        openId = app.globalData.openId;

    this.initValidate()
    this.setData({
      activity_id : options.id
    })
    console.log('当前活动的ID',this.data.activity_id)

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
        wx.setStorageSync("user_information",user_information)
        this.setData({
          'form_input_1[0].user' : user_information.realname,
          'form_input_1[1].user' : user_information.idcard,
          'form_input_2[0].user' : user_information.school,
          'form_input_2[1].user' : user_information.classic
        })
      },
      fail:function(res){
        console.log(res)
      }
    })

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
      },
      fail:function(res){
        console.log(res)
      },
    })
  },

  // 表单提交
  formSubmit:function(e){
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var token = app.globalData.token,
        openId = app.globalData.openId;
    if (!this.validate.checkForm(e.detail.value)){         
        const error = this.validate.errorList[0];
        wx.showToast({
            title: `${error.msg} `,
            icon: 'none'
        })            
        return false
    }else{
      var that = this;
      var formData = e.detail.value;
          formData.token = token;
          formData.openId = openId;
          e.detail.value.activity_times_id = this.data.SessionId[this.data.SessionIndex];

      wx.navigateTo({
        url: `./next-step/next-step?formData=${JSON.stringify(e.detail.value)}&id=${that.data.activity_id}`
      })

    }
  }
})