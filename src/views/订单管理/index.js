import { CodeToText, regionDataPlus } from 'element-china-area-data'
import {
  fetchList, inputOrder, getProductList, getExpressList,
  getPpg_id_info, del_list, update_order, apply_discount_state_change, update_logistics, get_finance_list
} from '@/api/order'
import Pagination from '@/components/Pagination'
import { parseTime } from '@/utils'
import { Loading } from 'element-ui'
import { mapGetters } from 'vuex'
import { get_delivery_name, get_product, get_product_name, list_handle, to_server_order } from '@/utils/server_data'
import _global from '@/utils/Global'
import { checkPhone, loading_options } from '@/utils/Global'
import { today, tomorrow, after_tomorrow, t_month, t_year, six_month, formatDate } from '@/utils/time_change'
import { getToken } from '@/utils/auth'
import store from '@/store'
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import { isArray } from '@/utils/validate'
import { query_name } from '@/api/user'

export default {
  name: 'OrderManage',
  list: [],
  components: { Pagination, UploadExcelComponent },
  data() {
    return {
      t_payment_state: '0',
      t_apply_discount_state: '0',
      pick_index: '',
      return_and_swap_title: '',
      return_temp: {
        id: '',
        courier_code_return: '',
        courier_code_relapse: '',
        payment: '',
        delivery_state: ''
      },
      tips_text: '上传文件后，自动开始批量修改，请勿中途退出',
      apply_discount_text(bool) {
        return bool ? '拒绝折扣申请' : '同意折扣申请'
      },
      expands: [], // 只展开一行放入当前行id
      getRowKeys(row) {
        return row.id
      },
      approval_ico(bool) {
        return bool ? 'el-icon-close' : 'el-icon-check'
      },
      drawer: false,
      // 导入数据面板 显示开关
      upload: false,
      // 退货处理面板 显示开关
      return_goods_visible: false,
      direction: 'ttb',
      is_del_server: false,
      is_server_input: false,
      // 中国区域信息
      area: [],
      china_options: regionDataPlus,
      // 快速选择派单日期
      picker_date: {
        disabledDate(time) {
          // 在科学计数法中，为了使公式简便，可以用带“E”的格式表示。例如1.03乘10的8次方，可简写为“1.03e8”的形式
          // 一天是24*60*60*1000 = 86400000 = 8.64e7
          return time.getTime() < (Date.now() - 8.64e7) + 2.88e7
        },
        shortcuts: [tomorrow, after_tomorrow]
      },
      // 快速选择时间段
      picker_time_slot: {
        shortcuts: [t_month, t_year, six_month]
      },
      // 列表
      list: [],
      data_list: [],
      // 列表总条目数
      total: 0,
      // 列表加载动画
      listLoading: false,
      // 跳转页数据- page当前页 limit一页多少条数据
      financeQuery: {},
      listQuery: {
        payment_state: '',
        apply_discount_state: '',
        page: 1,
        limit: 20,
        manage: true,
        // 快递单号
        courier_code: '',
        // 快递状态
        delivery_state: '',
        buy_product: '',
        input_staff: '',
        input_staff_id: '',
        area: '',
        time_slot_value: '',
        type_time_slot: '',
        delivery: '',
        phone: '',
        parent: ''
      },
      // 表单数据
      temp: {
        remarks: '',
        auxiliary_apply: false,
        // 编号
        id: '',
        // 加盟商
        publicist: '',
        // 订单录入员
        input_staff: this.name,
        // 物流状态
        delivery_state: '',
        // 收件人-谁是
        consignee: '1',
        // 派单时间
        delivery_time: new Date().getHours() <= 11 ? parseTime(new Date(), '{y}-{m}-{d}') : parseTime(new Date().setTime(new Date().getTime() + 3600 * 1000 * 24), '{y}-{m}-{d}'),
        // 宣传编号
        ppg_id: null,
        // 学校名称
        school: '',
        school_code: '',
        // 购买产品
        buy_product: null,
        buy_num: 1,
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
        apply_discount_state: false,
        apply_discount_state_bool: false
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
        ppg_id: [{ required: true, message: '请输入编号' }],
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
    this.lite_getProductList()
    Loading.service(loading_options)
  },
  methods: {
    query_name_select(item) {
      this.listQuery.input_staff_id = item.id
    },
    queryName(queryString, cb) {
      if (queryString.length < 1) {
        return
      }
      query_name({ 'value': queryString }).then(response => {
        cb(response.data)
      })
    },
    switch_value(type) {
      if (type === 'apply') {
        this.listQuery.apply_discount_state = this.t_apply_discount_state
      } else {
        this.listQuery.payment_state = this.t_payment_state
      }
    },
    return_swap() {
      const send_temp = JSON.parse(JSON.stringify(this.return_temp))
      if (this.return_and_swap_title === '换货处理') {
        send_temp.courier_code_relapse = send_temp.courier_code_return
        delete send_temp.courier_code_return
      } else {
        delete send_temp.courier_code_relapse
      }
      update_order(send_temp).then(() => {
        this.return_goods_visible = false
        this.list[this.pick_index].delivery_state = this.return_and_swap_title === '换货处理' ? '换货' : '退货'
        this.list[this.pick_index].courier_code_return = send_temp.courier_code_return
        this.list[this.pick_index].courier_code_relapse = send_temp.courier_code_relapse
        this.list[this.pick_index].payment = send_temp.payment
        this.return_temp = {
          id: '',
          courier_code_return: '',
          courier_code_relapse: '',
          payment: '',
          delivery_state: ''
        }
      })
    },
    return_goods(id, type, index) {
      this.pick_index = index
      this.return_and_swap_title = type === 'return' ? '退货处理' : '换货处理'
      this.return_goods_visible = true
      this.return_temp.id = id
      this.return_temp.delivery_state = type === 'return' ? 3 : 2// 退货为3 换货为2
    },
    expandChange(row, expandedRows) {
      const that = this
      // 只展开一行
      if (expandedRows.length) { // 说明展开了
        that.expands = []
        if (row) {
          that.expands.push(row.id)// 只展开当前行id
        }
      } else { // 说明收起了
        that.expands = []
      }
    },
    search_cri() {
      this.listQuery.page = 1
      this.listQuery.input_staff = this.listQuery.input_staff_id
      delete this.listQuery.input_staff_id
      if (this.listQuery.area || this.listQuery.buy_product.length || this.listQuery.courier_code || this.listQuery.delivery.length ||
        this.listQuery.delivery_state.length || this.listQuery.input_staff || this.listQuery.time_slot_value || this.listQuery.type_time_slot ||
        this.listQuery.parent || this.listQuery.phone || this.listQuery.payment_state.length || this.listQuery.apply_discount_state.length) {
        this.getList()
        this.handleClose()
      } else {
        this.$message('必须输入至少一项条件才可以搜索。')
      }
    },
    handleClose(done) {
      if (done) {
        done()
      } else {
        this.drawer = false
      }
      this.financeQuery = this.listQuery
      this.listQuery = {
        page: 1,
        limit: 20,
        manage: true,
        courier_code: '',
        delivery_state: '',
        buy_product: '',
        input_staff: '',
        input_staff_id: '',
        area: '',
        time_slot_value: '',
        type_time_slot: '',
        delivery: '',
        phone: '',
        parent: '',
        payment_state: '',
        apply_discount_state: ''
      }
      this.t_payment_state = '0'
      this.t_apply_discount_state = '0'
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.price === 0 && row.pay_method !== '2') {
        return 'warning-row'
      }
      return ''
    },
    // 获取列表数据
    getList() {
      this.listLoading = true
      delete this.listQuery.input_staff_id
      fetchList(this.listQuery).then(response => {
        this.list = list_handle(response.data.items)
        this.total = response.data.total
        this.listLoading = false
      })
    },
    // 重置表单
    resetTemp() {
      this.is_server_input = false
      this.temp = {
        remarks: '',
        buy_num: 1,
        id: '',
        publicist: '',
        input_staff: this.name,
        delivery_state: '',
        delivery_time: new Date().getHours() <= 11 ? parseTime(new Date(), '{y}-{m}-{d}') : parseTime(new Date().setTime(new Date().getTime() + 3600 * 1000 * 24), '{y}-{m}-{d}'),
        ppg_id: '',
        school: '',
        school_code: '',
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
        apply_discount_state: false,
        auxiliary_apply: false,
        apply_discount_state_bool: false
      }
    },
    // 区域选中
    area_select(value) {
      let area_value = ''
      this.temp.area = value
      console.log(value)
      for (const i in value) {
        area_value += CodeToText[value[i]]
      }
      this.temp.address = area_value
    },
    // 补全家长或学生姓名
    auto_cname() {
      var temp = this.temp
      if ((temp.student !== '') && (temp.parent !== '')) {
        this.$message({ message: '无需使用该功能' })
        return
      }
      if ((temp.parent !== '') && (temp.student === '')) {
        temp.student = temp.parent + '的孩子'
        return
      }
      if ((temp.student !== '') && (temp.parent === '')) {
        temp.parent = temp.student + '的家长'
        return
      }
      this.$message({ message: '请填写家长姓名或学生姓名后再使用' })
    },
    // 更新数据视图弹出
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.delivery_time = new Date(this.temp.delivery_time)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    changeProduct(item) {
      this.temp.price = item.price
    },
    // 获取产品列表 加载完成就获取快递列表
    lite_getProductList() {
      getProductList().then(response => {
        this.lite_getExpressList()
        _global.product_name_options = response.data
        this.product_name_options = response.data
      })
    },
    // 加载快递列表
    lite_getExpressList() {
      getExpressList().then(response => {
        Loading.service(loading_options).close()
        _global.delivery_mode_options = response.data
        this.delivery_mode_options = response.data
        this.getList()
      })
    },

    changePpg_id(val) {
      if (val.length > 5) {
        getPpg_id_info({ ppg_id: val }).then(response => {
          this.temp.school = response.data.school
          this.temp.publicist = response.data.publicist
          this.temp.school_code = response.data.school_code
        }).catch((error) => {
          this.temp.school = null
          this.temp.publicist = null
        })
      }
    },
    // 更新条目数据
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = to_server_order(Object.assign({}, this.temp))
          this.temp.price = tempData.price
          tempData.consignee = tempData.consignee === '2' ? tempData.student : tempData.parent
          if (isArray(tempData.publicist)) {
            tempData.publicist = tempData.publicist[0]
          } else {
            delete tempData.publicist
          }
          delete tempData.school
          delete tempData.auxiliary_apply
          update_order(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.temp.buy_product = get_product_name(this.temp.buy_product)
                this.temp.delivery = get_delivery_name(this.temp.delivery)
                this.temp.apply_discount_state_bool = this.temp.apply_discount_state ? 1 : 0
                this.temp.auxiliary_apply = this.temp.apply_discount_state_bool !== 1
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
    change_apply(id, bool) {
      bool = !bool
      let v
      for (v of this.list) {
        if (v.id === id) {
          const index = this.list.indexOf(v)
          v.auxiliary_apply = bool
          if (!v.auxiliary_apply) {
            v.apply_discount_state = false
            v.price = get_product(v.buy_product, 'price')
          }
          break
        }
      }
      apply_discount_state_change({ id: id, apply_discount_state: bool ? 2 : 0, price: v.price }).then(() => {
        v.apply_discount_state_bool = bool ? 2 : 0
      })
    },
    // 删除条目
    del_list(index, id) {
      this.is_del_server = true
      del_list({ id: id }).then(() => {
        this.list.splice(index, 1)
        this.is_del_server = false
      }).catch((error) => {
        this.is_del_server = false
      })
    },
    handleDownload() {
      Loading.service(loading_options)
      this.listQuery.limit = 5000
      this.listQuery.delivery_state = [0]
      fetchList(this.listQuery).then(response => {
        this.data_list = list_handle(response.data.items)
        console.log(this.data_list)
        if (this.data_list.length === 0) {
          this.$message.error('没有任何数据需要导出')
          Loading.service(loading_options).close()
          this.listQuery.limit = 20
          this.listQuery.delivery_state = ''
          return
        }
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['订单编号', '产品', '收件人', '手机号码', '地址', '价格', '数量', '支付方式', '备注']
          const filterVal = ['id', 'buy_product', 'parent', 'phone', 'address', 'price', 'buy_num', 'pay_method', 'remarks']
          const data = this.formatJson(filterVal, this.data_list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '订单数据-管理'
          })
          Loading.service(loading_options).close()
          this.listQuery.limit = 20
          this.listQuery.delivery_state = ''
        })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'pay_method') {
          return v[j] === '1' ? '货到付款' : '寄付'
        }
        if (j === 'city' || j === 'province') {
          return CodeToText[Number(v[j])]
        }
        return v[j]
      }))
    },
    beforeUploadExc(file) {
      const isLt1M = file.size / 1024 / 1024 < 1

      if (isLt1M) {
        return true
      }

      this.$message({ message: '文件大小超出.', type: 'warning' })
      return false
    },
    uploadExcSuccess({ results, header }) {
      Loading.service(loading_options)
      for (const i of results) {
        if (i.refund_time) {
          i.refund_time = formatDate(i.refund_time, '/')
        }
      }
      update_logistics({ list: results }).then(() => {
        Loading.service(loading_options).close()
        this.upload = false
        this.$notify({
          title: '我恭喜你发财，我恭喜你精彩',
          message: '导入成功',
          type: 'success'
        })
      })
    },
    downTemplate(type) {
      let tHeader = []
      if (type === 'wl') {
        tHeader = ['id', 'courier_code', 'delivery_state', 'err_text']
      }
      if (type === 'th') {
        tHeader = ['id', 'courier_code_return', 'freight', 'payment', 'delivery_state', 'err_text']
      }
      if (type === 'cw') {
        tHeader = ['id', 'refund_time', 'payment']
      }
      if (type === 'yf') {
        tHeader = ['id', 'courier_code', 'freight']
      }
      import('@/vendor/Export2Excel').then(excel => {
        const data = []
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '导入模板'
        })
      })
    },
    financeDownload() {
      if (Object.keys(this.financeQuery).length === 0) {
        this.$message.error('请先进行搜索，再导出数据')
        return
      }
      delete this.financeQuery.page
      delete this.financeQuery.limit
      delete this.financeQuery.manage
      get_finance_list(this.financeQuery).then(response => {
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['产品ID', '回款情况', '回款日期', '收费',
            '负责人', '订单录入员', '发单日期', '物流状态',
            '省', '市', '产品', '数量', '收件人',
            '收件人号码', '收件人地址', '快递单号', '退货单号',
            '换货单号']
          const filterVal = ['id', 'payment_state', 'refund_time', 'payment',
            'username', 'input_staff', 'delivery_time', 'delivery_state',
            'province', 'city', 'name', 'buy_num', 'consignee',
            'phone', 'address', 'courier_code', 'courier_code_return',
            'courier_code_relapse']
          const data = this.formatJson(filterVal, response.data)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '订单数据-财务'
          })
        })
      })
    }
  },
  computed: {
    ...mapGetters(['name', 'roles'])
  }
}
