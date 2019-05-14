Component({
  properties: {
     itemData : {
       type : Object
     },
     index : {
       type : Number
     }
  },
  data:{
    activity_data:null,
    activity_index:0
  },
  ready(){
    this.setData({
      activity_data : this.properties.itemData,
      activity_index : this.properties.index
    }) 
    // console.log('当前点击的活动this.data : ',this.data.activity_data)
    // console.log('当前点击的活动this.index : ',this.data.activity_index)
  },
})