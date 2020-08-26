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
      <el-select v-model="listQuery.type" style="width: 140px" class="filter-item" clearable @change="handleFilter">
        <el-option v-for="item in this.weaveTypeOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-date-picker
        v-model="listQuery.date"
        type="date"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        style="width: 170px;"
        class="filter-item"
        placeholder="请选择发布日期"
        @change="handleFilter"
      />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" width="270px" label="币种">
        <template slot-scope="scope">
          <span>{{ scope.row.currencyName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="120px" label="现汇买入价">
        <template slot-scope="scope">
          <span>{{ scope.row.currencyBuy }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="120px" label="现汇卖出价">
        <template slot-scope="scope">
          <span>{{ scope.row.currencySell }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="120px" label="现钞买入价">
        <template slot-scope="scope">
          <span>{{ scope.row.cashBuy }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="120px" label="现钞卖出价">
        <template slot-scope="scope">
          <span>{{ scope.row.cashSell }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="120px" label="中行折算价">
        <template slot-scope="scope">
          <span>{{ scope.row.middle }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="240px" label="发布时间">
        <template slot-scope="scope">
          <span>{{ scope.row.publishDate }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="240px" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" min-width="100px" label="操作">
        <template slot-scope="{row}">
          <router-link
            :to="{path: '/wechat/user-jmessage-template/' + row.userId, query:{userNickName: row.userNickName, userPhone: row.userPhone}}">
            <el-button type="warning" size="small" icon="el-icon-message" />
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
  </div>
</template>

<script>
  import { fetchWeaveTypeList, fetchExchangeRateList } from '@/api/crawler'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

  export default {
    name: 'ExchangeRate',
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
      getList() {
        this.listLoading = true
        fetchExchangeRateList(this.listQuery).then(response => {
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