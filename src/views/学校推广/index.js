import tabPane from './components/TabPane'
import { CodeToText, provinceAndCityData, regionData } from 'element-china-area-data'
import Pagination from '@/components/Pagination'
import {
  add_school_log,
  add_school_server, del_school_log,
  edit_school_server,
  get_province, get_region_options, get_region_school, get_school_log, input_ext, query_school, update_school_log
} from '@/api/school_ext'
import fa from 'element-ui/src/locale/lang/fa'
import { to_server_order, to_server_region_school } from '@/utils/server_data'
import { checkPhone } from '@/utils/Global'
import { parseTime } from '@/utils'

export default {
  name: 'school_ext',
  components: { tabPane, Pagination },
  data() {
    return {
      show_log_index: 0,
      log_is_edit: false,
      log_btn_loading: false,
      log_form: {
        title: '',
        content: '',
        school_code: ''
      },
      school_log_add: false,
      school_log_loading: true,
      school_log_title: '日志查看',
      school_log_list: [],
      school_log_visible: false,
      cache_res: '',
      rules: {
        school_name: [{ required: true, message: '请输入学校名称' }],
        area: [{ required: true, message: '请选择学校区域', trigger: 'change' }],
        quality: [{ required: true, message: '请选择学校质量', trigger: 'change' }],
        title: [{ required: true, message: '请输入日志标题' }],
        content: [{ required: true, message: '请输入日志内容' }]
      },
      edit_add: '编辑学校信息',
      china_options: regionData,
      innerVisible: false,
      school_tip_region: '',
      school_tip_address: '',
      school_tip_quality: '',
      school_tip_show: false,
      // 省市区的下拉列表选项
      province_options: [],
      city_options: [],
      city_options_obj: {},
      quality_options: [],
      school_table_loading: false,
      total: 0,
      listQuery: {
        page: 1,
        limit: 20,
        province: '',
        city: '',
        quality: '',
        school_name: ''
      },
      drawer: false,
      restaurants: [],
      dialogFormVisible: false,
      school_list: [],
      school_edit_form: {
        school_code: '',
        school_name: '',
        school_address: '',
        province: '',
        city: '',
        area: '',
        quality: '',
        contact_info: '',
        region: ''
      },
      school_form: {
        dosage: '',
        sales_nums: '',
        school: '',
        school_code: '',
        province: '',
        city: '',
        area: ''
      },
      // 负责区域
      tabMapOptions: [],
      // 默认打开
      activeName: '',
      table_height: '520'
    }
  },
  watch: {
    school_log_add(val) {
      if (!val) {
        this.log_is_edit = false
        this.log_form.title = ''
        this.log_form.content = ''
      }
    },
    school_log_visible(val) {
      this.school_log_loading = val
    },
    // 选择下拉框后的提示信息 显示开关为FALSE时触发初始化
    school_tip_show(val) {
      if (!val) {
        this.school_tip_region = ''
        this.school_tip_quality = ''
        this.school_tip_address = ''
      }
    },
    // 新增学校宣传Dialog 显示开关为FALSE时触发初始化
    dialogFormVisible(val) {
      if (!val) {
        this.school_tip_show = false
        this.school_form = {
          dosage: '',
          sales_nums: '',
          school: '',
          school_code: '',
          province: '',
          city: '',
          area: ''
        }
      }
    },
    // 产科学校列表的Drawer 显示开关为FALSE时触发初始化
    drawer(val) {
      if (!val) {
        this.listQuery.province = ''
        this.listQuery.city = ''
        this.listQuery.quality = ''
        this.listQuery.school_name = ''
        this.city_options = []
      }
    }
  },
  created() {
    this.table_height = window.innerHeight - 230 + 'px'
    this.get_region_list()
  },
  methods: {
    show_log(index, id) {
      this.log_btn_loading = true
      this.log_is_edit = true
      this.show_log_index = index
      get_school_log({ school_code: this.log_form.school_code, id: id }).then(response => {
        this.log_form.title = response.data.title
        this.log_form.content = response.data.content
        this.log_form.id = response.data.id
        this.school_log_add = true
        this.log_btn_loading = false
      })
    },
    submit_del_log(index, id) {
      del_school_log({ id: id }).then(response => {
        this.$message({
          message: '成功删除',
          type: 'success'
        })
        this.school_log_list.splice(index, 1)
      })
    },
    submit_add_log(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.log_is_edit) {
            update_school_log(this.log_form).then(response => {
              this.school_log_add = false
              this.school_log_list.splice(this.show_log_index, 1, response.data)
              this.$message({
                message: '修改成功',
                type: 'success'
              })
            })
          } else {
            add_school_log(this.log_form).then(response => {
              this.$message({
                message: '写入成功',
                type: 'success'
              })
              this.school_log_add = false
              const _item = {
                title: this.log_form.title,
                id: response.data.id,
                input_time: response.data.input_time
              }
              this.school_log_list.unshift(_item)
            })
          }
        }
      })
    },
    see_school_log(item) {
      this.school_log_visible = true
      this.school_log_title = item.school_name + '-拜访日志查看'
      get_school_log({ school_code: item.school_code }).then(response => {
        this.school_log_list = response.data
        this.log_form.school_code = item.school_code
        this.school_log_loading = false
      })
    },
    tabsClick(tab) {
      if (this.cache_ref) {
        this.$refs[this.cache_ref][0].getList()
      }
      this.cache_ref = tab.name
    },
    show_edit_school() {
      this.innerVisible = true
      this.edit_add = '编辑学校信息'
    },
    school_edit() {
      this.$refs['school_form'].validate(valid => {
        if (valid) {
          if (this.school_edit_form.area instanceof Array) {
            this.school_edit_form.province = this.school_edit_form.area[0]
            this.school_edit_form.city = this.school_edit_form.area[1]
            this.school_edit_form.area = this.school_edit_form.area[2]
          }
          if (this.edit_add === '编辑学校信息') {
            edit_school_server(this.school_edit_form).then(response => {
              this.innerVisible = false
              this.$notify({
                title: '编辑成功',
                message: '成功修改学校，感谢你的付出',
                type: 'success',
                duration: 5000
              })
            })
          } else {
            add_school_server(this.school_edit_form).then(response => {
              this.innerVisible = false
              this.$notify({
                title: '添加成功',
                message: '成功添加学校，感谢你的付出',
                type: 'success',
                duration: 5000
              })
            })
          }
        }
      })
    },
    area_select(value) {
      this.school_edit_form.region = ''
      for (const i in value) {
        this.school_edit_form.region += CodeToText[value[i]]
      }
    },
    // 下拉列表选择后 将有市限制的 code转换为名称 没有市限制的在组件里的配置取
    change_options() {
      this.listQuery.city = ''
      const _arr = []
      if (this.city_options_obj[this.listQuery.province.id]) {
        if (this.city_options_obj[parseInt(this.listQuery.province.id)].length > 0 && typeof (this.city_options_obj[parseInt(this.listQuery.province.id)][0]) === 'string') {
          for (const _c of this.city_options_obj[parseInt(this.listQuery.province.id)]) {
            _arr.push({ name: CodeToText[_c], id: _c })
          }
          this.city_options_obj[parseInt(this.listQuery.province.id)] = _arr
        }
      } else {
        for (const i of provinceAndCityData) {
          if (i.value === this.listQuery.province.id) {
            for (const y of i.children) {
              _arr.push({ name: y.label, id: y.value })
            }
          }
        }
        this.city_options_obj[parseInt(this.listQuery.province.id)] = _arr
      }
      this.city_options = this.city_options_obj[parseInt(this.listQuery.province.id)]
    },
    // 获取负责区域下拉数据
    get_area_options() {
      get_region_options().then(response => {
        this.get_school_list()
        const province = []
        for (let _p of response.data.province) {
          _p = { name: CodeToText[_p], id: _p }
          province.push(_p)
        }
        this.province_options = province
        this.city_options_obj = response.data.city
      })
    },
    // 弹出学校查看drawer
    show_school() {
      this.drawer = true
      this.school_table_loading = true
      this.get_area_options()
    },
    search_school_list() {
      this.listQuery.page = 1
      this.get_school_list()
    },
    // 获取所负责的学校列表
    get_school_list() {
      const send_temp = to_server_region_school(JSON.parse(JSON.stringify(this.listQuery)))
      get_region_school(send_temp).then(response => {
        this.school_list = response.data.items
        this.total = response.data.total
        this.school_table_loading = false
      })
    },
    // 学校联想下拉选择后 赋值
    query_school_Select(item) {
      this.school_tip_show = true
      this.school_edit_form.quality = this.school_tip_quality = item.quality
      this.school_tip_region = CodeToText[item.province] + CodeToText[item.city] + CodeToText[item.area]
      this.school_edit_form.school_address = this.school_tip_address = item.school_address
      this.school_edit_form.school_name = item.value
      this.school_edit_form.contact_info = item.contact_info
      this.school_edit_form.school_code = item.school_code
      this.school_form.school_code = item.school_code
      this.school_edit_form.province = this.school_form.province = item.province
      this.school_edit_form.city = this.school_form.city = item.city
      this.school_edit_form.area = this.school_form.area = item.area
    },
    add_school() {
      this.innerVisible = true
      this.edit_add = '新增学校'
      this.school_edit_form = {
        school_code: '',
        school_name: '',
        school_address: '',
        province: '',
        city: '',
        area: '',
        quality: '',
        contact_info: ''
      }
    },
    // 插入学校宣传
    input_school_ext() {
      if (!this.school_form.school_code) {
        this.dialogFormVisible = false
        this.$notify({ title: '错误', message: '参数错误，请核对', type: 'error' })
        return
      }
      if (!this.school_form.dosage) {
        this.dialogFormVisible = false
        this.$notify({ title: '错误', message: '没有发放量，无需添加宣传', type: 'error' })
        return
      }
      if (!this.school_form.sales_nums) {
        this.dialogFormVisible = false
        this.$notify({ title: '错误', message: '没有是单量，无需添加宣传', type: 'error' })
        return
      }
      if (this.school_form.dosage < this.school_form.sales_nums) {
        this.dialogFormVisible = false
        this.$notify({ title: '错误', message: '发放量比是单量还少..怎么可能呢？请如实填写', type: 'error' })
        return
      }
      const temp = JSON.parse(JSON.stringify(this.school_form))
      delete temp['school']
      input_ext(temp).then(() => {
        this.$refs[this.school_form.province][0].getList()
        this.dialogFormVisible = false
        this.$notify({
          title: '新建成功',
          message: '成功新增宣传',
          type: 'success',
          duration: 5000
        })
      })
    },
    // 学校联想输入
    query_school(queryString, cb) {
      let restaurants = this.restaurants
      if (queryString.length < 2) {
        return
      }
      // 缓存联想库为空时 或者查不到联想词时调用
      query_school({ 'value': queryString }).then(response => {
        this.restaurants = restaurants = response.data
        // 调用 callback 返回建议列表的数据
        cb(restaurants)
      })
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    // 获取负责区域
    get_region_list() {
      get_province().then(response => {
        const map_options = response.data
        for (const _map of map_options) {
          _map.label = CodeToText[_map.label]
        }
        this.tabMapOptions = map_options.length !== 0 ? map_options : [{ 'label': '没有所负责区域', 'key': 'None' }]
        this.activeName = map_options.length !== 0 ? response.data[0].key : 'None'
      })
    }
  },
  beforeCreate() {
    window.document.body.style.backgroundColor = '#F0F2F5'
  },
  beforeDestroy() {
    window.document.body.style.backgroundColor = ''
  }
}
