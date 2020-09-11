// components/course/lesson/index.js
import {Judger} from '../../module/judger';

Component({

  /**
   * 组件的属性列表
   */
  options: {
    addGlobalClass: true
  },
  properties: {
    x: {
      type: Number,
      require: true
    },
    y: {
      type: Number,
      require: true
    },
    courseList: {
      type: Array
    },
    thisWeek: {
      type: Number
    }
  },

  observers: {
    'courseList': function () {
      this.getLesson()
    },
    'thisWeek': function () {
      this.getLesson()
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    lesson: null,
    nodeLength: 2
  },

  lifetimes: {
    ready () {
      this.getLesson()
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getLesson () {
      let { x, y, courseList } = this.properties
      let judger = new Judger()
      let lesson = judger.hasLesson(x, y, courseList)
      this.setData({
        lesson
      })
    },
    showChangePanel () {
      this.triggerEvent('LongPressCourse', {
        data: this.data.lesson,
        x: this.properties.x,
        y: this.properties.y
      }, {
        bubbles: true,
        composed: true
      })
    }
  }
})
