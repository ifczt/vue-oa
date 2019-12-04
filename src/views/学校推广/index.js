import tabPane from './components/TabPane'
import { CodeToText } from 'element-china-area-data'

import {
  get_region, input_ext, query_school
} from '@/api/school_ext'

export default {
  name: 'school_ext',
  components: { tabPane },
  data() {
    return {
      restaurants: [],
      dialogFormVisible: false,
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
      body_height: '600px'
    }
  },
  created() {
    this.body_height = window.innerHeight - 50 + 'px'
    this.get_region_list()
  },
  methods: {
    query_school_Select(item) {
      this.school_form.school_code = item.school_code
      this.school_form.province = item.province
      this.school_form.city = item.city
      this.school_form.area = item.area
    },
    input_school_ext() {
      const temp = JSON.parse(JSON.stringify(this.school_form))
      delete temp['school']
      input_ext(temp).then(() => {

      })
    },
    query_school(queryString, cb) {
      let restaurants = this.restaurants
      if (queryString.length < 2) {
        if (restaurants.length !== 0) {
          cb(restaurants)
        }
        return
      }
      // 缓存联想库为空时 或者查不到联想词时调用
      if (restaurants.length === 0 || restaurants.filter(this.createFilter(queryString)).length === 0) {
        query_school({ 'value': queryString }).then(response => {
          this.restaurants = restaurants = response.data
          // 调用 callback 返回建议列表的数据
          cb(restaurants)
        }).catch(() => {
          this.$message('无法从服务器中获取任何相关数据，请检查输入并重试')
        })
      } else {
        cb(restaurants.filter(this.createFilter(queryString)))
      }
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    get_region_list() {
      get_region().then(response => {
        const map_options = response.data
        for (const _map of map_options) {
          console.log(_map.label)
          _map.label = CodeToText[_map.label]
        }
        this.tabMapOptions = map_options
        this.activeName = response.data[0].key
      })
    }
  }
}
