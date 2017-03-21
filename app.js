//app.js
App({
  onLaunch: function () {
    //检测版本更新
    var version = wx.getStorageSync('version') || '';
    //  if (true){
    if (version!=='v2.0.2'){
      version = 'v2.0.2';
      let m = new Map([['剑神', '10'], ['黑暗君主', '11'], ['帝血弑天', '12'], ['天帝', '13'], ['掠天之翼', '20'], ['毁灭者', '21'], ['机械元首', '22'], ['战场统治者', '23'], ['念帝', '30'], ['极武圣', '31'], ['毒神绝', '32'], ['风暴女皇', '33'], ['元素圣灵', '40'], ['月蚀', '41'], ['伊斯塔战灵', '42'], ['古灵精怪', '43'], ['神思者', '50'], ['正义仲裁者', '51'], ['真龙星君', '52'], ['永生者', '53'], ['月影星劫', '60'], ['亡魂主宰', '61'], ['不知火', '62'], ['幽冥', '63'], ['绯红玫瑰', '70'], ['风暴骑兵', '71'], ['机械之灵', '72'], ['芙蕾雅', '73'], ['念皇', '80'], ['极武皇', '81'], ['暗街之王', '82'], ['宗师', '83'], ['湮灭之瞳', '90'], ['刹那永恒', '91'], ['血狱君主', '92'], ['风神', '93'], ['混沌行者', '94'], ['剑皇', '100'], ['裁决女神', '101'], ['弑神者', '102'], ['剑帝', '103'], ['大地女神', '110'], ['黑曜神', '111'], ['不灭战神', '120'], ['圣武枪魂', '121'], ['黑暗武士', '130'], ['缔造者', '131']]);
let items = wx.getStorageSync('storage') || [];
       for (let item of items) {
      for (let x of m.keys()){
        if(item.gameicon.indexOf(x)>=0){
          item.gameicon=`/img/${m.get(x)}.jpg`;
        }
      // console.log(m.get(x));
      }
       }
      wx.setStorageSync('storage', items);
      let mylogs = wx.getStorageSync('mylogs') || [];
      for (let log of mylogs){
        log.isShow = true;
        log.byUser = 0;
      }
      mylogs.unshift({ timestamp: new Date().toLocaleString(), action: `版本已更新至 ${version}，现在可以按照角色或者日期来筛选日志，长按日志条目会删除一条日志，长按角色可以手动添一条自定义角色日志，方便记录打团收获。欢迎加入bug反馈交流群：559730915。目前已知漏洞：自动重置所有通关次数只会在周三触发，周三不打开小程序则不会自动重置所有通关次数。`, name:"",isShow:true,byUser:0});
      wx.setStorageSync('mylogs', mylogs);
      wx.setStorageSync('version', version);
      this.updateModal.isShow=true;
      console.log("updated version")
    }


    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || [];
    //每天早上6点作为新的一天
    logs.unshift(new Date(Date.now()-6*60*60*1000).toLocaleString().split(" ")[0]);
    // console.log(new Date(new Date(logs[0]).valueOf()+24*60*60*1000))
    // console.log(function(){
    //   let time1 = new Date(logs[0]).valueOf();
    //   let time2 = new Date(logs[1]).valueOf();
    //   for(;time2<time1;){
    //     time2 = time2 + 24*60*60*1000;
    //     if(new Date(time2).getDay()==3){
    //       return true
    //     }
    //   }
    //    return false
    // }())
    if(logs.length>10){
      logs.pop();
    }
    wx.setStorageSync('logs', logs);
   //如果昨天和今天不是一天，那么重置今日灭杀次数
    if (logs[0]&&logs[1]&&logs[0]!==logs[1]){
      wx.setStorageSync('counter', 0);
      var items = wx.getStorageSync('storage') || [];
       for (let item of items) {
            item.dailytag = 0
       }
      wx.setStorageSync('storage', items);
      var mylogs = wx.getStorageSync('mylogs') || [];
      mylogs.unshift({ timestamp: new Date().toLocaleString(), action: '已重置今日通关次数', name:"",isShow:true,byUser:0});
      wx.setStorageSync('mylogs', mylogs);
    };

    //如果昨天和今天不是一天，并且今天是星期三，那么重置全部灭杀次数
    // if (logs[0]&&logs[1]&&logs[0]!==logs[1]&&Date().split(" ")[0]==='Wed'){
    if (logs[0]&&logs[1]&&logs[0]!==logs[1]&&(
      function(){
      let time1 = new Date(logs[0]).valueOf();
      let time2 = new Date(logs[1]).valueOf();
      for(;time2<time1;){
        time2 = time2 + 24*60*60*1000;
        if(new Date(time2).getDay()==3){
          return true
        }
      }
       return false
    }()
    )){
      var items = wx.getStorageSync('storage') || [];
       for (let item of items) {
            item.tag = 0
       }
      wx.setStorageSync('storage', items);
      var mylogs = wx.getStorageSync('mylogs') || [];
      mylogs.unshift({ timestamp: new Date().toLocaleString(), action: '已重置全部通关次数', name:"",isShow:true,byUser:0});
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
  },
  updateModal:{
    isShow:false
  }
  
})
