import { fetchLogin } from 'api'
import router from 'router'
import * as types from 'store/mutation-types'

import { ActionContext, UserInfo } from 'store/declarations'
import { PostLoginParams } from 'api/declarations'

export interface UserState {
  id: string
  name: string
  accessToken: string
  refreshToken: string
  tokenExpiredTime: Date | null
  isLogined: boolean
}

const state: UserState = {
  id: '',
  name: '',
  accessToken: '',
  refreshToken: '',
  tokenExpiredTime: null,
  isLogined: false
}

const user = {
  state: state,
  mutations: {
    [types.SET_USER_INFO](state: UserState, user: UserInfo) {
      state.id = user.id || ''
      state.accessToken = user.accessToken || ''
      if (user.accessToken) {
        state.isLogined = true
      }
    },
    [types.LOGIN_SUCCESS](state: UserState, userInfo: UserInfo) {
      state.isLogined = true
      state = {
        ...state,
        ...userInfo
      }

      localStorage.setItem('userId', state.id)
      localStorage.setItem('accessToken', state.accessToken)
      localStorage.setItem(
        'tokenExpiredTime',
        state.tokenExpiredTime ? state.tokenExpiredTime.toISOString() : ''
      )
      localStorage.setItem('refreshToken', state.refreshToken)

      router.push('/')
    }
  },
  actions: {
    [types.FETCH_POST_LOGIN](context: ActionContext, params: PostLoginParams) {
      fetchLogin(params).then((data: any) => {
        let tokenExpiredTime = null
        if (data.expires_in) {
          const dateNow = new Date()
          dateNow.setSeconds(dateNow.getSeconds() + data.expires_in)
          tokenExpiredTime = dateNow
        }

        const userInfo: UserInfo = {
          id: data.douban_user_id,
          name: data.douban_user_name,
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          tokenExpiredTime: tokenExpiredTime
        }
        context.commit(types.LOGIN_SUCCESS, userInfo)
      })
    },
    [types.INIT_USRE_INFO_FROM_STORAGE](context: ActionContext) {
      const userId = localStorage.getItem('userId') || ''
      const accessToken = localStorage.getItem('accessToken') || ''
      const refreshToken = localStorage.getItem('refreshToken') || ''
      const tokenExpiredTime = localStorage.getItem('tokenExpiredTime') || ''

      return new Promise((resolve, reject) => {
        context.commit(types.SET_USER_INFO, {
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
