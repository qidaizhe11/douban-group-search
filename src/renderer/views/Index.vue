<template>
  <div class="page-container">
    <div class="content-container">
      <div class="title-container">
        <el-input placeholder="请输入小组网址" v-model="title">
          <el-select slot="prepend" class="title-type-select" v-model="type" placeholder="请选择">
            <el-option label="小组" value="group"></el-option>
          </el-select>
        </el-input>
        <div class="title-tooltip">
          如：https://www.douban.com/group/zhengzhou/
        </div>
      </div>
      <div class="filter-container">
        <div class="filter-text">
          筛选条件：
        </div>
        <div class="filter-content">
          <!-- <el-radio-group class="filter-sex" v-model="sex">
            <el-radio label="male">男</el-radio>
            <el-radio label="female">女</el-radio>
            <el-radio label="all">男女不限</el-radio>
          </el-radio-group> -->
          <el-input class="filter-city" placeholder="城市" v-model="city">
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

<script>
  import { mapState } from 'vuex'

  import router from 'router'
  import { INIT_USRE_INFO_FROM_STORAGE, SET_SEARCH_PARAMS } from 'store/mutation-types'

  export default {
    data() {
      return {
        type: 'group',
        title: 'https://www.douban.com/group/mini150cm/',
        sex: 'all',
        city: '郑州'
      }
    },
    computed: {
      ...mapState({
        user: state => state.user
      })
    },
    mounted() {
      const that = this
      this.$store.dispatch(INIT_USRE_INFO_FROM_STORAGE)
        .then(() => {
          if (!that.user.isLogined) {
            router.push('/login')
          }
        })
    },
    methods: {
      onSearch() {
        // router.push('/result')
        this.$store.dispatch(SET_SEARCH_PARAMS, {
          title: this.title,
          city: this.city,
          type: this.type
        }).then(() => {
          router.push('/result')
        })
      }
    }
  }
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

        .filter-city {
          padding-top: 10px;
        }
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
