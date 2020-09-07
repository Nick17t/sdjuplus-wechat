// miniprogram/pages/course/index.js
import {weekList, workList} from '../../config/index';
import {px2rpx} from '../../core/utils/common';
import {UserConfig} from '../../config/userConfig'
import {Course} from '../../module/course'
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify.js';

const app = getApp();
const course = new Course()
Page({

  /**
     * 页面的初始数据
     */
  data: {
    statusBar: {
      height: 0,
      icon: 'arrow-down'
    },
    numMultiArray: [
      ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    ],
    numMultiIndex: [0, 0, 0],
    setting: {
      showWeekend: true
    },
    courseSetting: {
      data: {},
      isEdit: false
    },
    courseList: [],
    showSwitchWeek: false,
    showSetting: false,
    showCourseChange: false,
    thisWeek: 1,
    weekSelected: weekList
  },

  /**
     * 生命周期函数--监听页面加载
     */
  onLoad: function (options) {
    this.init();
    const config = new UserConfig()
    console.log(config)
  },

  onShow () {
    const courseList = course.getData()
    this.setData({
      courseList,
      thisWeek: Course.thisWeek
    })
  },

  async init () {
    const newState = {...this.data.statusBar};
    newState.height = await this.getStatusBarHeight();
    this.setData({
      statusBar: newState
    });
  },

  async getStatusBarHeight () {
    const systemInfo = await wx.getSystemInfo();
    return px2rpx(systemInfo.statusBarHeight);
  },
  showPanel (event) {
    const clickModel = event.currentTarget.dataset.showmodel
    switch (clickModel) {
    case 'switchWeek':
      this.setData({
        showSwitchWeek: true
      }); break;
    case 'setting':
      this.setData({
        showSetting: true
      });
    }
  },
  closePanel () {
    this.setData({
      showSwitchWeek: false,
      showSetting: false,
      showCourseChange: false
    });
  },
  changeWeek (event) {
    const week = event.target.dataset.week;
    Course.thisWeek = week
    this.setData({
      thisWeek: week
    });
  },
  onChangeWeekendShow ({detail}) {
    const newSetting = {...this.data.setting}
    newSetting.showWeekend = detail
    this.setData({
      setting: newSetting,
      weekSelected: detail ? weekList : workList
    })
    if (!detail) {
      Notify({ type: 'success', message: '周末没课，开心啊！', safeAreaInsetTop: true })
    } else {
      Notify({ type: 'primary', message: '周末学习，勤奋！', safeAreaInsetTop: true })
    }
  },

  onLongPressCourse (e) {
    console.log(e)
    this.setData({
      courseSetting: {
        data: e.detail.data,
        x: e.detail.x,
        y: e.detail.y,
        isEdit: !e.detail.data.has
      },
      showCourseChange: true
    })
  },

  refreshCourse () {
    course.freshenCourse(1002, true)
  },

  inputChange () {

  },
  onEdit () {
    const setting = {...this.data.courseSetting}
    setting.isEdit = true
    this.setData({
      courseSetting: setting
    })
  },
  onConfirm () {
    this.closePanel()
  },
  async bindMultiPickerChange (e) {
    const list = e.detail.value
    let courseSetting = {...this.data.courseSetting}
    this.setData({
      numMultiIndex: list
    })
    const node = course.generateNode(list)
    const data = course.getData()
    for (let i = 0; i < data.length; i++) {
      if (data[i].node === this.data.courseSetting.data.data.node) {
        data[i].node = node
        courseSetting.data.data.node = node
        break;
      }
    }
    this.setData({
      courseSetting
    })
    course.setCourseList(data)
    this.setData({
      courseList: data
    })
    await course.uploadCourseData()
  },
  bindMultiPickerColumnChange (e) {
    const changeIndex = e.detail.column
    const changeValue = e.detail.value
    const value = [...this.data.numMultiIndex]
    const addEnd = () => {
      value[1] = changeValue
      value[2] = changeValue + 1
    }
    const subtractStart = () => {
      value[1] = changeValue - 1
      value[2] = changeValue
    }
    const updateWeek = () => {
      value[0] = changeValue
    }
    switch (changeIndex) {
    case 0: updateWeek(); break;
    case 1 : addEnd(); break;
    case 2 : subtractStart(); break;
    }
    this.setData({
      numMultiIndex: value
    })
  }

}
);
