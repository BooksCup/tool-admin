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
            v-model="temp.userNickName"
            style="width: 500px; margin-left: 10px;"
            disabled
          />
        </el-form-item>

        <el-form-item label-width="130px" label="手机号:" class="postInfo-container-item" prop="userPhone">
          <el-input
            v-model="temp.userPhone"
            style="width: 500px; margin-left: 10px;"
            disabled
          />
        </el-form-item>

        <el-form-item label-width="130px" label="消息类型:" class="postInfo-container-item">
          <el-select v-model="temp.msgType" style="width: 300px; margin-left: 10px;">
            <el-option v-for="item in msgTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
  import Sticky from '@/components/Sticky'
  import { checkGoods } from '@/api/data-monitor'

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
          goodsNo: '',
          goodsName: '',
          goodsPhoto: '',
          goodsPhotoList: [],
          goodsAttrList: [],
          checkInfoList: [],
          goodsAttr: '',
          checkInfo: '',
          userNickName: '',
          userPhone: '',
          msgType: []
        },
        loadingData: false
      }
    },
    computed: {},
    created() {
      const userNickName = this.$route.query && this.$route.query.userNickName
      const userPhone = this.$route.query && this.$route.query.userPhone
      this.temp.userNickName = userNickName
      this.temp.userPhone = userPhone
    },
    methods: {
      submitForm() {
        this.loadingData = true
        // return;
        this.$refs.postForm.validate(valid => {
          if (valid) {
            checkGoods(this.temp.goodsNo).then(response => {
              const code = response.status
              this.temp = response.data
              if (code === 200) {
                this.$notify({
                  message: '检测完成',
                  type: 'success',
                  duration: 2000
                })
              } else {
                this.$notify({
                  message: '检测失败',
                  type: 'error',
                  duration: 2000
                })
              }
              this.loadingData = false
            }).catch(e => {
              this.$notify({
                message: '检测失败',
                type: 'error',
                duration: 2000
              })
              this.temp = e.response.data
              this.loadingData = false
            })
          } else {
            this.loadingData = false
            return false
          }
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
