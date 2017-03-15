//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || [];
    //每天早上6点作为新的一天
    logs.unshift(new Date(Date.now()-6*60*60*1000).toLocaleString().split(" ")[0]);
    if(logs.length>10){
      logs.pop();
    }
    wx.setStorageSync('logs', logs);
   //如果昨天和今天不是一天，那么重置今日灭杀次数
    if (logs[0]&&logs[1]&&logs[0]!==logs[1]){
      wx.setStorageSync('counter', 0);
      var items = wx.getStorageSync('storage') || [];
       for (var item of items) {
            item.dailytag = 0
       }
      wx.setStorageSync('storage', items);
      var mylogs = wx.getStorageSync('mylogs') || [];
      mylogs.unshift({ timestamp: new Date().toLocaleString(), action: '已重置今日通关次数', name:""});
      wx.setStorageSync('mylogs', mylogs);
    };
    //如果昨天和今天不是一天，并且今天是星期三，那么重置全部灭杀次数
    if (logs[0]&&logs[1]&&logs[0]!==logs[1]&&Date().split(" ")[0]==='Wed'){
      var items = wx.getStorageSync('storage') || [];
       for (var item of items) {
            item.tag = 0
       }
      wx.setStorageSync('storage', items);
      var mylogs = wx.getStorageSync('mylogs') || [];
      mylogs.unshift({ timestamp: new Date().toLocaleString(), action: '已重置全部通关次数', name:""});
      wx.setStorageSync('mylogs', mylogs);
    }
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData:{
    userInfo:null
  }
})
