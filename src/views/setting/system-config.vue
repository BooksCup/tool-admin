<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.keyword"
        placeholder="请输入关键字"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" min-width="10%" label="图标">
        <template slot-scope="scope">
          <img :src="scope.row.logo" width="70" height="70">
        </template>
      </el-table-column>

      <el-table-column align="center" min-width="15%" label="名称">
        <template slot-scope="scope">
          <div v-html="scope.row.name"></div>
        </template>
      </el-table-column>

      <el-table-column align="center" min-width="9%" label="开启状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isOpen"
            active-color="#13ce66"
            inactive-color="#999"
            active-value="1"
            inactive-value="0"
            @change="handleOpenOrClose(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>

      <el-table-column align="center" min-width="15%" label="操作">
        <template slot-scope="{row, $index}">
          <el-button
            size="small"
            type="warning"
            icon="el-icon-edit"
            title="编辑脚本"
            @click="handleUpdate(row, $index)" />
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog title="天眼查参数修改" :visible.sync="tianyanchaFormVisible">
      <el-form
        ref="dataForm"
        :model="temp"
        label-position="left"
        label-width="90px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="token" prop="token">
          <el-input v-model="temp.token" placeholder="请输入token" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="tianyanchaFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateThirdPartyConfig">
          保存
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="快递100参数修改" :visible.sync="kuaidi100FormVisible">
      <el-form
        ref="dataForm"
        :model="temp"
        label-position="left"
        label-width="90px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="customer" prop="customer">
          <el-input v-model="temp.customer" placeholder="请输入customer" />
        </el-form-item>

        <el-form-item label="key" prop="key">
          <el-input v-model="temp.key" placeholder="请输入key" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="kuaidi100FormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateThirdPartyConfig">
          保存
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="飞鹅打印机参数修改" :visible.sync="feieFormVisible">
      <el-form
        ref="dataForm"
        :model="temp"
        label-position="left"
        label-width="90px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="user" prop="user">
          <el-input v-model="temp.user" placeholder="请输入user" />
        </el-form-item>

        <el-form-item label="key" prop="key">
          <el-input v-model="temp.key" placeholder="请输入key" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="feieFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateThirdPartyConfig">
          保存
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="阿里云OSS参数修改" :visible.sync="ossFormVisible">
      <el-form
        ref="dataForm"
        :model="temp"
        label-position="left"
        label-width="130px"
        style="width: 580px; margin-left:50px;"
      >
        <el-form-item label="endpoint" prop="endpoint">
          <el-input v-model="temp.endpoint" placeholder="请输入endpoint" />
        </el-form-item>

        <el-form-item label="domain" prop="domain">
          <el-input v-model="temp.domain" placeholder="请输入domain" />
        </el-form-item>

        <el-form-item label="accessKeyId" prop="accessKeyId">
          <el-input v-model="temp.accessKeyId" placeholder="请输入accessKeyId" />
        </el-form-item>

        <el-form-item label="accessKeySecret" prop="accessKeySecret">
          <el-input v-model="temp.accessKeySecret" placeholder="请输入accessKeySecret" />
        </el-form-item>

        <el-form-item label="bucketName" prop="bucketName">
          <el-input v-model="temp.bucketName" placeholder="请输入bucketName" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="ossFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateThirdPartyConfig">
          保存
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { fetchThirdPartyDicList, updateThirdPartyConfig, updateThirdPartyConfigOpenStatus } from '@/api/system-config'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

  export default {
    name: 'SystemConfig',
    components: { Pagination },
    directives: { waves },
    filters: {},
    data() {
      return {
        currencyOptions: null,
        tableKey: 0,
        list: null,
        total: 0,
        dialogStatus: '',
        temp: {},
        tianyanchaFormVisible: false,
        kuaidi100FormVisible: false,
        feieFormVisible: false,
        ossFormVisible: false,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          keyword: ''
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        fetchThirdPartyDicList(this.listQuery).then(response => {
          const res = response.data
          this.list = res.list
          this.total = res.total
          this.listLoading = false
        }).catch(err => {
          console.error(err)
          this.listLoading = false
          this.$notify({
            message: '列表加载失败!',
            type: 'error',
            duration: 2000
          })
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      initTemp(row) {
        const configValue = JSON.parse(row.configValue)
        const configKey = row.key
        if (configKey === 'TIANYANCHA') {
          this.tianyanchaFormVisible = true
          this.temp = {
            configId: row.configId,
            token: configValue.token
          }
        } else if (configKey === 'KUAIDI100') {
          this.kuaidi100FormVisible = true
          this.temp = {
            configId: row.configId,
            key: configValue.key,
            customer: configValue.customer
          }
        } else if (configKey === 'FEIE') {
          this.feieFormVisible = true
          this.temp = {
            configId: row.configId,
            key: configValue.key,
            user: configValue.user
          }
        } else if (configKey === 'OSS') {
          this.ossFormVisible = true
          this.temp = {
            configId: row.configId,
            endpoint: configValue.endpoint,
            domain: configValue.domain,
            accessKeyId: configValue.accessKeyId,
            accessKeySecret: configValue.accessKeySecret,
            bucketName: configValue.bucketName
          }
        }
      },
      colseAllForm() {
        this.tianyanchaFormVisible = false
        this.kuaidi100FormVisible = false
        this.feieFormVisible = false
        this.ossFormVisible = false
      },
      handleOpenOrClose(row) {
        updateThirdPartyConfigOpenStatus(row).then(response => {
        })
      },
      handleUpdate(row) {
        this.initTemp(row)
        this.dialogStatus = 'update'
      },
      updateThirdPartyConfig() {
        updateThirdPartyConfig(this.temp).then(response => {
          this.colseAllForm()
          const code = response.status
          if (code === 200) {
            this.$notify({
              message: '参数修改成功',
              type: 'success',
              duration: 2000
            })
          } else {
            this.$notify({
              message: '参数修改失败',
              type: 'error',
              duration: 2000
            })
          }
        })
      }
    }
  }
</script>
<style>
  body .el-table th.gutter {
    display: table-cell !important;
  }
</style>
