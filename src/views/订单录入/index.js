import { regionData, CodeToText } from 'element-china-area-data'
import {
  fetchList, inputOrder, getProductList, getExpressList,
  getPpg_id_info, del_list, update_order
} from '@/api/order'
import Pagination from '@/components/Pagination'
import { parseTime } from '@/utils'
import { Loading } from 'element-ui'
import { mapGetters } from 'vuex'

export default {
  name: 'OrderInput',
  list: [],
  components: { Pagination },
  loading_options: {
    lock: true,
    text: 'Loading',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)'
  },
  data() {
    const checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('请输入正确的手机号'))
        }
      }
    }
    return {
      is_del_server: false,
      is_server_input: false,
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
    this.lite_getProductList()
    Loading.service(this.loading_options)
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (row.price === 0 && row.pay_method !== '2') {
        return 'warning-row'
      }
      return ''
    },
    // 获取列表数据
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    // 重置表单
    resetTemp() {
      this.is_server_input = false
      this.temp = {
        id: '',
        publicist: '',
        input_staff: this.name,
        delivery_state: '',
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
      this.temp.area = value
      console.log(value)
      for (const i in value) {
        area_value += CodeToText[value[i]]
      }
      this.temp.address = area_value
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
      this.is_server_input = true
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (this.temp.student === '' || this.temp.parent === '') {
            this.$message('家长和学生姓名不能为空')
            this.is_server_input = false
            return
          }
          if (this.temp.pay_method === 2) {
            this.temp.price = 0
          }
          if (!this.temp.apply_discount_state) {
            this.temp.price = this.temp.buy_product.price
          }
          var send_temp = JSON.parse(JSON.stringify(this.temp))
          send_temp.apply_discount_state = this.temp.apply_discount_state ? 1 : 0
          send_temp.buy_product = this.temp.buy_product.id
          send_temp.delivery = this.temp.delivery.id
          inputOrder(send_temp).then(response => {
            this.temp.buy_product = this.temp.buy_product.name
            this.temp.delivery = this.temp.delivery.name
            this.temp.id = response.data.id
            this.temp.delivery_state = response.data.delivery_state
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.is_server_input = false
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
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    changeProduct(item) {
      this.temp.price = item.price
    },
    lite_getProductList() {
      getProductList().then(response => {
        this.lite_getExpressList()
        this.product_name_options = response.data
      }).catch((error) => {
        this.lite_getProductList()
      })
    },
    lite_getExpressList() {
      getExpressList().then(response => {
        Loading.service(this.loading_options).close()
        this.delivery_mode_options = response.data
      }).catch((error) => {
        this.lite_getExpressList()
      })
    },
    changePpg_id(val) {
      getPpg_id_info({ ppg_id: val }).then(response => {
        this.temp.school = response.data.school
        this.temp.publicist = response.data.publicist
      }).catch((error) => {
        this.temp.school = null
        this.temp.publicist = null
      })
    },
    // 更新条目数据
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.delivery_time = parseTime(tempData.delivery_time, '{y}-{m}-{d}')
          if (tempData.buy_product instanceof Object) {
            tempData.buy_product = tempData.buy_product.id
            if (!tempData.apply_discount_state) {
              tempData.price = tempData.buy_product.price
              this.temp.price = tempData.price
            }
          } else {
            for (var obj of this.product_name_options) {
              if (obj.name === tempData.buy_product) {
                tempData.buy_product = obj.id
                if (!tempData.apply_discount_state) {
                  tempData.price = obj.price
                  this.temp.price = tempData.price
                }
                break
              }
            }
          }
          if (tempData.delivery instanceof Object) {
            tempData.delivery = tempData.delivery.id
          } else {
            for (obj of this.delivery_mode_options) {
              if (obj.name === tempData.delivery) {
                tempData.delivery = obj.id
                break
              }
            }
          }
          console.log(tempData)
          update_order(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                if (this.temp.buy_product instanceof Object) {
                  this.temp.buy_product = this.temp.buy_product.name
                } else {
                  for (var obj of this.product_name_options) {
                    if (obj.id === this.temp.buy_product) {
                      this.temp.buy_product = obj.name
                      break
                    }
                  }
                }
                if (this.temp.delivery instanceof Object) {
                  this.temp.delivery = this.temp.delivery.name
                } else {
                  for (obj of this.delivery_mode_options) {
                    if (obj.id === this.temp.delivery) {
                      this.temp.delivery = obj.name
                      break
                    }
                  }
                }
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
    // 删除条目
    del_list(index, id) {
      this.is_del_server = true
      del_list({ id: id }).then(() => {
        this.list.splice(index, 1)
        this.is_del_server = false
      }).catch((error) => {
        this.is_del_server = false
      })
    }
  },
  computed: {
    ...mapGetters(['name'])
  }
}
