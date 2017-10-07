<template>
  <div class="page-container">
    <div class="filter-container">
      <el-tag type="success">{{params.title}}</el-tag>
      <el-tag type="success">{{params.sex}}</el-tag>
      <el-tag type="success">{{params.city}}</el-tag>
    </div>
    <div class="tooltip-container">
    </div>
    <div class="table-container">
    </div>
    <div class="pagination-container">
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import axios from 'axios'
  import {
    doubanApi
  } from 'config/index'

  export default {
    data() {
      return {
        params: {
          type: 'group',
          title: 'https://www.douban.com/group/mini150cm/',
          id: '324211',
          sex: 'female',
          city: '郑州'
        },
        tableData: []
      }
    },
    computed: {
      ...mapState({
        user: state => state.user
      })
    },
    mounted() {
      this.fetchGetGroupUsers()
    },
    methods: {
      fetchGetGroupUsers() {
        const token = this.user.accessToken
        axios({
          url: doubanApi.getGroupMembers(this.params.id),
          method: 'get',
          headers: {
            'Authorization': 'Bearer ' + token
          },
          params: {
            start: 0,
            count: 30,
            apikey: '0dad551ec0f84ed02907ff5c42e8ec70',
            os_rom: 'miui6',
            channel: 'Xiaomi_Market',
            udid: '8a2a02080cd222dfd017d22833736a7ee3a9bae5'
          }
        }).then(response => {
          console.log('fetchGetGroupUsers, response:', response)

          if (!response.ok) {
            console.log('!!!fetchGetGroupUsers, response error! response:', response)
          }

          response.json().then(data => {
            console.log('fetchGetGroupUsers, got data:', data)
            // commit(types.LOGIN_SUCCESS, data)
          })
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .page-container {
    padding: 20px 30px;

    display: flex;
    flex-direction: column;
  }

  .filter-container {
    display: flex;

    .el-tag {
      margin-right: 10px;
    }
  }
</style>
