import { getExpressList, getProductList } from '@/api/order'
import { hanlder_region_list, randomColor, server_terr_data, to_asarray, view_terr_data } from '@/utils/server_data'
import { active_express, creat_express, del_express, edit_express } from '@/api/express'
import {
  editTerr,
  get_RegionList,
  getUserRegionList,
  inputTerr,
  remove_city,
  remove_product,
  removeTerr
} from '@/api/region'
import { get_publicist_list } from '@/api/user'
import it from 'element-ui/src/locale/lang/it'
import { TextToCode } from 'element-china-area-data/dist/app'
import Pagination from '@/components/Pagination'
import { first_half_year, second_half_year, six_month, t_month, t_year, this_year } from '@/utils/time_change'
import _global, { getCity, getProvince, loading_options } from '@/utils/Global'
import { Loading } from 'element-ui'
import el from 'element-ui/src/locale/lang/el'

export default {
  name: 'manage_region',
  components: { Pagination },
  data() {
    return {
      province_dis: false,
      temp: { time_slot: '', province: '', city: '', product: '', publicist: '', eff_time: '', start_time: '' },
      // 快速选择时间段
      picker_time_slot: {
        shortcuts: [this_year, first_half_year, second_half_year]
      },
      colors: ['', 'success', 'info', 'warning', 'danger'],
      total: 0,
      region_list: [],
      contract_list: [],
      table_height: '520',
      table_loading: true,
      contract_loading: true,
      title: '新增派送方式',
      embed_title: '',
      dialogFormVisible: false,
      embedFormVisible: false,
      is_edit_embed: false,
      btn_loading: false,
      list: [],
      copy_list: [],
      listQuery: { page: 1, limit: 20 },
      province_options: [],
      city_options: [],
      product_options: [],
      edit_index: null
    }
  },
  watch: {
    // 嵌套Dialog -- 签订合约 或是编辑合约
    embedFormVisible(val) {
      if (val) {
        if (_global.product_name_options.length === 0) {
          getProductList().then(response => {
            _global.product_name_options = response.data
            this.product_options = _global.product_name_options
          })
        }
        this.product_options = _global.product_name_options
        if (this.is_edit_embed) {
          this.contract_loading = false
          this.province_dis = true
          this.embed_title = '编辑' + this.pick_item.username + '的合同'
        } else {
          this.contract_loading = false
          this.province_dis = false
          this.embed_title = '和' + this.pick_item.username + '签订合约'
        }
      } else {
        this.edit_index = null
        this.is_edit_embed = false
        this.temp.city_options = []
        this.temp = { time_slot: '', province: '', city: '', product: '', publicist: '', eff_time: '', start_time: '' }
      }
    },
    dialogFormVisible(val) {
      if (!val) {
        this.pick_id = null
        this.express_name = ''
        this.pick_item = null
        this.list = []
        this.region_list = []
      }
    }
  },
  computed: {},
  // 渲染完成时
  created() {
    Loading.service(loading_options)
    get_publicist_list().then(response => {
      this.list = response.data
      this.copy_list = to_asarray(this.list, 5, false)
      Loading.service(null).close()
    })
    this.province_options = getProvince()
  },
  // 调用函数
  methods: {
    edit(item) {
      this.dialogFormVisible = true
      this.title = '编辑派送方式-' + item.username
      this.pick_item = item
    },
    remove_province(index, province) {
      removeTerr({ u_id: this.pick_item.u_id, province: TextToCode[province].code }).then(() => {
        this.region_list.splice(index, 1)
        this.$message({ message: '成功解除合约', type: 'success' })
      })
    },
    active(item, on) {
      item.active = !item.active
      active_express({ id: item.id, bool: on ? 0 : 1 }).then(() => {
      })
    },
    show_region(item) {
      this.dialogFormVisible = true
      this.title = '负责区域管理-' + item.username
      this.pick_item = item
      this.get_region_list()
    },
    get_region_list() {
      getUserRegionList({ u_id: this.pick_item.u_id }).then(response => {
        this.table_loading = false
        this.total = response.data.total
        this.region_list = hanlder_region_list(response.data.item)
      })
    },
    product_tagClose(tag, item, index) {
      const tags = item.product
      const province = TextToCode[item.province].code
      remove_product({ province: province, product: tag.id, u_id: this.pick_item.u_id }).then(() => {
        tags.splice(tags.indexOf(tag), 1)
        if (tags.length === 0) {
          this.region_list.splice(index, 1)
        }
      })
    },
    tagClose(tag, item, index) {
      const tags = item.city
      const province = TextToCode[item.province].code
      remove_city({ province: province, city: tag.id, u_id: this.pick_item.u_id }).then(() => {
        tags.splice(tags.indexOf(tag), 1)
        if (tags.length === 0) {
          this.region_list.splice(index, 1)
        }
      })
    },
    change_province() {
      this.city_options = getCity(this.temp.province)
    },
    change_city() {
      if (this.temp.city.indexOf('') !== -1) {
        this.temp.city = ['']
      }
    },
    clear_province() {
      this.temp.city = []
    },
    input_terr() {
      if (this.is_edit_embed) {
        this.edit_contract_to_server()
        return
      }
      this.temp.publicist = this.pick_item.u_id
      const send_temp = server_terr_data(JSON.parse(JSON.stringify(this.temp)))
      inputTerr(send_temp).then(() => {
        this.embedFormVisible = false
        this.region_list.unshift(view_terr_data(JSON.parse(JSON.stringify(this.temp))))
        this.$notify({ type: 'success', message: '再签约同一个省份将会进行数据重叠部分覆盖。', title: '签约成功' })
      })
    },
    edit_contract(item, index) {
      this.is_edit_embed = true
      this.embedFormVisible = true
      this.temp.province = TextToCode[item.province].code
      this.change_province()
      this.edit_index = index
    },
    edit_contract_to_server() {
      this.temp.publicist = this.pick_item.u_id
      const send_temp = server_terr_data(JSON.parse(JSON.stringify(this.temp)))
      editTerr(send_temp).then(() => {
        this.embedFormVisible = false
        this.region_list.splice(this.edit_index, 1, view_terr_data(JSON.parse(JSON.stringify(this.temp))))
        this.$notify({ type: 'success', message: '已覆盖签约。', title: '修订成功' })
      })
    }
  },
  beforeCreate() {
    window.document.body.style.backgroundColor = '#F0F2F5'
    next()
  },
  beforeDestroy() {
    window.document.body.style.backgroundColor = ''
    next()
  }
}
