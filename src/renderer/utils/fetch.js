import axios from 'axios'
import {
  Message,
  MessageBox
} from 'element-ui'

import router from 'router'

import {
  DOUBAN_API_ROOT
} from 'config'

const service = axios.create({
  baseURL: DOUBAN_API_ROOT,
  timeout: 10000
})

service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code) {
      Message({
        message: `服务器返回错误：${res.localized_message}`,
        type: 'error',
        duration: 5 * 1000
      })
      console.log('fetch', response.config.url, 'server return error:', res.localized_message)

      return Promise.reject(new Error(res.localized_message || res.msg || '未知错误'))
    } else {
      console.log('fetch', response.config.url, 'success, got response:', res)
      return res
    }
  },
  error => {
    console.log('fetch error. error:', error)
    const response = error.response
    if (response.data && response.data.code) {
      const resData = response.data
      if (resData.code === 102 || resData.code === 106) {
        MessageBox.confirm('登录失效，可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          router.push('/login')
        })
      } else {
        Message({
          message: `通讯失败：${resData.localized_message || resData.msg}`,
          type: 'error',
          duration: 5 * 1000
        })
      }

      return
    }
    Message({
      message: `通讯失败：${error.message}`,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
