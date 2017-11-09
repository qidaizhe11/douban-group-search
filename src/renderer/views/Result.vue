<template>
  <div class="page-container">
    <div class="filter-container">
      <el-button size="mini" @click="onReturnClick">返回主页</el-button>
      <el-tag type="success">{{params.title}}</el-tag>
      <!-- <el-tag type="success">{{params.sex}}</el-tag> -->
      <el-tag type="success">{{params.city}}</el-tag>
    </div>
    <div class="tooltip-container" v-if="total > 0">
      <span class="total-text">共{{total}}条结果</span>
      <span class="current-text">正在加载第{{currentPage}}页（共{{pages}}页）</span>
      <el-progress :percentage="currentPercent" :show-text="false" class="current-percent"></el-progress>
      <!-- <div class="total-percent"> -->
      <el-progress type="circle" :width="40" :percentage="totalPercent" class="total-percent"></el-progress>
      <!-- </div> -->
    </div>
    <div class="table-container">
      <el-table-wrapper ref="table" border stripe :data="tableData" :columns="tableColumns"
        :pagination="tablePagination" :show-custom-header="true">
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

<script lang="ts">
  import { shell } from 'electron'
  import Vue from 'vue'
  import { mapState } from 'vuex'
  import request from 'superagent'
  import cheerio from 'cheerio'
  import ElTableWrapper from 'element-table-wrapper'
  import _ from 'lodash'

  import router from 'router'
  import { INIT_USRE_INFO_FROM_STORAGE } from 'store/mutation-types'
  import { State } from 'store/declarations'
  import {
    fetchGetGroupMembers,
    fetchGetUserInfo,
    fetchGetUserLifeStream,
    fetchGetUserLifeStreamTimeSlices
  } from 'api'
  import { SPIDER_USER_AGENT } from 'config'

  Vue.use(ElTableWrapper)

  interface UserLocation {
    id: string,
    name: string,
    uid: string
  }

  interface User {
    id?: string,
    name?: string,
    url?: string,
    imageUrl?: string,
    city?: string,
    gender?: string,
    location?: UserLocation,
    introduction?: string,
    followingCount?: number,
    followersCount?: number,
    joinedGroupCount?: number,
    registerTime?: string,
    registerTimeShow?: string,
    latestStreamTime?: Date,
    latestStreamTimeShow?: string
  }

  export default Vue.extend({
    data() {
      const tableData: User[] = []
      return {
        tableData: tableData,
        tableColumns: [
          {
            prop: 'name',
            label: '昵称',
            scopedSlot: 'name-slot',
            searchable: true,
            width: 180,
            showOverflowTooltip: true
          },
          {
            prop: 'introduction',
            label: '简介',
            searchable: true
          },
          {
            prop: 'gender',
            label: '性别',
            width: 80,
            searchable: true
          },
          {
            prop: 'city',
            label: '城市',
            width: 100,
            searchable: true
          },
          {
            prop: 'followingCount',
            label: '关注',
            width: 100,
            sortable: true
          },
          {
            prop: 'followersCount',
            label: '关注者',
            width: 120,
            sortable: true
          },
          {
            prop: 'joinedGroupCount',
            label: '加入小组',
            width: 120,
            sortable: true
          },
          {
            prop: 'latestStreamTimeShow',
            label: '最近活跃时间',
            width: 180,
            sortable: true
          },
          {
            prop: 'registerTimeShow',
            label: '注册时间',
            width: 180,
            sortable: true
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
        },
        total: 0,
        pageSize: 0,
        currentPage: 0,
        current: {
          total: 0,
          current: 0
        },
        userList: []
      }
    },
    computed: {
      ...mapState({
        user: (state: State) => state.user,
        params: (state: State) => state.search.params
      }),
      pages(): number {
        return Math.floor((this.total - 1) / this.pageSize + 1)
      },
      totalPercent(): number {
        if (!(this.total > 0)) {
          return 0
        }
        return Math.round(this.tableData.length / this.total * 100)
      },
      currentPercent(): number {
        if (!this.current.current) {
          return 0
        }
        return Math.round(this.current.current / this.current.total * 100)
      }
    },
    async mounted() {
      const that = this
      await this.$store.dispatch(INIT_USRE_INFO_FROM_STORAGE)

      if (!that.user.isLogined) {
        router.push('/login')
        return
      }

      const url =
        _.trimEnd(this.params.title, '/') +
        '/member_search?search_text=' +
        encodeURIComponent(this.params.city)
      if (!url) {
        return
      }
      await this.getGroupUsersTotal(url)

      // const pages = Math.floor((this.total - 1) / this.pageSize + 1)
      const pages = 1
      let start = 0
      for (let i = 0; i < pages;) {
        this.currentPage = i + 1
        const currentUrl = url + `&start=${start}`

        const userList = await this.getGroupUsersFilterByCity(currentUrl)
        this.addUserIdOfUserList(userList)

        await this.getUserDetailOfUserList(userList)
        start += userList.length
        ++i
      }
    },
    methods: {
      onReturnClick() {
        router.push('/')
      },
      onUserUrlClick(url: string) {
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
      getGroupUsersTotal(url: string) {
        return new Promise((resolve, reject) => {
          request
            .get(url)
            .set('User-Agent', SPIDER_USER_AGENT)
            .end((err: any, res: any) => {
              if (err) {
                reject()
                return
              }

              const $ = cheerio.load(res.text)
              const totalContents = $('#content .article .wrap h3').contents()
              console.log('totalContents:', totalContents, typeof totalContents)
              totalContents.map((i: number, node: any) => {
                if (node.type === 'text' && /共\d+人/.test(node.data)) {
                  const totalMatch = node.data.match(/共(\d+)人/)
                  if (totalMatch.length > 1) {
                    this.total = totalMatch[1]
                  }
                }
              })

              const memberList = $('.member-list li')
              if (memberList && memberList.length > 0) {
                this.pageSize = memberList.length
              }
              resolve()
            })
        })
      },
      getGroupUsersFilterByCity(url: string) {
        return new Promise<Array<User>>((resolve, reject) => {
          request
            .get(url)
            .set('User-Agent', SPIDER_USER_AGENT)
            .end((err: any, res: any) => {
              if (err) {
                console.log('Result, request error:', err)
              }
              console.log('Result, request success, res:', res)
              const $ = cheerio.load(res.text)
              const $memberList = $('.member-list li')
              const userList: User[] = []
              $memberList.each((i: number, value: any) => {
                const member = $(value)
                const user: User = {}
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
      addUserIdOfUserList(userList: Array<User>) {
        if (!userList) {
          return
        }

        userList.map((user: User, i: number) => {
          let userIdMatch: RegExpMatchArray | null = null
          if (user.imageUrl) {
            userIdMatch = user.imageUrl.match(/icon\/u(\d+)(?:-\d+.)?/)
          }
          if (!userIdMatch) {
            if (user.url) {
              userIdMatch = user.url.match(/people\/(\d+)/)
            }
            if (!userIdMatch) {
              return
            }
          }
          if (userIdMatch.length > 1) {
            user.id = userIdMatch[1]
          }
        })

        console.log('Result, here, userList:', userList)
        return userList
      },
      async getUserDetailOfUserList(userList: Array<User>) {
        if (!userList) {
          return
        }

        this.current = {
          total: userList.length,
          current: 0
        }

        let i = 0
        while (i < userList.length) {
          const user = userList[i]
          await this.getUserDetail(user)
          ++i
        }
      },
      async getUserDetail(user: User) {
        const that = this
        const accessToken = this.user.accessToken

        if (!user || !user.id) {
          return null
        }

        let data: any = await fetchGetUserInfo({
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
          user.introduction = data.intro.substring(0, 200)
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
            if (data && data.items && data.items.length > 0) {
              const date = new Date(data.items[0].time)
              user.latestStreamTime = date
              user.latestStreamTimeShow = date.toISOString().slice(0, 10)
            }

            that.current.current = that.current.current + 1
            that.tableData.push(user)
            return user
          }
        }
        return null
      }
    }
  })
</script>

<style lang="scss">
  .el-progress.current-percent {
    .el-progress-bar__inner {
      background-color: #20a0ff;
    }
  }
</style>

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

  .tooltip-container {
    padding: 20px 0 10px 0;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .total-text {
      padding-right: 30px;
    }
    .current-text {
      padding-right: 5px;
    }
    .current-percent {
      width: 300px;
      margin-right: 30px;
    }
    .total-percent {
      $size: 40px;
      width: $size;
      height: $size;
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
