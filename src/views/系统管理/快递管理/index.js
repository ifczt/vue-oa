import { getExpressList } from '@/api/order'
import { to_asarray } from '@/utils/server_data'
import { active_express, creat_express, del_express, edit_express } from '@/api/express'

export default {
  name: 'manage_express',
  data() {
    return {
      pick_item: null,
      title: '新增派送方式',
      express_name: '',
      dialogFormVisible: false,
      btn_loading: false,
      list: [],
      copy_list: [],
      body_height: 600
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
    getExpressList().then(response => {
      this.list = response.data
      this.copy_list = to_asarray(this.list, 5)
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
        this.copy_list = to_asarray(this.list, 5)
      })
    },
    active(item, on) {
      item.active = !item.active
      active_express({ id: item.id, bool: on ? 0 : 1 }).then(() => {
      })
    },
    show_add_express() {
      this.dialogFormVisible = true
      this.title = '新增派送方式'
    },
    // 生成快递公司
    creat_express() {
      if (this.express_name.length < 2) {
        this.$message('请认真输入，瓜皮。')
        return
      }
      if (this.title === '新增派送方式') {
        creat_express({ name: this.express_name }).then(response => {
          this.dialogFormVisible = false
          this.$message({ message: '插入数据成功。', type: 'success' })
          this.list.push({ name: this.express_name, id: response.data.id, active: response.data.active })
          this.copy_list = to_asarray(this.list, 5)
        })
      } else {
        edit_express({ id: this.pick_item.id, name: this.express_name }).then(() => {
          this.dialogFormVisible = false
          this.$message({ message: '编辑数据成功。', type: 'success' })
        })
      }
      this.pick_item = null
    }
  },
  beforeCreate() {
    window.document.body.style.backgroundColor = '#F0F2F5'
  },
  beforeDestroy() {
    window.document.body.style.backgroundColor = ''
  }
}
