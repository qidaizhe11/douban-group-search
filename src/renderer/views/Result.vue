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
  import request from 'superagent'
  import cheerio from 'cheerio'
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
      // this.getGroupUsers()
      this.getGroupUsersFilterByCity()
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
      },
      getGroupUsersFilterByCity() {
        // const that = this
        const url = 'https://www.douban.com/group/mini150cm/member_search?search_text=' + encodeURIComponent('郑州')
        request
          .get(url)
          .set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36')
          .end((err, res) => {
            if (err) {
              console.log('Result, request error:', err)
            }
            console.log('Result, request success, res:', res)
            const $ = cheerio.load(res.text)
            const $memberList = $('.member-list li')
            const userList = []
            $memberList.each((i, value) => {
              const member = $(value)
              const user = {}
              const memberNameNode = member.find('.name a').first()
              if (memberNameNode) {
                user.name = memberNameNode.text()
                user.url = memberNameNode.attr('href')
              }
              const memberImageNode = member.find('.pic a img').first()
              if (memberImageNode) {
                user.imageUrl = memberImageNode.attr('src')
              }
              const memberCityNode = member.find('.pl').first()
              if (memberCityNode) {
                user.city = memberCityNode.text().replace('(', '').replace(')', '')
              }
              userList.push(user)
            })
            console.log('Result, http get end, member list:', userList)
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
