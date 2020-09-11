/**
 * @author 陌上青夏
 * @创建时间 2020/7/24 10:12 上午
 */
import {CourseAPI} from '../api/course'
import {HttpCode} from '../api/common'
import {randomColor} from '../core/utils/common'


class Course {
  courseList = []
  static instance = null
  isInitColor = false
  thisWeek = new WeakMap().set(this, null)
  userId = 1002

  constructor () {
    if (Course.instance !== null) {
      return Course.instance
    } else {
      if (this.thisWeek.get(this) === null) {
        const value = this.readThisWeekFromWX()
        if (value) {
          this.setThisWeek(value)
        } else {
          this.initThisWeek()
        }
      }
      Course.instance = this
      return this
    }
  }

  getThisWeek () {
    return this.thisWeek.get(this)
  }

  setThisWeek (value) {
    this.thisWeek.set(this, value)
    wx.setStorageSync('thisWeek', value)
  }

  readThisWeekFromWX () {
    return wx.getStorageSync('thisWeek')
  }

  initThisWeek () {
    wx.setStorageSync('thisWeek', 1)
    this.thisWeek.set(this, 1)
  }

  get hasData () {
    return this.courseList.length !== 0
  }

  refreshCourseStorage () {
    wx.setStorageSync('courseList', this.courseList)
  }

  setCourseList (courseList) {
    this.courseList = courseList
    this.refreshCourseStorage()
  }

  initCourseColor () {
    for (let i = 0; i < this.courseList.length; i++) {
      this.courseList[i].color = randomColor()
    }
    this.refreshCourseStorage()
    this.isInitColor = true
  }

  getData () {
    if (this.courseList.length !== 0) {
      return this.courseList
    } else {
      const courseList = wx.getStorageSync('courseList')
      if (courseList) {
        this.courseList = courseList
        return courseList
      }
    }
  }

  getWeek (node) {
    return node.split('&').charAt(0)
  }

  async updateCourseData (userId) {
    const data = await CourseAPI.getUserCourseMsg(userId)
    if (data.data.code === HttpCode.successCode) {
      this.courseList = data.data.userCourseList
      this.initCourseColor()
      wx.setStorageSync('courseList', this.courseList)
    } else {
      console.error('课程信息请求失败')
    }
  }

  generateNode (list) {
    const week = list[0] + 1
    const start = list[1] + 1
    const end = list[2] + 1
    return `${week}-${start}&${week}-${end}`
  }

  generateEmptyCourse () {
    return {
      node: '',
      name: '',
      location: '',
      color: randomColor(),
      teacher: '',
      week: []
    }
  }

  async uploadCourseData () {

  }

  async freshenCourse (userId, force = false) {
    if (force) {
      await this.updateCourseData(userId)
    } else {
      this.getData()
      if (!this.hasData) {
        await this.updateCourseData(userId)
      }
    }
  }
}

export {
  Course
}
