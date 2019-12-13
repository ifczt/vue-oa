import { getExpressList } from '@/api/order'
import { hanlder_region_list, to_asarray } from '@/utils/server_data'
import { active_express, creat_express, del_express, edit_express } from '@/api/express'
import { get_RegionList, getUserRegionList, remove_city } from '@/api/region'
import { get_publicist_list } from '@/api/user'
import it from 'element-ui/src/locale/lang/it'
import { TextToCode } from 'element-china-area-data/dist/app'
import Pagination from '@/components/Pagination'
export default {
  name: 'manage_region',
  components: { Pagination },
  data() {
    return {
      total: 0,
      region_list: [],
      table_height: '520',
      table_loading: true,
      title: '新增派送方式',
      dialogFormVisible: false,
      btn_loading: false,
      list: [],
      copy_list: [],
      body_height: 600,
      listQuery: {
        page: 1,
        limit: 20
      }
    }
  },
  watch: {
    dialogFormVisible(val) {
      if (!val) {
        this.pick_id = null
        this.express_name = ''
      }
    }
  },
  computed: {},
  // 渲染完成时
  created() {
    this.body_height = window.innerHeight - 50
    get_publicist_list().then(response => {
      this.list = response.data
      this.copy_list = to_asarray(this.list, 5, false)
    })
  },
  // 调用函数
  methods: {
    edit(item) {
      this.dialogFormVisible = true
      this.title = '编辑派送方式'
      this.pick_item = item
    },
    e_delete(id) {
      del_express({ id: id }).then(() => {
        for (let i = 0; i < this.list.length; i++) {
          if (this.list[i].id === id) {
            this.list.splice(i, 1)
          }
        }
        this.copy_list = to_asarray(this.list, 5, false)
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
    tagClose(tag, item, index) {
      const tags = item.city
      const province = TextToCode[item.province].code
      remove_city({ province: province, city: tag.id, u_id: this.pick_item.u_id }).then(() => {
        tags.splice(tags.indexOf(tag), 1)
        if (tags.length === 0) {
          this.region_list.splice(index, 1)
        }
      })
    }
  }
}
