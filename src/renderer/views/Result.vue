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
  import { fetchGetGroupMembers } from 'api'

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
      this.getGroupUsers()
    },
    methods: {
      getGroupUsers() {
        const accessToken = this.user.accessToken

        fetchGetGroupMembers({
          accessToken,
          groupId: this.params.id
        }).then(data => {
          console.log('fetchGetGroupUsers, got data:', data)
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
