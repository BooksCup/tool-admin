<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="listQuery.currencyName"
        style="width: 140px"
        class="filter-item"
        clearable
        @change="handleFilter"
        placeholder="请选择币种">
        <el-option v-for="item in this.currencyOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <!--      <el-date-picker-->
      <!--        v-model="listQuery.date"-->
      <!--        type="date"-->
      <!--        format="yyyy-MM-dd"-->
      <!--        value-format="yyyy-MM-dd"-->
      <!--        style="width: 170px;"-->
      <!--        class="filter-item"-->
      <!--        placeholder="请选择发布日期"-->
      <!--        @change="handleFilter"-->
      <!--      />-->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" min-width="10%" label="货币名称">
        <template slot-scope="scope">
          <span>{{ scope.row.currencyName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" min-width="15%" label="标题">
        <template slot-scope="scope">
          <div v-html="scope.row.title"></div>
        </template>
      </el-table-column>

      <el-table-column align="center" min-width="9%" label="当前价格">
        <template slot-scope="scope">
          <div v-html="scope.row.currentPriceHtml"></div>
        </template>
      </el-table-column>

      <el-table-column align="center" min-width="15%" label="波动">
        <template slot-scope="scope">
          <div v-html="scope.row.changeHtml"></div>
        </template>
      </el-table-column>

      <el-table-column align="center" min-width="9%" label="今开">
        <template slot-scope="scope">
          <div v-html="scope.row.todayPriceHtml"></div>
        </template>
      </el-table-column>

      <el-table-column align="center" min-width="9%" label="昨收">
        <template slot-scope="scope">
          <div v-html="scope.row.yesterdayPriceHtml"></div>
        </template>
      </el-table-column>

      <el-table-column align="center" min-width="9%" label="最高">
        <template slot-scope="scope">
          <div v-html="scope.row.highestPriceHtml"></div>
        </template>
      </el-table-column>

      <el-table-column align="center" min-width="9%" label="最低">
        <template slot-scope="scope">
          <div v-html="scope.row.lowestPriceHtml"></div>
        </template>
      </el-table-column>

      <el-table-column align="center" min-width="15%" label="创建时间">
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
  import { fetchHotExchangeCurrencyList, fetchHotExchangeList } from '@/api/crawler'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

  export default {
    name: 'ExchangeRate',
    components: { Pagination },
    directives: { waves },
    filters: {},
    data() {
      return {
        currencyOptions: null,
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          currencyName: ''
        }
      }
    },
    created() {
      this.getCurrencyList()
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        fetchHotExchangeList(this.listQuery).then(response => {
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
      getCurrencyList() {
        fetchHotExchangeCurrencyList().then(response => {
          this.currencyOptions = response.data
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
