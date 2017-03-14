Page({
  data:{
    logs: []
  },
  onShow: function () {
    var logs = wx.getStorageSync('mylogs')
    if (logs) {
      this.setData({ logs: logs})
    }
  },
})
