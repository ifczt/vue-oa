import tabPane from './components/TabPane'
import { CodeToText, provinceAndCityData, regionData } from 'element-china-area-data'
import Pagination from '@/components/Pagination'
import {
  add_school_server,
  edit_school_server,
  get_region, get_region_options, get_region_school, input_ext, query_school
} from '@/api/school_ext'
import fa from 'element-ui/src/locale/lang/fa'
import { to_server_order, to_server_region_school } from '@/utils/server_data'
import { checkPhone } from '@/utils/Global'

export default {
  name: 'school_ext',
  components: { tabPane, Pagination },
  data() {
    return {
      rules: {
        school_name: [{ required: true, message: '请输入学校名称' }],
        area: [{ required: true, message: '请选择学校区域',trigger: "change"}],
        quality: [{ required: true, message: '请选择学校质量',trigger: 'change' }]
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
      body_height: '600'
    }
  },
  watch: {
    drawer(val) {
      if (!val) {
        this.listQuery.province = ''
        this.listQuery.city = ''
        this.listQuery.quality = ''
        this.listQuery.school_name = ''
      }
    }
  },
  created() {
    this.body_height = window.innerHeight - 50
    this.get_region_list()
  },
  methods: {
    school_edit_form: undefined,
    show_edit_school() {
      this.innerVisible = true
      this.edit_add = '编辑学校信息'
    },
    school_edit() {
      this.$refs['school_form'].validate(valid => {
        if (valid) {
          console.log(this.school_edit_form.area)
          if(this.school_edit_form.area instanceof Array){
            this.school_edit_form.province = this.school_edit_form.area[0]
            this.school_edit_form.city = this.school_edit_form.area[1]
            this.school_edit_form.area = this.school_edit_form.area[2]
          }
          if (this.edit_add === '编辑学校信息') {
            edit_school_server(this.school_edit_form).then(response => {
              this.innerVisible = false;
              this.$notify({
                title: '编辑成功',
                message: '成功修改学校，感谢你的付出',
                type: 'success',
                duration: 5000
              })
            })
          } else {
            add_school_server(this.school_edit_form).then(response => {
              this.innerVisible = false;
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
      console.log(this.city_options_obj[this.listQuery.province.id])
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
      const temp = JSON.parse(JSON.stringify(this.school_form))
      delete temp['school']
      input_ext(temp).then(() => {
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
      get_region().then(response => {
        const map_options = response.data
        for (const _map of map_options) {
          _map.label = CodeToText[_map.label]
        }
        this.tabMapOptions = map_options
        this.activeName = response.data[0].key
      })
    }
  }
}
