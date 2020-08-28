<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.userNickName"
        placeholder="请输入用户名"
        style="width: 170px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.userPhone"
        placeholder="请输入手机号"
        style="width: 170px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.userWxId"
        placeholder="请输入微信号"
        style="width: 170px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="用户名称" min-width="12%">
        <template slot-scope="scope">
          <span>{{ scope.row.userNickName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="手机号" min-width="12%">
        <template slot-scope="scope">
          <span>{{ scope.row.userPhone }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="微信号" min-width="12%">
        <template slot-scope="scope">
          <span>{{ scope.row.userWxId }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="邮箱" min-width="12%">
        <template slot-scope="scope">
          <span>{{ scope.row.userEmail }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="性别" class-name="status-col" min-width="12%">
        <template slot-scope="{row}">
          <span :style="row.userSex | sexClassFilter">{{ row.userSex | sexFilter }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="最后一次登录时间" min-width="12%">
        <template slot-scope="scope">
          <span>{{ scope.row.userLastLoginTime }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建时间" min-width="12%">
        <template slot-scope="scope">
          <span>{{ scope.row.userCreateTime }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" min-width="16%">
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
  import { fetchUserList } from '@/api/user'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

  export default {
    name: 'User',
    components: { Pagination },
    directives: { waves },
    filters: {
      sexFilter(sex) {
        const sexMap = {
          1: '男',
          2: '女'
        }
        return sexMap[sex]
      },
      sexClassFilter(sex) {
        const sexClassMap = {
          '0': 'color:black;',
          '1': 'color:green;',
          '2': 'color:red;'
        }
        return sexClassMap[sex]
      }
    },
    data() {
      return {
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20
        },
        userId: ''
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        fetchUserList(this.listQuery).then(response => {
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
