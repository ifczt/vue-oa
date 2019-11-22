<template>
  <div class="app-container">
    <el-button type="primary" style="margin-bottom: 15px" @click="handleCreate">添加订单</el-button>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      :height="tableHeight"
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
      <el-table-column min-width="180px" align="center" label="学生与家长">
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
      <el-table-column align="center" label="操作" min-width="190">
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
        style="width: 430px; margin-left:50px;"
      >
        <el-form-item label="购买产品" prop="buy_product">
          <el-select
            v-model="temp.buy_product"
            value-key="id"
            class="filter-item"
            placeholder="点击选择"
            @change="changeProduct"
          >
            <el-option
              v-for="item in product_name_options"
              :id="item.id"
              :label="item.name"
              :value="item"
              :price="item.price"
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
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="宣传编号" prop="ppg_id">
          <el-input
            v-model.number="temp.ppg_id"
            show-word-limit
            suffix-icon="el-icon-share"
            maxlength="6"
            @change="changePpg_id"
          />
        </el-form-item>
        <el-form-item label="学校名称" prop="school">
          <el-input v-model="temp.school" :disabled="true" />
        </el-form-item>
        <el-form-item label="学生姓名">
          <el-input v-model="temp.student" style="width: 125px;" />
          <el-button type="primary" icon="el-icon-edit" @click="auto_cname">自动</el-button>
          <el-radio v-model="temp.consignee" label="2" border>收件人</el-radio>
        </el-form-item>
        <el-form-item label="家长姓名">
          <el-input v-model="temp.parent" style="width: 218px;" />
          <el-radio v-model="temp.consignee" label="1" border>收件人</el-radio>
        </el-form-item>
        <el-form-item label="付款方式">
          <el-radio v-model="temp.pay_method" label="1">货到付款</el-radio>
          <el-radio v-model="temp.pay_method" label="2" @change="temp.apply_discount_state=false">微信支付</el-radio>
        </el-form-item>
        <el-form-item label="收件地址" prop="address">
          <el-cascader v-model="temp.area" size="large" :options="china_options" @change="area_select" />
          <el-input v-model="temp.address" style="margin-top: 5px;" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model.number="temp.phone" />
        </el-form-item>
        <el-form-item label="派送方式" prop="delivery">
          <el-select
            v-model="temp.delivery"
            value-key="id"
            class="filter-item"
            placeholder="点击选择"
            @change="changeDelivery"
          >
            <el-option
              v-for="item in delivery_mode_options"
              :id="item.id"
              :label="item.name"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-show="temp.pay_method==1" label="申请折扣">
          <el-switch v-model="temp.apply_discount_state" />
        </el-form-item>
        <el-form-item v-show="temp.apply_discount_state" label="价格调整">
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
// import {fetchList, fetchPv, createArticle, updateArticle} from "@/api/article";
import { fetchList, inputOrder, getProductList, getExpressList, getPpg_id_info } from '@/api/order'
import Pagination from '@/components/Pagination'
import { parseTime } from '@/utils'
import { isPhone } from '@/utils/validate'

export default {
  name: 'OrderInput',
  list: [],
  components: { Pagination },
  data() {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
        console.log(reg.test(value))
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('请输入正确的手机号'))
        }
      }
    }
    return {
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
      // 列表
      list: [],
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
        // 收件人-谁是
        consignee: '1',
        // 派单时间
        delivery_time: parseTime(new Date(), '{y}-{m}-{d}'),
        // 宣传编号
        ppg_id: null,
        // 学校名称
        school: '',
        // 购买产品
        buy_product: null,
        // 价格
        price: 0,
        // 付款方式 1货到付款 2微信支付
        pay_method: '1',
        // 学生及家长姓名
        parent: '',
        student: '',
        // 收件地址及电话
        address: '',
        phone: '',
        // 派送方式
        delivery: '',
        // 区域
        area: [],
        // 申请折扣
        apply_discount_state: false
      },
      // 产品列表
      product_name_options: [],
      // 派送方式
      delivery_mode_options: [],
      // 隐藏表单
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑订单',
        create: '添加订单'
      },
      // 规则
      rules: {
        buy_product: [{ required: true, message: '请选择产品' }],
        delivery_time: [{ required: true, message: '请选择派单时间' }],
        ppg_id: [{ required: true, message: '请输入编号' }, { type: 'number', message: '只能输入数字', trigger: 'blur' }],
        school: [{ required: true, message: '请重现填写正确宣传编号，以自动生成学校信息' }],
        address: [{ required: true, message: '请填写完整地址' }],
        phone: [{ validator: checkPhone, trigger: 'blur', required: true }],
        delivery: [{ required: true, message: '请选择派送方式' }]
      },
      tableHeight: 800
    }
  },
  // html加载完成之前，执行
  created() {
    this.tableHeight = window.innerHeight - 250
    this.getList()
    getProductList().then(response => {
      this.product_name_options = response.data
    })
    getExpressList().then(response => {
      this.delivery_mode_options = response.data
    })
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
        delivery_time: parseTime(new Date(), '{y}-{m}-{d}'),
        ppg_id: '',
        school: '',
        buy_product: null,
        price: 0,
        pay_method: '1',
        parent: '',
        student: '',
        address: '',
        phone: '',
        delivery: '',
        area: [],
        consignee: '1',
        apply_discount_state: false
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
          if (this.temp.student == '' || this.temp.parent == '') {
            this.$message('家长和学生姓名不能为空')
            return
          }
          var send_temp = JSON.parse(JSON.stringify(this.temp))
          send_temp.apply_discount_state = this.temp.apply_discount_state ? 1 : 0
          send_temp.buy_product = this.temp.buy_product.id
          send_temp.delivery = this.temp.delivery.id
          inputOrder(send_temp).then(() => {
            console.log(this.temp)
            this.temp.buy_product = this.temp.buy_product.name
            this.temp.delivery = this.temp.delivery.name
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '新建成功',
              message: '成功录入订单',
              type: 'success',
              duration: 5000
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
        temp.son_name = temp.parent_name + '的孩子'
        return
      }
      if ((temp.son_name != '') & (temp.parent_name == '')) {
        temp.parent_name = temp.son_name + '的家长'
        return
      }
      this.$message({ message: '请填写家长姓名或学生姓名后再使用' })
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
    changeProduct(item) {
      this.temp.price = item.price
    },
    changeDelivery(item) {
      if (item.name == '内送') {
        console.log(this.temp.price)
        this.temp.price = 0
        console.log(this.temp.price)
      }
    },
    changePpg_id(val) {
      // _json = JSON.stringify({ppg_id:val});
      getPpg_id_info({ ppg_id: val }).then(response => {
        this.temp.school = response.data.school
      }).catch((error) => {
        this.temp.school = null
      })
    },
    // 更新条目数据
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        // if (valid) {
        //     const tempData = Object.assign({}, this.temp)
        //     tempData.timestamp = +new Date(tempData.timestamp)
        //     updateArticle(tempData).then(() => {
        //         for (const v of this.list) {
        //             if (v.id === this.temp.id) {
        //                 const index = this.list.indexOf(v)
        //                 this.list.splice(index, 1, this.temp)
        //                 break
        //             }
        //         }
        //         this.dialogFormVisible = false
        //         this.$notify({
        //             title: '更新完成',
        //             message: '修改数据成功',
        //             type: 'success',
        //             duration: 2000
        //         })
        //     })
        // }
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

</style>
