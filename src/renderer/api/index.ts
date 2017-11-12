import qs from 'qs'
// import { AxiosPromise } from 'axios'

import fetch from '../utils/fetch'

import { PostLoginParams } from './declarations'

const commonParams = {
  apikey: '0dad551ec0f84ed02907ff5c42e8ec70',
  os_rom: 'miui6',
  channel: 'Xiaomi_Market',
  udid: '8a2a02080cd222dfd017d22833736a7ee3a9bae5'
}

interface Params {
  accessToken: string
}

interface UserIdParams extends Params {
  userId: string
}

interface GroupIdParams extends Params {
  groupId: string
}

export function fetchGetGroupMembers(params: GroupIdParams) {
  // if (!params.groupId) {
  //   return
  // }
  return fetch.request({
    url: `/api/v2/group/${params.groupId}/members`,
    method: 'get',
    headers: {
      Authorization: 'Bearer ' + params.accessToken
    },
    params: {
      start: 0,
      count: 30,
      ...commonParams
    }
  })
}

export function fetchGetUserInfo(params: UserIdParams) {
  if (!params.userId) {
    return
  }
  return fetch.request({
    url: `/api/v2/user/${params.userId}/`,
    method: 'get',
    headers: {
      Authorization: 'Bearer ' + params.accessToken
    },
    params: {
      ...commonParams
    }
  })
}

export function fetchGetUserLifeStreamTimeSlices(params: UserIdParams) {
  if (!params.userId) {
    return
  }
  return fetch.request({
    url: `/api/v2/user/${params.userId}/lifestream/timeslices`,
    method: 'get',
    headers: {
      Authorization: 'Bearer ' + params.accessToken
    },
    params: {
      ...commonParams
    }
  })
}

export function fetchGetUserLifeStream(params: any) {
  if (!params.userId) {
    return
  }
  return fetch.request({
    url: `/api/v2/user/${params.userId}/lifestream`,
    method: 'get',
    headers: {
      Authorization: 'Bearer ' + params.accessToken
    },
    params: {
      count: 20,
      slice: params.slice,
      ...commonParams
    }
  })
}

interface GetGroupTopicsParams extends GroupIdParams {
  start: number
}

export function fetchGetGroupTopics(params: GetGroupTopicsParams) {
  return fetch.request({
    url: `/api/v2/group/${params.groupId}/topics`,
    method: 'get',
    headers: {
      Authorization: 'Bearer ' + params.accessToken
    },
    params: {
      count: 30,
      start: params.start,
      ...commonParams
    }
  })
}

export function fetchLogin(params: PostLoginParams) {
  // if (!params.account || !params.password) {
  //   return
  // }

  return fetch.request({
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
