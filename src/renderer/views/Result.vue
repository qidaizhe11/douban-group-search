<template>
  <div class="page-container">
    <div class="filter-container">
      <el-button size="mini" @click="onReturnClick">返回主页</el-button>
      <el-tag type="success">{{params.title}}</el-tag>
      <!-- <el-tag type="success">{{params.sex}}</el-tag> -->
      <el-tag type="success">{{params.city}}</el-tag>
    </div>
    <div class="tooltip-container">
    </div>
    <div class="table-container">
      <el-table-wrapper ref="table" border stripe :data="tableData" :columns="tableColumns"
        :pagination="tablePagination">
        <template slot-scope="scope" slot="name-slot">
          <div class="name-container">
            <div class="avatar-container">
              <img :src="scope.row.imageUrl" class="avatar"></img>
            </div>
            <span>{{scope.row.name}}</span>
          </div>
        </template>
        <template slot-scope="scope" slot="url-slot">
          <el-button type="text" @click="onUserUrlClick(scope.row.url)">主页</el-button>
        </template>
      </el-table-wrapper>
    </div>
    <div class="pagination-container">
    </div>
  </div>
</template>

<script>
  import { shell } from 'electron'
  import Vue from 'vue'
  import { mapState } from 'vuex'
  import request from 'superagent'
  import cheerio from 'cheerio'
  import ElTableWrapper from 'element-table-wrapper'
  import _ from 'lodash'

  import router from 'router'
  import { INIT_USRE_INFO_FROM_STORAGE } from 'store/mutation-types'
  import {
    fetchGetGroupMembers,
    fetchGetUserInfo,
    fetchGetUserLifeStream,
    fetchGetUserLifeStreamTimeSlices
  } from 'api'

  Vue.use(ElTableWrapper)

  export default {
    data() {
      return {
        tableData: [],
        tableColumns: [
          {
            prop: 'name',
            label: '昵称',
            scopedSlot: 'name-slot'
          },
          {
            prop: 'gender',
            label: '性别',
            width: 80
          },
          {
            prop: 'city',
            label: '城市',
            width: 100
          },
          {
            prop: 'followingCount',
            label: '关注',
            width: 80
          },
          {
            prop: 'followersCount',
            label: '关注者',
            width: 80
          },
          {
            prop: 'joinedGroupCount',
            label: '加入小组',
            width: 100
          },
          {
            prop: 'latestStreamTimeShow',
            label: '最近活跃时间',
            width: 180
          },
          {
            prop: 'registerTimeShow',
            label: '注册时间',
            width: 180
          },
          {
            prop: 'url',
            label: '主页',
            width: 100,
            scopedSlot: 'url-slot'
          }
        ],
        tablePagination: {
          pageSize: 20,
          pageSizes: [10, 20, 50, 100],
          layout: 'total, sizes, prev, pager, next'
        }
      }
    },
    computed: {
      ...mapState({
        user: state => state.user,
        params: state => state.search.params
      })
    },
    async mounted() {
      const that = this
      await this.$store.dispatch(INIT_USRE_INFO_FROM_STORAGE)

      if (!that.user.isLogined) {
        router.push('/login')
        return
      }
      const userList = await this.getGroupUsersFilterByCity()
      this.addUserIdOfUserList(userList)
      this.getUserDetailOfUserList(userList)
    },
    methods: {
      onReturnClick() {
        router.push('/')
      },
      onUserUrlClick(url) {
        shell.openExternal(url)
      },
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
        const url = _.trimEnd(this.params.title, '/') + '/member_search?search_text=' +
          encodeURIComponent(this.params.city)

        return new Promise((resolve, reject) => {
          request
            .get(url)
            .set(
              'User-Agent',
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
            )
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
                  user.city = memberCityNode
                    .text()
                    .replace('(', '')
                    .replace(')', '')
                }
                userList.push(user)
              })
              console.log('Result, http get end, member list:', userList)
              resolve(userList)
            })
        })
      },
      addUserIdOfUserList(userList) {
        if (!userList) {
          return
        }

        // const that = this
        userList.map((user, i) => {
          const userIdMatch = user.imageUrl.match(/icon\/u(\d+)(?:-\d+.)?/)
          if (userIdMatch.length > 1) {
            user.id = userIdMatch[1]
          }
        })

        console.log('Result, here, userList:', userList)
        return userList
      },
      getUserDetailOfUserList(userList) {
        if (!userList) {
          return
        }

        this.userList = userList

        const that = this
        userList.map((user, i) => {
          setTimeout(() => {
            that.getUserDetail(user)
          }, 300 * i)
        })
      },
      async getUserDetail(user) {
        const that = this
        const accessToken = this.user.accessToken

        let data = await fetchGetUserInfo({
          accessToken,
          userId: user.id
        })

        if (data && data.id) {
          user.followingCount = data.following_count
          user.followersCount = data.followers_count
          user.joinedGroupCount = data.joined_group_count
          user.registerTime = data.reg_time
          user.registerTimeShow = new Date(data.reg_time)
            .toISOString()
            .slice(0, 10)
          user.gender = data.gender
          user.location = {
            id: data.loc.id,
            name: data.loc.name,
            uid: data.loc.uid
          }
        }

        data = await fetchGetUserLifeStreamTimeSlices({
          accessToken,
          userId: user.id
        })

        if (data && data.timeslices && data.timeslices.length > 0) {
          const slice = data.timeslices[0].slice
          if (slice) {
            data = await fetchGetUserLifeStream({
              accessToken,
              userId: user.id,
              slice
            })

            console.log('fetchGetUserLifeStream, got data:', data)
            if (data && data.items && data.items.length > 0) {
              const date = new Date(data.items[0].time)
              user.latestStreamTime = date
              user.latestStreamTimeShow = date.toISOString().slice(0, 10)
            }

            that.tableData.push(user)
          }
        }
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

  .table-container {
    padding: 10px 0;

    .name-container {
      display: flex;
      align-items: center;

      .avatar-container {
        padding-right: 10px;
        display: flex;
        align-items: center;

        img {
          $size: 30px;
          width: $size;
          height: $size;
        }
      }
    }

    .image-container {
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        $size: 40px;
        width: $size;
        height: $size;
      }
    }
  }
</style>
