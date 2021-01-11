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
          <div v-html="scope.row.isOpen"></div>
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="updateFormVisible">
      <el-form
        ref="dataForm"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="token" prop="path">
          <el-input v-model="temp.token" placeholder="请输入token" />
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
  import { fetchThirdPartyDicList } from '@/api/system-config'
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
        dialogStatus: '',
        textMap: {
          update: '参数修改'
        },
        temp: {
          key: '',
          token: ''
        },
        updateFormVisible: false,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          currencyName: ''
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
        this.temp = {
          id: row.id,
          token: configValue.token
        }
      },
      handleUpdate(row) {
        this.initTemp(row)
        this.dialogStatus = 'update'
        this.updateFormVisible = true
      }
    }
  }
</script>
<style>
  body .el-table th.gutter {
    display: table-cell !important;
  }
</style>
