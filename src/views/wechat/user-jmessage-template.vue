<template>
  <div class="createPost-container">
    <el-form ref="postForm" v-loading="loadingData" :model="temp" class="form-container">

      <sticky :z-index="10" :class-name="'sub-navbar ' + 'draft'">
        <el-button style="margin-left: 10px;" type="success" @click="submitForm">
          发送
        </el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-form-item label-width="130px" label="用户名:" class="postInfo-container-item" prop="userNickName">
          <el-input
            v-model="this.userNickName"
            style="width: 500px; margin-left: 10px;"
            disabled
          />
        </el-form-item>

        <el-form-item label-width="130px" label="手机号:" class="postInfo-container-item" prop="userPhone">
          <el-input
            v-model="this.userPhone"
            style="width: 500px; margin-left: 10px;"
            disabled
          />
        </el-form-item>

        <el-form-item label-width="130px" label="极光:" class="postInfo-container-item">
          <el-tag
            v-if="jimUserExist === true"
            type="success"
            style="margin-left: 10px;">
            存在
          </el-tag>
          <el-tag
            v-if="jimUserExist === false"
            type="danger"
            style="margin-left: 10px;">
            不存在
          </el-tag>

          <el-button
            v-show="jimUserExist===false"
            class="thirdparty-button"
            type="primary"
            @click="syncUserToJim"
            style="margin-left: 10px;">
            同步
          </el-button>
        </el-form-item>

        <el-form-item label-width="130px" label="消息类型:" class="postInfo-container-item">
          <el-select v-model="temp.msgType" style="width: 300px; margin-left: 10px;">
            <el-option v-for="item in msgTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item v-if="temp.msgType === 'text'" label-width="130px" label="文本:" class="postInfo-container-item">
          <el-input
            type="textarea"
            v-model="text"
            style="width: 500px; margin-left: 10px;"
          />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
  import Sticky from '@/components/Sticky'
  import { sendMessage } from '../../api/message'
  import { checkJimUserExist, syncUserToJim } from '../../api/user'

  const msgTypeOptions = [
    { value: 'text', label: '文本' },
    { value: 'image', label: '图片' },
    { value: 'location', label: '位置' }
  ]

  const msgTypeKeyValue = msgTypeOptions.reduce((acc, cur) => {
    acc[cur.value] = cur.label
    return acc
  }, {})

  export default {
    name: 'UserJmessageTemplate',
    components: { Sticky },
    props: {},
    filters: {
      msgTypeFilter(type) {
        return msgTypeKeyValue[type]
      }
    },
    data() {
      return {
        msgTypeOptions,
        temp: {
          msgType: '',
          targetId: '',
          targetType: 'single',
          fromId: '0000000000000',
          body: ''
        },
        textMsg: {
          extras: {},
          text: ''
        },
        userId: '',
        userPhone: '',
        userNickName: '',
        loadingData: false,
        jimUserExist: null,
        text: ''
      }
    },
    computed: {},
    created() {
      const userId = this.$route.params && this.$route.params.id
      const userNickName = this.$route.query && this.$route.query.userNickName
      const userPhone = this.$route.query && this.$route.query.userPhone
      this.userId = userId
      this.userNickName = userNickName
      this.userPhone = userPhone
      this.temp.targetId = userId
      this.checkJimUserExist(userId)
    },
    methods: {
      checkJimUserExist(userId) {
        checkJimUserExist(userId).then(response => {
          const code = response.status
          if (code === 200) {
            this.jimUserExist = true
          } else {
            this.jimUserExist = false
          }
        }).catch(e => {
          this.jimUserExist = false
        })
      },
      syncUserToJim() {
        this.loadingData = true
        syncUserToJim(this.userId).then(response => {
          this.loadingData = false
          const code = response.status
          if (code === 200) {
            this.$notify({
              message: '同步成功',
              type: 'success',
              duration: 2000
            })
            this.jimUserExist = true
          } else {
            this.$notify({
              message: '同步失败',
              type: 'error',
              duration: 2000
            })
            this.jimUserExist = false
          }
        }).catch(e => {
          this.loadingData = false
          this.$notify({
            message: '同步失败',
            type: 'error',
            duration: 2000
          })
          this.jimUserExist = false
        })
      },
      submitForm() {
        this.loadingData = true
        this.textMsg.text = this.text
        this.temp.body = this.textMsg
        sendMessage(this.temp).then(response => {
          this.loadingData = false
          const code = response.status
          if (code === 200) {
            this.$notify({
              message: '发送成功',
              type: 'success',
              duration: 2000
            })
          } else {
            this.$notify({
              message: '发送失败',
              type: 'error',
              duration: 2000
            })
          }
        }).catch(e => {
          this.loadingData = false
          this.$notify({
            message: '发送失败',
            type: 'error',
            duration: 2000
          })
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";

  .createPost-container {
    position: relative;

    .createPost-main-container {
      padding: 40px 45px 20px 50px;

      .postInfo-container {
        position: relative;
        @include clearfix;
        margin-bottom: 10px;

        .postInfo-container-item {
          float: left;
        }
      }
    }
  }
</style>
