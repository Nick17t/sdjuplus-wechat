import {UserApi} from '../api/user'

class User {
  static instance = null
  static isLogin = false
  constructor () {
    if (User.instance !== null) {
      return User.instance
    } else {
      User.instance = this
      return this
    }
  }
  async login () {
    const { code, errMsg } = await wx.login()
    if (errMsg.endsWith(':ok')) {
      // User.isLogin = true
      const res = await UserApi.login(code)
    }
  }

  async getUserInfo () {

  }

}

export {
  User
};
