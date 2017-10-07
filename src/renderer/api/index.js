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
