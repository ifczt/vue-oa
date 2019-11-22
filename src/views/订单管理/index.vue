<template>
  <div class="app-container">

    <div class="filter-container">
      <el-button type="primary" @click="drawer = true">
        搜索条件
      </el-button>
      <el-button type="success" @click="drawer = true">
        导出数据
      </el-button>
      <el-button type="warning" @click="drawer = true">
        导入数据-物流状态
      </el-button>
      <el-drawer
        title="搜索"
        :visible.sync="drawer"
        :direction="direction"
        :before-close="handleClose"
        style="text-align: center"
      >
        <el-row>
          <el-input
            v-model="listQuery.express_code"
            placeholder="快递单号"
            style="width: 200px;margin-top: 9px;"
            class="filter-item"
            @keyup.enter.native="search_cri"
          />
          <el-select
            v-model="listQuery.express_state"
            placeholder="快递状态"
            clearable
            style="width: 120px;margin-top: 9px;"
            class="filter-item"
            multiple
            collapse-tags
          >
            <!--<el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item"/>-->
          </el-select>
          <el-select
            v-model="listQuery.product_name"
            placeholder="产品名称"
            clearable
            class="filter-item"
            style="width: 200px;margin-top: 10px;"
            multiple
            collapse-tags
          >
            <el-option
              v-for="item in product_name_options"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
          <el-autocomplete
            v-model="listQuery.input_per"
            :fetch-suggestions="null"
            placeholder="录入员"
            style="padding: 0px;"
            @select="null"
          />
          <el-cascader
            v-model="listQuery.area"
            size="large"
            :options="china_options"
            placeholder="指定区域"
            @change="area_select"
          />
        </el-row>
        <el-row>
          <el-select
            v-model="listQuery.delivery_mode"
            placeholder="派送方式"
            clearable
            style="width: 150px;margin-top: 9px;"
            class="filter-item"
            multiple
            collapse-tags
          >
            <el-option v-for="item in delivery_mode_options" :value="item.key" :label="item.name" />
          </el-select>
          <el-select
            v-model="listQuery.type_time_slot"
            placeholder="时间段指定类型"
            clearable
            style="width: 150px;margin-top: 9px;"
            class="filter-item"
          >
            <el-option label="派单时间" value="1" />
            <el-option label="结款日期" value="2" />
            <el-option label="记账时间" value="3" />
          </el-select>
          <el-date-picker
            v-model="listQuery.time_slot_value"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="picker_time_slot"
            :disabled="listQuery.type_time_slot==''"
          />
          <el-button
            v-waves
            class="filter-item"
            style="margin-top: 25px;"
            type="success"
            icon="el-icon-search"
            @click="handleFilter"
          >
            搜索
          </el-button>
        </el-row>
      </el-drawer>
    </div>

    <el-table
      v-loading="listLoading"
      :height="tableHeight"
      stripe
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column align="center" label="订单编号" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.ppg_id }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="120px" align="center" label="产品名称">
        <template slot-scope="scope">
          <span>{{ scope.row.buy_product }}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="所属学校">
        <template slot-scope="scope">
          <span>{{ scope.row.school }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="所属加盟商">
        <template slot-scope="scope">
          <span>待定</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="学生与家长">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.parent_name }}</el-tag>
          <el-tag type="success">{{ scope.row.son_name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="物流状态">
        <template slot-scope="scope">
          <span>待定</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="售价" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" align="center" label="录入与发货" width="110">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.delivery_time | parseTime('{y}-{m}-{d}') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="物流公司">
        <template slot-scope="scope">
          <span>{{ scope.row.delivery }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="190">
        <template slot-scope="{row}">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            style="margin-bottom:0px"
            @click="handleUpdate(row)"
          >编辑
          </el-button>
          <el-button type="danger" size="mini" icon="el-icon-edit" style="margin-bottom:0px" @click="handleUpdate(row)">
            删除
          </el-button>
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
        <el-form-item label="购买产品" prop="buy_product">
          <el-select v-model="temp.buy_product" class="filter-item" placeholder="点击选择">
            <el-option
              v-for="item in product_name_options"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="派单时间" prop="delivery_time">
          <el-date-picker
            v-model="temp.delivery_time"
            type="date"
            placeholder="选择希望发货的时间"
            align="right"
            :picker-options="picker_date"
          />
        </el-form-item>
        <el-form-item label="宣传编号" prop="ppg_id">
          <el-input v-model="temp.ppg_id" />
        </el-form-item>
        <el-form-item label="学校名称" prop="school">
          <el-input v-model="temp.school" />
        </el-form-item>
        <el-form-item label="家长姓名" prop="parent_name">
          <el-input v-model="temp.parent_name" style="width: 218px;" />
          <el-radio v-model="temp.consignee" label="1" border>收件人</el-radio>
        </el-form-item>
        <el-form-item label="学生姓名" prop="son_name">
          <el-input v-model="temp.son_name" style="width: 125px;" />
          <el-button type="primary" icon="el-icon-edit" @click="auto_cname">自动</el-button>
          <el-radio v-model="temp.consignee" label="2" border>收件人</el-radio>
        </el-form-item>
        <el-form-item label="付款方式" prop="pay_method">
          <el-radio v-model="temp.pay_method" label="1">货到付款</el-radio>
          <el-radio v-model="temp.pay_method" label="2">微信支付</el-radio>
        </el-form-item>
        <el-form-item label="收件地址" prop="address">
          <el-cascader v-model="temp.area" size="large" :options="china_options" @change="area_select" />
          <el-input v-model="temp.address" style="margin-top: 5px;" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="temp.phone" />
        </el-form-item>
        <el-form-item label="派送方式" prop="delivery">
          <el-select v-model="temp.delivery" class="filter-item" placeholder="点击选择">
            <el-option
              v-for="item in delivery_mode_options"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-show="temp.pay_method==1" label="申请折扣">
          <el-switch v-model="temp.discount" />
        </el-form-item>
        <el-form-item v-show="temp.discount" label="价格调整">
          <el-input-number v-model="temp.price" :min="0" :max="1290" />
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
import waves from '@/directive/waves'

export default {
  name: 'OrderManage',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      drawer: false,
      direction: 'ttb',
      // 中国区域信息
      area: [],
      china_options: regionData,
      // 快速选择派单日期
      picker_date: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        },
        {
          text: '明天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        },
        {
          text: '后天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 2)
            picker.$emit('pick', date)
          }
        }
        ]
      },
      // 快速选择时间段
      picker_time_slot: {
        shortcuts: [{
          text: '本月',
          onClick(picker) {
            picker.$emit('pick', [new Date().setDate(1), new Date()])
          }
        }, {
          text: '今年至今',
          onClick(picker) {
            const end = new Date()
            const start = new Date(new Date().getFullYear(), 0)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近六个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setMonth(start.getMonth() - 6)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      // 列表
      list: null,
      // 列表总条目数
      total: 0,
      // 列表加载动画
      listLoading: true,
      // 跳转页数据- page当前页 limit一页多少条数据
      listQuery: {
        page: 1,
        limit: 20,
        express_code: '',
        express_state: '',
        product_name: '',
        input_per: '',
        area: '',
        time_slot_value: '',
        type_time_slot: '',
        delivery_mode: ''
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
      // 产品列表
      product_name_options: [
        {
          code: '1',
          name: '智能学堂小学'
        },
        {
          code: '2',
          name: '智能学堂中学'
        },
        {
          code: '3',
          name: '知好乐初中'
        },
        {
          code: '4',
          name: '知好乐高中'
        }
      ],
      // 派送方式
      delivery_mode_options: [
        { key: 'CN', name: '内送' },
        { key: 'US', name: '顺丰' },
        { key: 'JP', name: '顺丰次晨' },
        { key: 'EU', name: '顺丰隔日' }
      ],
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
  // 事件方法执行
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
    // 搜索
    search_cri() {
      this.listQuery.page = 1
      this.getList()
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
    // 区域选中
    area_select(value) {
      let area_value = ''
      this.area = value
      for (const i in value) {
        area_value += CodeToText[value[i]]
      }
      console.log(area_value)
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
    },
    // 补全家长或学生姓名
    auto_cname() {
      var temp = this.temp
      console.log(temp.parent_name)
      if ((temp.son_name != '') & (temp.parent_name != '')) {
        this.$message({ message: '无需使用该功能' })
        return
      }
      if ((temp.parent_name != '') & (temp.son_name == '')) {
        temp.son_name = temp.parent_name + '孩子'
        return
      }
      if ((temp.son_name != '') & (temp.parent_name == '')) {
        temp.parent_name = temp.son_name + '家长'
        return
      }
      this.$message({ message: '请填写家长姓名或学生姓名后再使用' })
    },
    handleClose(done) {
      done()
      this.listQuery = {
        page: 1,
        limit: 20,
        express_code: '',
        express_state: '',
        product_name: '',
        input_per: '',
        area: '',
        time_slot_value: '',
        type_time_slot: '',
        delivery_mode: ''
      }
      // this.$confirm('确认关闭？')
      //     .then(_ => {
      //         done();
      //     })
      //     .catch(_ => {
      //     });
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
