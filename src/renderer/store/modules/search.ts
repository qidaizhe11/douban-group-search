import * as types from 'store/mutation-types'

import { ActionContext } from './util'

export interface SearchParams {
  type: 'group',
  title: string,
  city: string
}

interface State {
  params: SearchParams
}

const state: State = {
  params: {
    type: 'group',
    title: '',
    city: ''
  }
}

export default {
  state: state,
  mutations: {
    [types.SET_SEARCH_PARAMS](state: State, params: SearchParams) {
      state.params = {
        ...state.params,
        ...params
      }
    }
  },
  actions: {
    async [types.SET_SEARCH_PARAMS](context: ActionContext, params: SearchParams) {
      await context.commit(types.SET_SEARCH_PARAMS, params)
    }
  }
}
