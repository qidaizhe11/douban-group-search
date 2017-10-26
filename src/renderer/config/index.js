export const DOUBAN_API_ROOT = 'https://frodo.douban.com'

export const doubanApi = {
  loginUrl: DOUBAN_API_ROOT + '/service/auth2/token',
  getChatListUrl: DOUBAN_API_ROOT + '/api/v2/chat_list',
  getChatMessagesUrl: DOUBAN_API_ROOT + '/api/v2/im/messages',
  syncChatMessageUrl: DOUBAN_API_ROOT + '/api/v2/im/sync',
  postChatMessageOfUserIdUrl(userId) {
    return DOUBAN_API_ROOT + `/api/v2/user/${userId}/chat/create_message`
  },
  readChatMessagesOfUserIdUrl(userId) {
    return DOUBAN_API_ROOT + `/api/v2/user/${userId}/chat/read_message`
  },
  getFollowingUrl(userId) {
    return DOUBAN_API_ROOT + `/api/v2/user/${userId}/following`
  },
  getHomeTimelineUrl: DOUBAN_API_ROOT + '/api/v2/status/home_timeline',
  getHasNewRecsUrl:
    DOUBAN_API_ROOT + '/api/v2/user/recommended_users/has_new_recs',
  getGroupMembers(groupId) {
    return DOUBAN_API_ROOT + `/api/v2/group/${groupId}/members`
  }
}

export const SPIDER_USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
