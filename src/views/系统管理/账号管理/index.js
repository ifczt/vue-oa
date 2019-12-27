import { regionData, CodeToText } from 'element-china-area-data'
import Pagination from '@/components/Pagination'
import { active_user, add_user, del_user, edit_user, get_list, get_power_group } from '@/api/user'
import store from '@/store'

export default {
  name: 'AccManage',
  list: null,
  components: { Pagination },

  data() {
    const validateChinese = (rule, value, callback) => {
      const reg = new RegExp(/^[\u0391-\uFFE5]+$/)
      if (value === '') {
        callback(new Error('请输入名字'))
      }
      if (!reg.test(value)) {
        callback(new Error('只能输入真实姓名'))
      }
      callback()
    }
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (value.length < 6) {
          callback(new Error('密码不能低于6位数'))
        }
        if (this.temp.check_password !== '') {
          this.$refs.dataForm.validateField('checkPass')
        }
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.temp.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      username_dis: false,
      my_name: '',
      power_group: [],
      user_is_off_tips: ['启用账号', '禁用账号'],
      user_is_off_type: ['success', 'danger'],
      user_is_off_icon: ['el-icon-check', 'el-icon-close'],
      // 用户删除按钮开关-loading
      is_del_server: false,
      // 列表
      list: null,
      // 列表总条目数
      total: 0,
      // 列表加载动画
      listLoading: true,
      // 跳转页数据- page当前页 limit一页多少条数据
      listQuery: {
        page: 1,
        limit: 10,
        search_str: ''
      },
      // 表单数据
      temp: {
        // 姓名
        username: '',
        // 密码
        password: '',
        check_password: '',
        // 用户类别
        power: ''
      },
      // 隐藏表单
      dialogFormVisible: false,
      dialogStatus: '',
      // 弹窗标题
      textMap: {
        edit: '编辑用户',
        create: '添加用户'
      },
      // 规则
      rules: {
        username: [{ validator: validateChinese, trigger: 'blur' }],
        password: [{ validator: validatePass, trigger: 'blur' }],
        check_password: [{ validator: validatePass2, trigger: 'blur' }],
        power: [{ required: true, message: '请选择用户类别', trigger: 'change' }]
      },
      tableHeight: 800
    }
  },
  // html加载完成之前，执行
  created() {
    this.my_name = store.state.user.name
    this.tableHeight = window.innerHeight - 250
    get_power_group().then(response => {
      this.power_group = response.data
      this.getList()
    })
  },
  methods: {
    editUser(item) {
      this.resetTemp()
      this.dialogStatus = 'edit'
      this.username_dis = true
      this.temp.username = item.username
      this.temp.u_id = item.u_id
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 获取列表数据
    getList() {
      this.listLoading = true
      get_list(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    active(item) {
      active_user({ id: item.id, bool: item.active ? 0 : 1 }).then(() => {
        item.active = !item.active
      })
    },
    m_del_user(index, id) {
      this.is_del_server = true
      del_user({ id: id }).then(() => {
        this.list.splice(index, 1)
        this.is_del_server = false
      }).catch((error) => {
        this.is_del_server = false
      })
    },
    // 重置表单
    resetTemp() {
      this.username_dis = false
      this.temp = {
        u_id: '',
        username: '',
        password: '',
        check_password: '',
        power: ''
      }
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
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const send_temp = JSON.parse(JSON.stringify(this.temp))
          delete send_temp.check_password
          delete send_temp.u_id
          add_user(send_temp).then(response => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '新建成功',
              message: '成功插入数据',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    // 更新条目数据
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          delete tempData['username']
          delete tempData['check_password']
          edit_user(tempData).then(response => {
            for (const v of this.list) {
              if (v.username === this.temp.username) {
                const index = this.list.indexOf(v)
                this.list[index].power = response.data
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
    search() {
      this.listQuery.page = 1
      this.getList()
    }
  }
}
