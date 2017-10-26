import * as types from 'store/mutation-types'

export default {
  state: {
    params: {
      type: 'group',
      title: '',
      city: ''
    }
  },
  mutations: {
    [types.SET_SEARCH_PARAMS](state, params) {
      state.params = {
        ...state.params,
        ...params
      }
    }
  },
  actions: {
    async [types.SET_SEARCH_PARAMS]({ commit }, params) {
      await commit(types.SET_SEARCH_PARAMS, params)
    }
  }
}
