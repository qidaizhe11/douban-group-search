import { Commit, Dispatch } from 'vuex'
import { UserState } from './modules/user'
import { SearchState } from './modules/search'

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

export interface State {
  user: UserState,
  search: SearchState
}
