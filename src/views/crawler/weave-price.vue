<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="请输入名称"
        style="width: 170px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.type"
        style="width: 140px"
        class="filter-item"
        placeholder="请选择类型"
        clearable
        @change="handleFilter">
        <el-option v-for="item in this.weaveTypeOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-date-picker
        v-model="listQuery.date"
        type="date"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        style="width: 170px;"
        class="filter-item"
        placeholder="请选择报价日期"
        @change="handleFilter"
      />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="名称" min-width="14%">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="类型" min-width="14%">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="价格" min-width="14%">
        <template slot-scope="scope">
          <span>{{ scope.row.lastTrade }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="单位" min-width="14%">
        <template slot-scope="scope">
          <span>{{ scope.row.unit }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="涨跌" class-name="status-col" min-width="14%">
        <template slot-scope="{row}">
          <span v-if="extractNumbers(row.change) > 0" style="color:red;">{{ row.change }}</span>
          <span v-else-if="extractNumbers(row.change) < 0" style="color:green;">{{ row.change }}</span>
          <span v-else>{{ row.change }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="报价日期" min-width="14%">
        <template slot-scope="scope">
          <span>{{ scope.row.date }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建时间" min-width="16%">
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
  import { fetchWeaveTypeList, fetchWeavePriceList } from '@/api/crawler'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

  export default {
    name: 'WeavePrice',
    components: { Pagination },
    directives: { waves },
    filters: {},
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
      this.getWeaveTypeList()
      this.getList()
    },
    methods: {
      extractNumbers(input) {
        return input.replace('%', '')
      },
      getList() {
        this.listLoading = true
        fetchWeavePriceList(this.listQuery).then(response => {
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
      getWeaveTypeList() {
        fetchWeaveTypeList().then(response => {
          this.weaveTypeOptions = response.data
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
