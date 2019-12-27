import { edit_password } from '@/api/user'

export default {
  name: 'edit_password',
  data() {
    return {
      btn_loading: false,
      btn_show: true,
      passwordOld: '',
      passwordNew: ''
    }
  },
  // 调用函数
  methods: {
    // 标识类型
    passwordOld: false, passwordNew: false,
    // 提交编辑密码
    change_edit() {
      if (!this.passwordOld || !this.passwordNew) {
        this.$message({ message: '旧密码和新密码都必须填写，才可以修改。', type: 'error' })
        return
      }
      if (this.passwordNew.length < 6) {
        this.$message({ message: '密码这么简单不安全的', type: 'error' })
        return
      }
      if (this.passwordOld === this.passwordNew) {
        this.$message({ message: '密码都一样你为啥还要修改？', type: 'error' })
        return
      }
      const data = { 'password_old': this.passwordOld, 'password_new': this.passwordNew }
      this.btn_loading = true
      edit_password(data).then(response => {
        this.btn_loading = false
        this.$message({ message: '密码修改成，请牢记你的密码。', type: 'success' })
        this.btn_show = false
      }).catch(() => {
        this.btn_loading = false
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
