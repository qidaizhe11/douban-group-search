<template>
  <div class="page-container">
    <div class="content-container">
      <div class="type-container">
        <el-radio-group v-model="type">
          <el-radio-button label="groupUser">小组用户</el-radio-button>
          <el-radio-button label="groupTopic">小组话题</el-radio-button>
        </el-radio-group>
      </div>
      <div class="title-container">
        <el-input placeholder="请输入小组网址" v-model="title">
          <template slot="prepend">小组网址</template>
        </el-input>
        <div class="title-tooltip">
          如：https://www.douban.com/group/zhengzhou/
        </div>
      </div>
      <div class="filter-container">
        <div class="filter-text">
          筛选条件：
        </div>
        <div class="filter-content" v-show="type === 'groupUser'">
          <!-- <el-radio-group class="filter-sex" v-model="sex">
                            <el-radio label="male">男</el-radio>
                            <el-radio label="female">女</el-radio>
                            <el-radio label="all">男女不限</el-radio>
                          </el-radio-group> -->
          <el-input class="filter-city" placeholder="城市" v-model="city">
            <template slot="prepend">城市</template>
          </el-input>
        </div>
        <div class="filter-content" v-show="type === 'groupTopic'">
          <el-input class="filter-offset" placeholder="查询起始数" v-model="offset">
            <template slot="prepend">查询起始数</template>
          </el-input>
        </div>
      </div>
      <div class="button-container">
        <el-button class="search-button" type="primary" @click="onSearch">
          搜索
        </el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  // import { mapState } from 'vuex'
  // import { State } from 'store/declarations'

  import { UserState } from 'store/modules/user'

  import router from 'router'
  import store from 'store/index'
  import {
    INIT_USRE_INFO_FROM_STORAGE,
    SET_SEARCH_PARAMS
  } from 'store/mutation-types'
  import { SearchParams } from 'store/modules/search'

  export default Vue.extend({
    data() {
      return {
        type: 'groupUser',
        title: '',
        city: '郑州',
        offset: 0
      }
    },
    computed: {
      // ...mapState({
      //   user: (state: State) => state.user
      // })
      user(): UserState {
        return this.$store.state.user
      }
    },
    mounted() {
      // const that = this
      store.dispatch(INIT_USRE_INFO_FROM_STORAGE).then(() => {
        if (!this.user.isLogined) {
          router.push('/login')
        }
      })
    },
    methods: {
      onSearch() {
        if (!this.title) {
          return
        }
        const params: SearchParams = {
          title: this.title,
          city: this.city,
          type: this.type === 'groupTopic' ? 'groupTopic' : 'groupUser',
          offset: this.offset
        }
        store.dispatch(SET_SEARCH_PARAMS, params).then(() => {
          if (this.type === 'groupTopic') {
            router.push('/result/group-topics')
          } else {
            router.push('/result')
          }
        })
      }
    }
  })
</script>

<style lang="scss" scoped>
  .page-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .content-container {
    width: 500px;
    display: flex;
    flex-direction: column;

    .title-container {
      padding: 10px 0;

      display: flex;
      flex-direction: column;

      .title-type-select {
        width: 80px;
      }

      .title-tooltip {
        padding-left: 4px;
        font-size: 12px;
        color: #999;
      }
    }

    .filter-container {
      padding-bottom: 10px;
      display: flex;
      flex-direction: column;

      .filter-text {
        font-size: 14px;
        margin: 10px 0;
      }
      .filter-content {
        display: flex;
        flex-direction: column;
      }
    }

    .button-container {
      padding: 10px 0;
      .search-button {
        width: 100%;
      }
    }
  }
</style>
