<template>
  <div class="page-container">
    <div class="filter-container">
      <el-button size="mini" class="return-button" @click="onReturnClick">返回主页</el-button>
      <!-- <el-tag type="success">{{params.title}}</el-tag> -->
      <!-- <el-tag type="success">{{params.city}}</el-tag> -->
    </div>
    <div class="tooltip-container" v-if="total > 0">
      <el-button class="pause-button" @click="onPauseClick">{{'停止加载'}}</el-button>
      <span class="total-text">共{{total}}条结果</span <span class="current-text">正在加载第{{currentPage}}页（共{{pages}}页）</span>
      <el-progress :percentage="currentPercent" :show-text="false" class="current-percent"></el-progress>
      <!-- <div class="total-percent"> -->
      <el-progress type="circle" :width="40" :percentage="totalPercent" class="total-percent"></el-progress>
      <!-- </div> -->
    </div>
    <div class="table-container">
      <el-table-wrapper ref="table" border stripe :data="tableData" :columns="tableColumns"
        :pagination="tablePagination" :show-custom-header="false">
        <template slot-scope="scope" slot="name-slot">
          <div class="name-container">
            <div class="avatar-container">
              <img :src="scope.row.author.imageUrl" class="avatar"></img>
            </div>
            <span>{{scope.row.author.name}}</span>
          </div>
        </template>
        <template slot-scope="scope" slot="url-slot">
          <el-button type="text" @click="onUrlClick(scope.row.author.url)">主页</el-button>
        </template>
        <template slot-scope="scope" slot="title-slot">
          <div class="title-container" @click="onUrlClick(scope.row.url)">
            {{scope.row.title}}
          </div>
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
  // import _ from 'lodash'

  import router from 'router'
  import { INIT_USRE_INFO_FROM_STORAGE } from 'store/mutation-types'
  import { State } from 'store/declarations'
  import {
    fetchGetGroupMembers,
    fetchGetUserInfo,
    fetchGetUserLifeStream,
    fetchGetUserLifeStreamTimeSlices,
    fetchGetGroupTopics
  } from 'api'
  import { SPIDER_USER_AGENT } from 'config'

  Vue.use(ElTableWrapper)

  interface UserLocation {
    id: string
    name: string
    uid: string
  }

  interface User {
    id?: string
    name?: string
    url?: string
    imageUrl?: string
    city?: string
    gender?: string
    location?: UserLocation
    introduction?: string
    followingCount?: number
    followersCount?: number
    joinedGroupCount?: number
    registerTime?: string
    registerTimeShow?: string
    latestStreamTime?: Date
    latestStreamTimeShow?: string
  }

  interface GroupTopicOriginal {
    id: string
    title: string
    create_time: string
    update_time: string
    url: string
    cover_url: string
    comments_count: number
    author: {
      avatar: string
      gender: string
      id: string
      name: string
      reg_time: string
      url: string
    }
  }

  interface GroupTopic {
    id: string
    title: string
    createTime: string
    updateTime?: string
    url: string
    coverUrl?: string
    commentsCount: number
    author?: User
  }

  export default Vue.extend({
    data() {
      const tableData: GroupTopic[] = []
      return {
        tableData: tableData,
        tableColumns: [
          {
            prop: 'title',
            label: '标题',
            // width: 200,
            minWidth: 150,
            searchable: true,
            scopedSlot: 'title-slot'
          },
          {
            prop: 'createTime',
            label: '发表时间',
            width: 150,
            searchable: true
          },
          {
            prop: 'updateTime',
            label: '更新时间',
            width: 150,
            searchable: true
          },
          {
            prop: 'commentsCount',
            label: '回复数',
            width: 50
          },
          {
            // prop: 'author.name',
            label: '用户昵称',
            scopedSlot: 'name-slot',
            searchable: true,
            width: 150,
            showOverflowTooltip: true
          },
          {
            prop: 'author.introduction',
            label: '用户简介',
            minWidth: 200,
            // showOverflowTooltip: true,
            searchable: true
          },
          {
            prop: 'author.gender',
            label: '性别',
            width: 50,
            searchable: true
          },
          {
            prop: 'author.location.name',
            label: '城市',
            width: 80,
            searchable: true
          },
          {
            prop: 'author.followingCount',
            label: '关注',
            width: 50,
            sortable: true
          },
          {
            prop: 'author.followersCount',
            label: '关注者',
            width: 50,
            sortable: true
          },
          {
            prop: 'author.joinedGroupCount',
            label: '加入小组',
            width: 50,
            sortable: true
          },
          {
            prop: 'author.latestStreamTimeShow',
            label: '最近活跃时间',
            width: 100,
            sortable: true
          },
          {
            prop: 'author.registerTimeShow',
            label: '注册时间',
            width: 100,
            sortable: true
          },
          {
            prop: 'author.url',
            label: '用户主页',
            width: 70,
            scopedSlot: 'url-slot'
          }
        ],
        tablePagination: {
          pageSize: 20,
          pageSizes: [10, 20, 50, 100],
          layout: 'total, sizes, prev, pager, next'
        },
        total: 600,
        pageSize: 30,
        currentPage: 0,
        current: {
          total: 30,
          current: 0
        },
        userList: [],
        isPaused: false
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

      const url = this.params.title
      if (!url) {
        return
      }
      const groupId = await this.getGroupIdByUrl(url)

      console.log('GroupPostResult, mounted, groupId:', groupId)

      if (groupId) {
        let offset = 0
        for (let j = 0; j < 20; ++j) {
          if (this.isPaused) {
            return
          }
          this.currentPage = j + 1
          const groupTopics = await this.getGroupTopics(groupId, offset)

          offset += 30

          if (groupTopics && groupTopics.length > 0) {
            for (let i = 0; i < groupTopics.length; ++i) {
              if (this.isPaused) {
                return
              }
              const topic = groupTopics[i]
              let user = Object.assign({}, topic.author)

              const userReturn = await this.getUserDetail(user)
              topic.author = userReturn || {}
              this.tableData.push(topic)
              this.current.current = i
            }
          }
        }
      }

      // const pages = Math.floor((this.total - 1) / this.pageSize + 1)
      // const pages = 1
      // let start = 0
      // for (let i = 0; i < pages;) {
      //   this.currentPage = i + 1
      //   const currentUrl = url + `&start=${start}`

      //   const userList = await this.getGroupUsersFilterByCity(currentUrl)
      //   this.addUserIdOfUserList(userList)

      //   await this.getUserDetailOfUserList(userList)
      //   start += userList.length
      //   ++i
      // }
    },
    methods: {
      onReturnClick() {
        router.push('/')
      },
      onUrlClick(url: string) {
        shell.openExternal(url)
      },
      onPauseClick() {
        // this.isPaused = !this.isPaused
        this.isPaused = true
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
      getGroupIdByUrl(url: string) {
        return new Promise<string>((resolve, reject) => {
          request
            .get(url)
            .set('User-Agent', SPIDER_USER_AGENT)
            .end((err: any, res: any) => {
              if (err) {
                reject()
                return
              }

              const $ = cheerio.load(res.text)
              const id = $('.rec-sec .rec a').attr('data-object_id')
              if (id) {
                resolve(id)
              }
            })
        })
      },
      async getGroupTopics(groupId: string, start: number) {
        const accessToken = this.user.accessToken
        const data: any = await fetchGetGroupTopics({
          accessToken,
          groupId,
          start
        })

        const topicOriginalList: GroupTopicOriginal[] = data.topics

        if (topicOriginalList) {
          const topicList: GroupTopic[] = topicOriginalList.map(topicOriginal => {
            const authorOriginal = topicOriginal.author
            const author: User = {
              id: authorOriginal.id,
              name: authorOriginal.name,
              imageUrl: authorOriginal.avatar,
              gender: authorOriginal.gender,
              url: authorOriginal.url
            }
            const topic: GroupTopic = {
              id: topicOriginal.id,
              title: topicOriginal.title,
              url: topicOriginal.url,
              coverUrl: topicOriginal.cover_url,
              commentsCount: topicOriginal.comments_count,
              createTime: topicOriginal.create_time,
              updateTime: topicOriginal.update_time,
              author: author
            }
            return topic
          })
          return topicList
        }
        return []
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
            id: data.loc ? data.loc.id : '',
            name: data.loc ? data.loc.name : '',
            uid: data.loc ? data.loc.uid : ''
          }
          user.introduction = data.intro.substring(0, 100)
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
            // that.tableData.push(user)
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

  .table-container {
    .el-table {
      font-size: 12px;
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

    .return-button {
      margin-right: 20px;
    }
  }

  .tooltip-container {
    padding: 20px 0 10px 0;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .pause-button {
      margin-right: 30px;
    }

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

    .title-container {
      color: #409eff;
      cursor: pointer;
    }
  }
</style>
