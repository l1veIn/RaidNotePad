
var app = getApp();
Page({
  data: {
    userInfo: {},
    logs: [],
    roleArray: ['所有角色'],
    roleArrayIndex: 0,
    date: [],
    today: ''
  },
  onLoad: function () {
    let that = this;
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
    // console.log(that.data.userInfo)
  },
  onShow: function () {
    let that = this;
    var logs = wx.getStorageSync('mylogs') || [];
    var items = wx.getStorageSync('storage') || [];
    if (logs) {
      that.setData({ logs: logs })
    };
    for (let item of items) {
      if (that.data.roleArray.indexOf(item.gameid) < 0) {
        that.data.roleArray.push(item.gameid)
      }
    };
    // that.data.roleArray.unshift('所有角色');
    // for(let log of logs ){

    // }

    that.setData({
      roleArray: that.data.roleArray,
      // date:that.data.date,
      // today:
    })

  },
  //picker方法
  bindRoleChange: function (e) {
    let that = this;

    let gameid = that.data.roleArray[e.detail.value];
    that.setData({
      roleArrayIndex: e.detail.value
    });
    for (let log of that.data.logs) {
      if (gameid !== '所有角色' && log.name !== gameid) {
        log.isShow = false;
      } else {
        log.isShow = true;
      }
    };
    that.setData({
      logs: that.data.logs,
      date: []
    })

  },


  bindDateChange: function (e) {
    let that = this;
    for (let log of that.data.logs) {
      //  console.log(log.timestamp.split(" ")[0])
      //  console.log(e.detail.value.split("-").join('/').split("/0").join('/'))
      if (log.timestamp.split(" ")[0] != e.detail.value.split("-").join('/').split("/0").join('/')) {
        log.isShow = false;
      } else {
        log.isShow = true;
      }
    }
    //  console.log(e.detail.value)
    this.setData({
      roleArrayIndex: 0,
      logs: that.data.logs,
      date: e.detail.value
    })
  },
  del: function (e) {
    let that = this;
    wx.showModal({
      title: '确定删除该条日志吗？',
      content: '删除后无法恢复',
      success: function (res) {
        if (res.confirm) {
          that.data.logs.splice(e.currentTarget.dataset.index, 1);
          that.setData({
            logs: that.data.logs,
          });
          wx.setStorageSync('mylogs', that.data.logs)
        }
      }
    })
  }
})

