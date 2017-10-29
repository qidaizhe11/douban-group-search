import { Commit, Dispatch } from 'vuex'

export interface ActionContext {
  commit: Commit
  dispatch: Dispatch
}
