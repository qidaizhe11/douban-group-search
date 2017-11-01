import * as types from 'store/mutation-types'

import { ActionContext } from 'store/declarations'

export interface SearchParams {
  type: 'group',
  title: string,
  city: string
}

export interface SearchState {
  params: SearchParams
}

const state: SearchState = {
  params: {
    type: 'group',
    title: '',
    city: ''
  }
}

export default {
  state: state,
  mutations: {
    [types.SET_SEARCH_PARAMS](state: SearchState, params: SearchParams) {
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
