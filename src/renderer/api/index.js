import qs from 'qs'

import fetch from '../utils/fetch'

const commonParams = {
  apikey: '0dad551ec0f84ed02907ff5c42e8ec70',
  os_rom: 'miui6',
  channel: 'Xiaomi_Market',
  udid: '8a2a02080cd222dfd017d22833736a7ee3a9bae5'
}

export function fetchGetGroupMembers(params) {
  if (!params.groupId) {
    return
  }
  return fetch({
    url: `/api/v2/group/${params.groupId}/members`,
    method: 'get',
    headers: {
      'Authorization': 'Bearer ' + params.accessToken
    },
    params: {
      start: 0,
      count: 30,
      ...commonParams
    }
  })
}

export function fetchLogin(params) {
  if (!params.account || !params.password) {
    return
  }

  return fetch({
    url: '/service/auth2/token',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: qs.stringify({
      client_id: '0dad551ec0f84ed02907ff5c42e8ec70',
      client_secret: '9e8bb54dc3288cdf',
      grant_type: 'password',
      username: params.account,
      password: params.password
    })
  })
}
