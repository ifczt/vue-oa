<template>
  <div class="app-container">
    <el-button type="primary" @click="handleCreate">添加账号</el-button>
    <el-table
      v-loading="listLoading"
      :data="list"
      fit
      stripe
      highlight-current-row
      style="width: 100%"
      :height="tableHeight"
    >
      <el-table-column align="center" label="用户编号" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.ppg_id }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="120px" align="center" label="用户姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.buy_product }}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="用户类别">
        <template slot-scope="scope">
          <span>{{ scope.row.school }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="本年度销量">
        <template slot-scope="scope">
          <span>待定</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="总销量">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.parent_name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="签收率">
        <template slot-scope="scope">
          <span>待定</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="最近登陆时间" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" align="center" label="用户状态" width="110">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.delivery_time | parseTime('{y}-{m}-{d}') }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" min-width="190">
        <template slot-scope="{row}">
          <el-tooltip class="item" effect="dark" content="编辑用户" placement="top-start">
            <el-button type="primary" icon="el-icon-edit" circle style="margin-bottom: 0px" />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="user_is_off_tips" placement="top-start">
            <el-button type="success" icon="el-icon-check" circle style="margin-bottom: 0px" />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除账号，一旦删除无法恢复，谨慎操作，建议使用账号停用功能" placement="top-start">
            <el-button type="danger" icon="el-icon-delete" circle style="margin-bottom: 0px" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="80px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="用户姓名" prop="buy_product">
          <el-input v-model="temp.school" />
        </el-form-item>
        <el-form-item label="账号密码" prop="delivery_time">
          <el-input v-model="temp.school" />
        </el-form-item>
        <el-form-item label="确认密码" prop="delivery_time">
          <el-input v-model="temp.school" />
        </el-form-item>
        <el-form-item label="用户类别" prop="school">
          <el-select v-model="temp.delivery" class="filter-item" placeholder="点击选择">
            <el-option
              v-for="item in delivery_mode_options"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">提交</el-button>
      </div>
    </el-dialog>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      style="padding: 0px"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { regionData, CodeToText } from 'element-china-area-data'
import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import Pagination from '@/components/Pagination'
import { parseTime } from '@/utils'

export default {
  name: 'AccManage',
  list: null,
  components: { Pagination },
  data() {
    return {
      user_is_off_tips: '禁用账号',
      // 列表
      list: null,
      // 列表总条目数
      total: 0,
      // 列表加载动画
      listLoading: true,
      // 跳转页数据- page当前页 limit一页多少条数据
      listQuery: {
        page: 1,
        limit: 20
      },
      // 表单数据
      temp: {
        // 收件人
        consignee: '1',
        // 派单时间
        delivery_time: new Date(),
        // 宣传编号
        ppg_id: '',
        // 学校名称
        school: '',
        // 购买产品
        buy_product: '',
        // 价格
        price: 790,
        // 付款方式 1货到付款 2微信支付
        pay_method: '1',
        // 学生及家长姓名
        parent_name: '',
        son_name: '',
        // 收件地址及电话
        address: '',
        phone: '',
        // 派送方式
        delivery: '',
        // 区域
        area: []
      },
      // 隐藏表单
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑订单',
        create: '添加订单'
      },
      // 规则
      rules: {
        buy_product: [{
          required: true,
          message: '请选择产品'
        }],
        delivery_time: [{
          type: 'date',
          required: true,
          message: '请选择派单时间'
        }],
        ppg_id: [{
          required: true,
          message: '请输入编号'
        }],
        address: [{
          required: true,
          message: '请填写完整地址'
        }],
        phone: [{
          required: true,
          message: '请填写手机号码'
        }]
      },
      tableHeight: 800
    }
  },
  // html加载完成之前，执行
  created() {
    this.tableHeight = window.innerHeight - 250
    this.getList()
  },
  methods: {
    // 获取列表数据
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        // 模拟请求时间
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    // 重置表单
    resetTemp() {
      this.temp = {
        delivery_time: new Date(),
        ppg_id: '',
        school: '',
        buy_product: '',
        price: 790,
        pay_method: '1',
        parent_name: '',
        son_name: '',
        address: '',
        phone: '',
        delivery: '',
        area: [],
        consignee: '1'
      }
    },
    // 新建视图
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 插入数据
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createArticle(this.temp).then(() => {
            console.log(this.temp)
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '新建成功',
              message: '成功插入数据',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    // 更新数据视图弹出
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 更新条目数据
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp)
          updateArticle(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '更新完成',
              message: '修改数据成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    }
  }
}
</script>

<style scoped>
  .edit-input {
    padding-right: 100px;
  }

  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }

  .el-button {
    margin-bottom: 15px;
  }

</style>
