<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-document-add"
        @click="handleCreate"
      >
        添加
      </el-button>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="爬虫类型" min-width="20%">
        <template slot-scope="scope">
          <span>{{ scope.row.serviceType | serviceTypeFilter }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="脚本路径" min-width="30%">
        <template slot-scope="scope">
          <span>{{ scope.row.path }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" min-width="30%">
        <template slot-scope="{row, $index}">
          <el-button
            size="small"
            type="primary"
            icon="el-icon-video-play"
            title="执行脚本"
            @click="handleExecute(row, $index)" />
          <el-button
            size="small"
            type="warning"
            icon="el-icon-edit"
            title="编辑脚本"
            @click="handleUpdate(row, $index)" />
          <el-button
            size="small"
            type="danger"
            icon="el-icon-delete"
            title="删除脚本"
            @click="handleDelete(row, $index)" />
        </template>
      </el-table-column>

      <el-table-column align="center" label="执行日志" min-width="20%">
        <template slot-scope="{row}">
          <router-link
            :to="{path: '/crawler/shell-execute-log/' + row.serviceType}">
            <el-button type="info" size="small" title="执行日志" icon="el-icon-document" />
          </router-link>
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="createFormVisible">
      <el-form
        ref="dataForm"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="脚本类型" prop="serviceType">
          <el-select v-model="temp.serviceType" class="filter-item" placeholder="请选择脚本类型">
            <el-option v-for="item in serviceTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="脚本路径" prop="path">
          <el-input v-model="temp.path" placeholder="请输入脚本路径" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="createCrawlerShell">
          保存
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="updateFormVisible">
      <el-form
        ref="dataForm"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="脚本类型" prop="serviceType">
          <el-select v-model="temp.serviceType" class="filter-item" placeholder="请选择脚本类型" disabled>
            <el-option v-for="item in serviceTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="脚本路径" prop="path">
          <el-input v-model="temp.path" placeholder="请输入脚本路径" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateCrawlerShell">
          保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    fetchCrawlerShellList,
    createCrawlerShell,
    updateCrawlerShell,
    deleteCrawlerShell,
    executeCrawlerShell
  } from '@/api/crawler'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

  // 业务类型
  const serviceTypeOptions = [
    { value: '0', label: '全球纺织' },
    { value: '1', label: '实时汇率' },
    { value: '2', label: '远期汇率' },
    { value: '3', label: '热门汇率' }
  ]

  const serviceTypeKeyValue = serviceTypeOptions.reduce((acc, cur) => {
    acc[cur.value] = cur.label
    return acc
  }, {})

  export default {
    name: 'CrawlerShell',
    components: { Pagination },
    directives: { waves },
    filters: {
      serviceTypeFilter(type) {
        return serviceTypeKeyValue[type]
      }
    },
    data() {
      return {
        serviceTypeOptions,
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        createFormVisible: false,
        updateFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑爬虫脚本',
          create: '添加爬虫脚本'
        },
        temp: {
          id: '',
          serviceType: '',
          path: ''
        },
        listQuery: {
          page: 1,
          limit: 10
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        fetchCrawlerShellList(this.listQuery).then(response => {
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
      resetTemp() {
        this.temp = {
          id: '',
          serviceType: '',
          path: ''
        }
      },
      initTemp(row) {
        this.temp = {
          id: row.id,
          serviceType: row.serviceType,
          path: row.path
        }
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.createFormVisible = true
      },
      handleUpdate(row) {
        this.initTemp(row)
        this.dialogStatus = 'update'
        this.updateFormVisible = true
      },
      handleDelete(row, index) {
        this.$confirm('删除操作无法恢复，请谨慎删除。', '是否删除?', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'error'
        })
          .then(async() => {
            deleteCrawlerShell(row.id).then(response => {
              const code = response.status
              if (code === 200) {
                this.$notify({
                  message: '删除成功!',
                  type: 'success',
                  duration: 2000
                })
                this.list.splice(index, 1)
              } else {
                this.$notify({
                  message: '删除失败',
                  type: 'error',
                  duration: 2000
                })
              }
              console.log(response)
            })
          })
          .catch(err => {
            console.error(err)
          })
      },
      handleExecute(row) {
        this.listLoading = true
        executeCrawlerShell(row).then(response => {
          this.listLoading = false
          this.$notify({
            message: '脚本执行成功',
            type: 'success',
            duration: 2000
          })
        }).catch(err => {
          this.listLoading = false
          const responseCode = err.response.headers.responsecode
          console.log(responseCode)
          if (responseCode === 'CRAWLER_SHELL_NOT_EXISTS') {
            this.$notify({
              message: '脚本不存在',
              type: 'error',
              duration: 2000
            })
          } else {
            this.$notify({
              message: '脚本执行失败',
              type: 'error',
              duration: 2000
            })
          }
        })
      },
      createCrawlerShell() {
        createCrawlerShell(this.temp).then(response => {
          this.createFormVisible = false
          const code = response.status
          if (code === 200) {
            this.list.unshift(response.data)
            this.$notify({
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          } else {
            this.$notify({
              message: '创建失败',
              type: 'error',
              duration: 2000
            })
          }
        }).catch(err => {
          console.log(err.response.headers)
          const responseCode = err.response.headers.responsecode
          console.log(responseCode)
          if (responseCode === 'CRAWLER_SHELL_EXISTS') {
            this.$notify({
              message: '爬虫类型已经存在',
              type: 'error',
              duration: 2000
            })
          } else {
            this.$notify({
              message: '创建失败',
              type: 'error',
              duration: 2000
            })
          }
        })
      },
      updateCrawlerShell() {
        updateCrawlerShell(this.temp).then(response => {
          this.updateFormVisible = false
          const code = response.status
          if (code === 200) {
            this.$notify({
              message: '编辑成功',
              type: 'success',
              duration: 2000
            })
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
          } else {
            this.$notify({
              message: '编辑失败',
              type: 'error',
              duration: 2000
            })
          }
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      }
    }
  }
</script>
<style>
  body .el-table th.gutter {
    display: table-cell !important;
  }
</style>
