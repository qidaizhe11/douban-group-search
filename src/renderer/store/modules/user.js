import Qs from 'qs'
import {
  doubanApi
} from 'config/index'
// import router from 'router'
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

      // router.push('/')
    }
  },
  actions: {
    [types.FETCH_POST_LOGIN]({
      commit,
      state
    }, data) {
      const postData = Qs.stringify({
        client_id: '0dad551ec0f84ed02907ff5c42e8ec70',
        client_secret: '9e8bb54dc3288cdf',
        grant_type: 'password',
        username: data.username,
        password: data.password
      })
      fetch(doubanApi.loginUrl, {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: postData
      }).then(response => {
        console.log('fetch_login, response:', response)

        if (!response.ok) {
          console.log('!!!fetch_login, response error! response:', response)
        }

        response.json().then(data => {
          console.log('fetch_login, got data:', data)
          commit(types.LOGIN_SUCCESS, data)
        })
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
