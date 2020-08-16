<template>
  <div class="app-container">
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
  </div>
</template>

<script>
  import { fetchCrawlerShellList, executeCrawlerShell } from '@/api/crawler'
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
        weaveTypeOptions: null,
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
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
      extractNumbers(input) {
        return input.replace('%', '')
      },
      getList() {
        this.listLoading = true
        fetchCrawlerShellList(this.listQuery).then(response => {
          const res = response.data
          this.list = res.list
          this.total = res.total
          this.listLoading = false
        })
      },
      handleExecute(row) {
        this.listLoading = true
        executeCrawlerShell(row).then(response => {
          this.listLoading = false
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      }
    }
  }
</script>
