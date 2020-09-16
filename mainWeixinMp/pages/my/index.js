// miniprogram/pages/my/index.js
import { User } from '../../module/user';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isBindEdu: false,
    isLogin: User.isLogin,
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { text = '123', reload } = options;
    if (parseInt(reload)) {
      wx.reLaunch({
        url: `/pages/my/index?reload=0&text=${text}`
      });
    }
    this.setData({
      text
    });
  },
  onGetUserInfo (e) {
    console.log(e);
    const { errMsg, userInfo } = e.detail;
    if (errMsg.endsWith(':ok')) {
      this.setData({
        userInfo
      });
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    console.log(e);
    return {
      title: '你好，9月',
      imageUrl:
        'https://7465-test-e46hy-1258836890.tcb.qcloud.la/%E4%BD%A0%E5%A5%BD%E4%B9%9D%E6%9C%88%E6%96%87%E8%89%BA%E5%B0%8F%E6%B8%85%E6%96%B0%E6%89%8B%E6%9C%BA%E6%B5%B7%E6%8A%A5%40%E5%87%A1%E7%A7%91%E5%BF%AB%E5%9B%BE.png?sign=41411489c4af3aa438d27b3bb76cb490&t=1598788355',
      path: '/pages/my/index?text=hello&reload=1'
    };
  },
  async jump () {
    await wx.navigateTo({
      url: '/uniSubpackage/pages/mix/index'
    })
  }
});
