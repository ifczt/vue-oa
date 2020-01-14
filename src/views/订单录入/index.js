import { regionData, CodeToText } from 'element-china-area-data'
import {
  fetchList, inputOrder, getProductList, getExpressList,
  getPpg_id_info, del_list, update_order, getProductGroupList
} from '@/api/order'
import Pagination from '@/components/Pagination'
import { parseTime } from '@/utils'
import { Loading } from 'element-ui'
import { mapGetters } from 'vuex'
import { get_delivery_name, get_product_name, list_handle, to_server_order } from '@/utils/server_data'
import _global from '@/utils/Global'
import { checkPhone, loading_options } from '@/utils/Global'
import { today, tomorrow, after_tomorrow } from '@/utils/time_change'
import { isArray } from '@/utils/validate'

export default {
  name: 'OrderInput',
  list: [],
  components: { Pagination },
  data() {
    return {
      expands: [], // 只展开一行放入当前行id
      getRowKeys(row) {
        return row.id
      },
      is_del_server: false,
      is_server_input: false,
      // 中国区域信息
      area: [],
      china_options: regionData,
      // 快速选择派单日期
      picker_date: {
        disabledDate(time) {
          // 在科学计数法中，为了使公式简便，可以用带“E”的格式表示。例如1.03乘10的8次方，可简写为“1.03e8”的形式
          // 一天是24*60*60*1000 = 86400000 = 8.64e7
          return time.getTime() < (Date.now() - 8.64e7) + 2.88e7
        },
        shortcuts: [tomorrow, after_tomorrow]
      },
      // 列表
      list: [],
      // 列表总条目数
      total: 0,
      // 列表加载动画
      listLoading: false,
      // 跳转页数据- page当前页 limit一页多少条数据
      listQuery: {
        page: 1,
        limit: 20
      },
      // 表单数据
      temp: {
        buy_num: 1,
        // 备注
        remarks: '',
        // 编号
        id: '',
        // 加盟商
        publicist: '',
        publicist_name: '',
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
      product_group_options: [],
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
    get_group_options_fun() {
      getProductGroupList().then(response => {
        this.product_group_options = []
        for (const item of response.data) {
          const children = []
          const sub_product = item.sub_product.split(',')
          for (const i of this.product_name_options) {
            if (sub_product.includes(i.id.toString())) {
              children.push({
                label: i.name,
                value: i,
                price: i.price,
                id: i.id
              })
            }
          }
          this.product_group_options.push({ label: item.name, value: item.id, children: children })
        }
      })
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
        this.get_group_options_fun()
        this.list = list_handle(response.data.items)
        this.total = response.data.total
        this.listLoading = false
      })
    },
    // 重置表单
    resetTemp() {
      this.is_server_input = false
      this.temp = {
        buy_num: 1,
        remarks: '',
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
        apply_discount_state: false
      }
    },
    // 区域选中
    area_select(value) {
      let area_value = ''
      this.temp.area = value
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
          const send_temp = to_server_order(JSON.parse(JSON.stringify(this.temp)))
          send_temp.price = send_temp.price * send_temp.buy_num
          send_temp.consignee = send_temp.consignee === '2' ? send_temp.student : send_temp.parent
          this.temp.price = send_temp.price
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
          }).catch(() => {
            this.is_server_input = false
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
      this.temp.delivery_time = new Date(this.temp.delivery_time)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    changeProduct(item) {
      console.log(item)
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
          this.temp.publicist = response.data.publicist[0]
          this.temp.publicist_name = response.data.publicist[1]
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
          tempData.price = tempData.price * tempData.buy_num
          this.temp.price = tempData.price
          tempData.consignee = tempData.consignee === '2' ? tempData.student : tempData.parent
          if (isArray(tempData.publicist)) {
            tempData.publicist = tempData.publicist[0]
          } else {
            delete tempData.publicist
          }
          update_order(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.temp.buy_product = get_product_name(this.temp.buy_product)
                this.temp.delivery = get_delivery_name(this.temp.delivery)
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
