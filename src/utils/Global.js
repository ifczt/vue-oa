const delivery_mode_options = []
const product_name_options = []
const DELIVERY_STATE = ['未发货', '已签收', '换货', '退货', '在投', '再投', '问题件', '取消']
export const checkPhone = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('手机号不能为空'))
  } else {
    const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
    if (reg.test(value)) {
      callback()
    } else {
      return callback(new Error('请输入正确的手机号'))
    }
  }
}

export const loading_options = {
  lock: true,
  text: '加载服务中，请稍等',
  spinner: 'el-icon-loading',
  background: 'rgba(255,255,255,0.19)'
}
export default {
  delivery_mode_options,
  product_name_options,
  DELIVERY_STATE
}
