// app.js
import {User} from './module/user';
import {UserConfig} from 'config/userConfig'
import {Course} from './module/course'
App({
  onLaunch: async function () {
    console.log(wx.__uniapp2wxpack)
    let user = new User();
    let config = new UserConfig();
    const course = new Course()
    course.freshenCourse(1002)
    // user.login();
  },
  globalData: {
    user: User
  }
});
