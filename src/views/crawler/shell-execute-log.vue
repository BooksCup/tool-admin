<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="listQuery.executeType"
        class="filter-item"
        placeholder="请选择执行类型"
        clearable
        @change="handleFilter">
        <el-option v-for="item in executeTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select
        v-model="listQuery.executeStatus"
        class="filter-item"
        placeholder="请选择状态"
        clearable
        @change="handleFilter">
        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-alert :closable="false" type="success" v-text="serviceName" />
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="执行类型" min-width="15%">
        <template slot-scope="scope">
          <span
            :style="scope.row.executeType | executeTypeClassFilter">{{ scope.row.executeType | executeTypeFilter }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态" min-width="15%">
        <template slot-scope="scope">
          <span :style="scope.row.executeStatus | statusClassFilter">{{ scope.row.executeStatus | statusFilter }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="执行机器系统" min-width="15%">
        <template slot-scope="scope">
          <span>{{ scope.row.osName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="执行机器IP" min-width="20%">
        <template slot-scope="scope">
          <span>{{ scope.row.ip }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="内容" min-width="20%">
        <template slot-scope="scope">
          <span>{{ scope.row.content }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="脚本执行时间" min-width="15%">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
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
  </div>
</template>

<script>
  import { fetchShellExecuteLogList } from '@/api/crawler'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

  // 脚本执行类型
  const executeTypeOptions = [
    { value: '0', label: '手动执行' },
    { value: '1', label: '定时任务' }
  ]

  // 脚本类型
  const serviceTypeOptions = [
    { value: '0', label: '全球纺织' },
    { value: '1', label: '实时汇率' },
    { value: '2', label: '远期汇率' },
    { value: '3', label: '热门汇率' }
  ]

  // 脚本状态
  const statusOptions = [
    { value: '0', label: '成功' },
    { value: '1', label: '失败' }
  ]

  const executeTypeKeyValue = executeTypeOptions.reduce((acc, cur) => {
    acc[cur.value] = cur.label
    return acc
  }, {})

  const serviceTypeKeyValue = serviceTypeOptions.reduce((acc, cur) => {
    acc[cur.value] = cur.label
    return acc
  }, {})

  const statusKeyValue = statusOptions.reduce((acc, cur) => {
    acc[cur.value] = cur.label
    return acc
  }, {})

  export default {
    name: 'ShellExecuteLog',
    components: { Pagination },
    directives: { waves },
    filters: {
      executeTypeFilter(type) {
        return executeTypeKeyValue[type]
      },
      serviceTypeFilter(type) {
        return serviceTypeKeyValue[type]
      },
      statusFilter(status) {
        return statusKeyValue[status]
      },
      executeTypeClassFilter(type) {
        const executeTypeClassKeyValue = {
          '0': 'color:black;',
          '1': 'color:orange;'
        }
        return executeTypeClassKeyValue[type]
      },
      statusClassFilter(status) {
        const statusClassMap = {
          '0': 'color:green;',
          '1': 'color:red;'
        }
        return statusClassMap[status]
      }
    },
    data() {
      return {
        executeTypeOptions,
        serviceTypeOptions,
        statusOptions,
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          serviceType: '',
          executeType: '',
          executeStatus: ''
        },
        serviceType: '',
        serviceName: ''
      }
    },
    created() {
      const serviceType = this.$route.params && this.$route.params.serviceType
      this.listQuery.serviceType = serviceType
      this.serviceType = serviceType
      this.serviceName = serviceTypeKeyValue[serviceType]
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        fetchShellExecuteLogList(this.listQuery).then(response => {
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
      }
    }
  }
</script>
<style>
  body .el-table th.gutter {
    display: table-cell !important;
  }
</style>
