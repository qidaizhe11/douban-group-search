import {
  fetchLogin
} from 'api'
import router from 'router'
import * as types from 'store/mutation-types'

const user = {
  state: {
    id: '',
    name: '',
    accessToken: '',
    refreshToken: '',
    tokenExpiredTime: null,
    isLogined: false
  },
  mutations: {
    [types.SET_USER_INFO](state, user) {
      console.log('action, SET_USER_INFO, user:', user)
      state.id = user.id
      state.accessToken = user.accessToken
      if (user.accessToken) {
        state.isLogined = true
      }
    },
    [types.LOGIN_SUCCESS](state, data) {
      state.isLogined = true
      state.id = data.douban_user_id
      state.name = data.douban_user_name
      state.accessToken = data.access_token
      state.refreshToken = data.refresh_token

      const dateNow = new Date()
      dateNow.setSeconds(dateNow.getSeconds() + data.expires_in)
      state.tokenExpiredTime = dateNow

      localStorage.setItem('userId', state.id)
      localStorage.setItem('accessToken', state.accessToken)
      localStorage.setItem('tokenExpiredTime', state.tokenExpiredTime.toISOString())
      localStorage.setItem('refreshToken', state.refreshToken)

      router.push('/')
    }
  },
  actions: {
    [types.FETCH_POST_LOGIN]({
      commit,
      state
    }, data) {
      fetchLogin({
        account: data.account,
        password: data.password
      }).then(data => {
        commit(types.LOGIN_SUCCESS, data)
      })
    },
    [types.INIT_USRE_INFO_FROM_STORAGE]({
      commit,
      state
    }) {
      console.log('store/user, init_user_info_from_storage.')
      const userId = localStorage.getItem('userId') || ''
      const accessToken = localStorage.getItem('accessToken') || ''
      const refreshToken = localStorage.getItem('refreshToken') || ''
      const tokenExpiredTime = localStorage.getItem('tokenExpiredTime') || ''

      return new Promise((resolve, reject) => {
        commit(types.SET_USER_INFO, {
          id: userId,
          accessToken,
          refreshToken,
          tokenExpiredTime: new Date(tokenExpiredTime)
        })
        resolve()
      })
    }
  }
}

export default user
