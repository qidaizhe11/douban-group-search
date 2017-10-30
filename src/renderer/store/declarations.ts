import { Commit, Dispatch } from 'vuex'

export interface ActionContext {
  commit: Commit
  dispatch: Dispatch
}

export interface UserInfo {
  id?: string
  name?: string
  accessToken?: string
  refreshToken?: string
  tokenExpiredTime?: Date | null
  isLogined?: boolean
}
