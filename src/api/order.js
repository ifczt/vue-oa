import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/order/list',
    method: 'post',
    timeout: 100000,
    data
  })
}

export function update_order(data) {
  return request({
    url: '/order/update_list',
    method: 'post',
    timeout: 10000,
    data
  })
}

export function del_list(data) {
  return request({
    url: '/order/del_list',
    method: 'post',
    timeout: 5000,
    data
  })
}

export function inputOrder(data) {
  return request({
    url: '/order/input',
    method: 'post',
    timeout: 10000,
    data
  })
}

export function getProductList(data) {
  return request({
    url: '/product_list',
    method: 'post',
    timeout: 5000,
    data
  })
}

export function getProductGroupList() {
  return request({
    url: '/product_group_list',
    method: 'get',
    timeout: 5000
  })
}

export function getExpressList() {
  return request({
    url: '/express_list',
    method: 'get',
    timeout: 5000
  })
}

export function getPpg_id_info(data) {
  return request({
    url: '/order/ppg_id_info',
    method: 'post',
    data
  })
}

export function apply_discount_state_change(data) {
  return request({
    url: '/order/apply_discount_state_change',
    method: 'post',
    data
  })
}
export function update_logistics(data) {
  return request({
    url: '/order/update_logistics',
    method: 'post',
    data
  })
}
export function get_finance_list(data) {
  return request({
    url: '/order/down_finance',
    method: 'post',
    data
  })
}
