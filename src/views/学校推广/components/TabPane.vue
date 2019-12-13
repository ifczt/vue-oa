<template>
  <div>
    <el-table :data="list" stripe fit highlight-current-row style="width: 100%" :height="body_height">
      <el-table-column
        v-loading="loading"
        label="宣传编号"
        width="165"
        element-loading-text="数据加载中..."
      >
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" label="宣传日期">
        <template slot-scope="scope">
          <span>{{ scope.row.promotion_time | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="300px" label="宣传学校">
        <template slot-scope="{row}">
          <el-tag>{{ row.school_code }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column width="120px" label="发放量">
        <template slot-scope="scope">
          <span>{{ scope.row.dosage }}</span>
        </template>
      </el-table-column>

      <el-table-column label="是单数" width="95">
        <template slot-scope="scope">
          <span>{{ scope.row.sales_nums }}</span>
        </template>
      </el-table-column>

      <el-table-column width="110px" label="目前销量">
        <template slot-scope="scope">
          0
        </template>
      </el-table-column>

      <el-table-column label="预计收入" width="110">
        <template slot-scope="{row}">
          0
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      style="padding: 0;margin-top: 15px"
      @pagination="getList()"
    />
  </div>
</template>

<script>
import { get_ppg_id } from '@/api/school_ext'
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  props: ['type'],
  data() {
    return {
      total: 0,
      body_height: 600,
      list: null,
      listQuery: {
        page: 1,
        limit: 10,
        province: this.type
      },
      loading: false
    }
  },
  created() {
    if (this.type !== 'None') {
      this.getList()
    }
    this.body_height = window.innerHeight - 350
  },
  methods: {
    getList() {
      this.loading = true
      this.$emit('create') // for test
      get_ppg_id(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.loading = false
      })
    }
  }
}
</script>

