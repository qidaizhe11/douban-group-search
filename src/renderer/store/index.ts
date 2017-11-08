import Vue from 'vue'
import Vuex from 'vuex'

import user from './modules/user'
import search from './modules/search'

import * as types from './mutation-types'

import { PostLoginParams } from 'api/declarations'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
    search
  },
  strict: process.env.NODE_ENV !== 'production'
})

export default store

export const dispatchUserPostLogin = (payload: PostLoginParams) => {
  return store.dispatch(types.FETCH_POST_LOGIN, payload)
}
