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
      <el-table-column align="center" width="300px" label="爬虫类型">
        <template slot-scope="scope">
          <span>{{ scope.row.serviceType | serviceTypeFilter }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="600px" label="脚本路径">
        <template slot-scope="scope">
          <span>{{ scope.row.path }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" min-width="100px" label="操作">
        <template slot-scope="{row, $index}">
          <el-button size="small" type="primary" icon="el-icon-refresh-left" @click="handleExecute(row, $index)" />
          <el-button size="small" type="danger" icon="el-icon-delete" @click="handleDelete(row, $index)" />
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
  </div>
</template>

<script>
  import { fetchCrawlerShellList, createCrawlerShell, executeCrawlerShell } from '@/api/crawler'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

  // 业务类型
  const serviceTypeOptions = [
    { value: '0', label: '全球纺织网' }
  ]

  const serviceTypeKeyValue = serviceTypeOptions.reduce((acc, cur) => {
    acc[cur.value] = cur.label
    return acc
  }, {})

  export default {
    name: 'WeavePrice',
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
        })
      },
      resetTemp() {
        this.temp = {
          id: '',
          serviceType: '',
          path: ''
        }
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.createFormVisible = true
      },
      handleExecute(row) {
        this.listLoading = true
        executeCrawlerShell(row).then(response => {
          this.listLoading = false
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
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      }
    }
  }
</script>
