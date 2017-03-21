//textarea.js
Page({
  data: {
    gameid: ''
  },
  onLoad: function (options) {
    this.setData({
      gameid: options.gameid
    })
  },
  bindButtonTap: function () {
    this.setData({
      focus: true
    })
  },
  bindTextAreaBlur: function (e) {
    console.log(e.detail.value)
  },
  bindFormSubmit: function (e) {
    let that=this
    console.log(e.detail.value.textarea.length > 0)
    // console.log(this.data.gameid)
    let mylogs = wx.getStorageSync('mylogs') || [];
    if (e.detail.value.textarea.length > 0) {
      mylogs.unshift({ timestamp: new Date().toLocaleString(), action: e.detail.value.textarea, name: that.data.gameid, isShow: true, byUser: 1 });
      wx.setStorageSync('mylogs', mylogs);
      wx.showModal({
        title: '提示',
        content: '添加成功！',
        showCancel: false,
        complete : function(){
        // wx.navigateBack({
        //   delta: 1, // 回退前 delta(默认为1) 页面
        // })
        wx.switchTab({
          url: '/pages/logs/logs',
        })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '输入内容不能为空！',
        showCancel: false,
      })
    }

  }
})