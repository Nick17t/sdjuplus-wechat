import {Course} from '../../module/course'

class Judger {
  course = new Course()
  static lessonNodes = []
  static instance = null
  constructor () {
    if (Judger.instance !== null) {
      return this
    } else {
      const courseData = this.course.getData()
      this.genericLessonNodes(courseData)
      Judger.instance = this
    }
  }
  hasLesson (x, y, courseList) {
    let coordinate = `${x}-${y}`
    for (let i = 0; i < courseList.length; i++) {
      const lessonNode = Judger.lessonNodes.filter((v) => v.node === coordinate)
      if (lessonNode.length === 1) {
        return {
          has: true,
          data: courseList[lessonNode[0].index],
          isStart: lessonNode[0].isStart,
          isEnd: lessonNode[0].isEnd
        }
      } else if (lessonNode.length > 1) {
        const thisWeek = this.course.getThisWeek().toString()
        for (let j = 0; j < lessonNode.length; j++) {
          if (courseList[lessonNode[j].index].week.split(',').includes(thisWeek)) {
            return {
              has: true,
              data: courseList[lessonNode[j].index],
              isStart: lessonNode[j].isStart,
              isEnd: lessonNode[j].isEnd
            }
          }
        }
      } else if (lessonNode === undefined) {
        return {
          has: false,
          data: null,
          index: null,
          isStart: false,
          isEnd: false
        }
      }
    }
    return {
      has: false,
      data: null,
      isStart: false,
      isEnd: false
    }
  }

  genericLessonNodes (courseData) {
    let res = []
    for (let i = 0; i < courseData.length; i++) {
      let lesson = courseData[i]
      let nodes = lesson.node.split('&')
      let [start, end] = nodes
      let week = start[0]
      let startNode = start[start.length - 1]
      let endNode = end[end.length - 1]
      // 处理当课程只有一小节时的情况
      if (startNode == endNode) {
        res.push({
          isStart: true,
          isEnd: true,
          index: i,
          node: `${week}-${startNode}`
        })
        break;
      }
      for (let j = startNode; j <= endNode; j++) {
        if (j == startNode) {
          res.push({
            isStart: true,
            isEnd: false,
            index: i,
            node: `${week}-${j}`
          })
        } else if (j == endNode) {
          res.push({
            isStart: false,
            isEnd: true,
            index: i,
            node: `${week}-${j}`
          })
        } else {
          res.push({
            isStart: false,
            isEnd: false,
            index: i,
            node: `${week}-${j}`
          })
        }
      }
    }
    Judger.lessonNodes = res
  }
}

export {
  Judger
}
