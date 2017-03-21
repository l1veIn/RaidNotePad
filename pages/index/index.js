//index.js
var app = getApp();
Page({
  data: {
    userInfo: {},
    items: [],
    mylogs: [],
    counter: 0,
    startX: 0, //开始坐标
    startY: 0,
    role: "",
    gameId: "",
    arrayIndex1: 0,
    array1: ['请选择', '鬼剑士', '神枪手', '格斗家', '魔法师', '圣职者', '暗夜使者', '神枪手(女)', '格斗家(男)', '魔法师(男)', '鬼剑士(女)', '守护者', '魔枪士', '外传职业'],
    arrayIndex2: 0,
    array2: [],
    roles: {
      '请选择': [],
      '鬼剑士': ['剑神', '黑暗君主', '帝血弑天', '天帝'],
      '神枪手': ['掠天之翼', '毁灭者', '机械元首', '战场统治者'],
      '格斗家': ['念帝', '极武圣', '毒神绝', '风暴女皇'],
      '魔法师': ['元素圣灵', '月蚀', '伊斯塔战灵', '古灵精怪'],

      '圣职者': ['神思者', '正义仲裁者', '真龙星君', '永生者'],
      '暗夜使者': ['月影星劫', '亡魂主宰', '不知火', '幽冥'],
      '神枪手(女)': ['绯红玫瑰', '风暴骑兵', '机械之灵', '芙蕾雅'],
      '格斗家(男)': ['念皇', '极武皇', '暗街之王', '宗师'],
      '魔法师(男)': ['湮灭之瞳', '刹那永恒', '血狱君主', '风神', '混沌行者'],
      '鬼剑士(女)': ['剑皇', '裁决女神', '弑神者', '剑帝'],
      '守护者': ['大地女神', '黑曜神'],
      '魔枪士': ['不灭战神', '圣武枪魂'],
      '外传职业': ['黑暗武士', '缔造者']
    }
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
    // console.log(that.data.userInfo)
    var storage = wx.getStorageSync('storage') || [];
    var mylogs = wx.getStorageSync('mylogs') || [];
    var counter = wx.getStorageSync('counter') || 0;
    this.setData({
      items: storage,
      mylogs: mylogs,
      counter: counter
    })
  },
  onReady:function(){
    if(app.updateModal.isShow){
        wx.showModal({
        title: '提示',
        content: '版本已更新，请查看日志',
        showCancel: false,
        complete : function(){
        // wx.navigateBack({
        //   delta: 1, // 回退前 delta(默认为1) 页面
        // })
        // app.updateModal.isShow=false
     
        }
      })
    }
    // 页面渲染完成
  },
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  //保存数据并且setData
  save: function () {
    var storage = this.data.items;
    var mylogs = this.data.mylogs;
    this.setData({
      items: storage,
      mylogs: mylogs
    });
    wx.setStorageSync('storage', storage);
    wx.setStorageSync('mylogs', mylogs);

  },
  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.items.forEach(function (v, i) {
      if (v.isTouchMove)//只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      items: this.data.items
    })
  },
  //滑动事件处理
  touchmove: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,//当前索引
      startX = that.data.startX,//开始X坐标
      startY = that.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    that.data.items.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      items: that.data.items
    })
  },
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  //完成通关
  complete: function (e) {
    if (this.data.items[e.currentTarget.dataset.index].tag < 3 && this.data.items[e.currentTarget.dataset.index].dailytag < 1) {
      this.data.items[e.currentTarget.dataset.index].tag++;
      this.data.items[e.currentTarget.dataset.index].dailytag++;
      //每日通关次数+1
      this.setData({
        counter: ++this.data.counter
      });
      wx.setStorageSync('counter', this.data.counter);
      //历史通关次数+1
      let totalCounter = wx.getStorageSync('totalCounter') || 0;
      wx.setStorageSync('totalCounter', ++totalCounter);
      //日志+1
      this.data.mylogs.unshift({ timestamp: new Date().toLocaleString(), action: '完成通关', name: this.data.items[e.currentTarget.dataset.index].gameid, isShow: true ,byUser:0});
      this.sort();
      this.save()
    } else {
      wx.showModal({
        title: '提示',
        content: '已达到最大通关次数！',
        showCancel: false,

      })
    }
  },
  //获取输入
  bindKeyInput: function (e) {
    // console.log(e);
    this.setData({
      gameId: e.detail.value
    })
  },
  //增加角色
  goToAdder: function () {
    wx.navigateTo({
      url: '/pages/adder/adder'
    })
  },
  adder: function (e) {
    let that = this;
    if (that.data.role === "" || that.data.gameId === "") {
      wx.showModal({
        title: '提示',
        content: '请选择职业并填写角色名',
        showCancel: false,

      })
    } 
    else if(that.data.gameId.length>10){
       wx.showModal({
        title: '提示',
        content: '角色名太长啦',
        showCancel: false,
      })
    }
    else {
      if ((function () {
        for (let item of that.data.items) {
          if (item.gameid === that.data.gameId) {
            return false;
          }
        } return true;
      })()) {
        let src = `/img/${that.data.role}.jpg`
        that.data.items.push({
          gameicon: src,
          gameid: that.data.gameId,
          tag: 0,
          dailytag: 0,
          isTouchMove: false, //默认全隐藏删除
          isShow: true
        });
        that.data.mylogs.unshift({ timestamp: new Date().toLocaleString(), action: '添加新角色', name: that.data.gameId, isShow: true ,byUser:0});
        that.setData({
          arrayIndex1: 0,
          arrayIndex2: 0,
          gameId: "",
          array2: [],
          role: ""
        });
        that.sort();
        that.save()
      } else {
        wx.showModal({
          title: '提示',
          content: '角色名已经存在！',
          showCancel: false,
        })
      }
    }

  },
  //长按角色
  del: function (e) {

    let that = this;
    let functions = [];
    functions[0] = function () {
      wx.navigateTo({
        url: `/pages/addlog/addlog?gameid=${that.data.items[e.currentTarget.dataset.index].gameid}`,
        success: function(res){
          // success
        },
        fail: function() {
          // fail
        },
        complete: function() {
          // complete
        }
      })
      // that.data.mylogs.unshift({ timestamp: new Date().toLocaleString(), action: '今天我爆了个荒古 好开心好开心啊啊啊啊啊啊好好好哈啊哈哈哈哈啊哈哈哈哈啊好啊好哈哈哈哈', name: that.data.items[e.currentTarget.dataset.index].gameid, isShow: true,byUser:true });
      // that.save();
    }
    functions[1] = function () {
      console.log(0);
      wx.showModal({
        title: '确定重置通今日关次数吗？',
        // content: '重置后无法恢复',
        success: function (res) {
          if (res.confirm) {
            that.data.mylogs.unshift({ timestamp: new Date().toLocaleString(), action: '重置今日通关次数', name: that.data.items[e.currentTarget.dataset.index].gameid, isShow: true,byUser:0 });
            that.data.items[e.currentTarget.dataset.index].dailytag = 0;
            that.save();
            //每日通关次数-1
            that.setData({
              counter: --that.data.counter
            });
            wx.setStorageSync('counter', that.data.counter);
            //历史通关次数-1
            let totalCounter = wx.getStorageSync('totalCounter') || 0;
            wx.setStorageSync('totalCounter', --totalCounter);

          }
        }
      })
    };
    functions[2] = function () {
      console.log(1);
      wx.showModal({
        title: '确定重置本周通关次数吗？',
        // content: '重置后无法恢复',
        success: function (res) {
          if (res.confirm) {
            that.data.mylogs.unshift({ timestamp: new Date().toLocaleString(), action: '重置周通关次数', name: that.data.items[e.currentTarget.dataset.index].gameid, isShow: true,byUser:0 });



            that.data.items[e.currentTarget.dataset.index].tag = 0;
            that.save();

          }
        }
      })
    };
    functions[3] = function () {
      console.log(2);
      wx.showModal({
        title: '确定删除该角色吗？',
        content: '删除后无法恢复',
        success: function (res) {
          if (res.confirm) {
            that.data.mylogs.unshift({ timestamp: new Date().toLocaleString(), action: '删除角色', name: that.data.items[e.currentTarget.dataset.index].gameid, isShow: true,byUser:0 });
            that.data.items.splice(e.currentTarget.dataset.index, 1);

            that.save();

          }
        }
      })
    };
    // console.log(app.currentRole);
    wx.showActionSheet({
      itemList: ['添加一条角色日志', '重置今日通关次数', '重置本周通关次数', '删除角色'],
      success: function (res) {
        // console.log(res.tapIndex)
        if (res.tapIndex >= 0)
          functions[res.tapIndex]();
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })

    // let that = this;
    // wx.showModal({
    //   title: '确定删除该角色吗？',
    //   content: '删除后无法恢复',
    //   success: function (res) {
    //     if (res.confirm) {
    //       that.data.mylogs.unshift({ timestamp: new Date().toLocaleString(), action: '删除角色', name: that.data.items[e.currentTarget.dataset.index].gameid,isShow:true });
    //       that.data.items.splice(e.currentTarget.dataset.index, 1);

    //       that.save();

    //     }
    //   }
    // })
  },
  //按照tag排序
  sort: function () {
    this.data.items.sort(function (x, y) {
      if (x.tag < y.tag) {

        return -1;
      }
      if (x.tag > y.tag) {
        return 1;
      }
      return 0;
    })
  },
  //重置
  reset: function () {
    let that = this;
    wx.showModal({
      title: '确定重置通关次数吗？',
      content: '重置后无法恢复',
      success: function (res) {
        if (res.confirm) {
          for (var item of that.data.items) {
            item.tag = 0
          }
          that.data.mylogs.unshift({ timestamp: new Date().toLocaleString(), action: '重置通关次数', name: "", isShow: true,byUser:0 });
          that.save();
        }
      }
    })
  },
  //查看历史通关次数
  showTotalCounter: function () {
    let totalCounter = wx.getStorageSync('totalCounter') || 0;
    wx.showModal({
      title: '提示',
      content: `共计通关 ${totalCounter} 次，共计消耗魔刹石${totalCounter*50}个`,
      showCancel: false,
    })
  },
  //picker方法
  bindPickerChange1: function (e) {
    let that = this;
    that.setData({
      arrayIndex1: e.detail.value,
      arrayIndex2: 0,
      array2: that.data.roles[`${that.data.array1[e.detail.value]}`],
      role: e.detail.value.toString() + '0'
    });
  },
  bindPickerChange2: function (e) {
    let that = this;
    that.setData({
      arrayIndex2: e.detail.value,
      role: that.data.arrayIndex1.toString() + e.detail.value.toString()
    });

  },
  //获取search输入
  bindSearchInput: function (e) {
    let that = this;
    // // console.log(e);
    let items = that.data.items
    for (let item of items) {
      if (item.gameid.indexOf(e.detail.value) < 0 && `${item.tag}/3`.indexOf(e.detail.value) < 0 && `${item.dailytag}/1`.indexOf(e.detail.value) < 0) {
        item.isShow = false;
      } else {
        item.isShow = true;
      }
    }
    this.setData({
      items: items
    })
  },
  //test
  // testtest: function () {
  //   let that = this;
  //   let functions = [];
  //   functions[0] = function () {
  //     console.log(0);
  //   };
  //   functions[1] = function () {
  //     console.log(1);
  //   };
  //   functions[2] = function () {
  //     console.log(2);
  //   };
  //   wx.showActionSheet({
  //     itemList: ['重置今日通关次数', '重置本周通关次数', '删除角色'],
  //     success: function (res) {
  //       functions[res.tapIndex]();
  //     },
  //     fail: function (res) {
  //       console.log(res.errMsg)
  //     }
  //   })
  // }


})