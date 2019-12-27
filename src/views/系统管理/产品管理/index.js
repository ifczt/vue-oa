import { to_asarray } from '@/utils/server_data'
import { getProductList } from '@/api/order'
import { active_product, creat_product, del_product, edit_product } from '@/api/product'

export default {
  name: 'manage_product',
  data() {
    return {
      pick_item: null,
      title: '新增产品',
      product_name: '',
      price: 0,
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
        this.pick_item = null
        this.price = 0
        this.product_name = ''
      }
    }
  },
  computed: {},
  // 渲染完成时
  created() {
    this.body_height = window.innerHeight - 50
    getProductList().then(response => {
      this.list = response.data
      this.copy_list = to_asarray(this.list, 5)
    })
  },
  // 调用函数
  methods: {
    edit(item) {
      this.dialogFormVisible = true
      this.title = '编辑产品信息'
      this.pick_item = item
      this.product_name = item.name
      this.price = item.price
    },
    e_delete(id) {
      del_product({ id: id }).then(() => {
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
      active_product({ id: item.id, bool: on ? 0 : 1 }).then(() => {
      })
    },
    show_add_product() {
      this.dialogFormVisible = true
      this.title = '新增产品'
    },
    // 生成快递公司
    creat_express() {
      if (this.product_name.length < 2) {
        this.$message('请认真输入，瓜皮。')
        return
      }
      if (this.title === '新增产品') {
        creat_product({ name: this.product_name, price: this.price }).then(response => {
          this.dialogFormVisible = false
          this.$message({ message: '新增产品成功。', type: 'success' })
          this.list.push({
            name: this.product_name,
            price: this.price,
            id: response.data.id,
            active: response.data.active
          })
          this.copy_list = to_asarray(this.list, 5)
        })
      } else {
        edit_product({ price: this.price, id: this.pick_item.id, name: this.product_name }).then(() => {
          this.dialogFormVisible = false
          this.pick_item.name = this.product_name
          this.pick_item.price = this.price
          this.$message({ message: '编辑数据成功。', type: 'success' })
        })
      }
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
