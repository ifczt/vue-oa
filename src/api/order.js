import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/order/list',
    method: 'post',
    query
  })
}

export function inputOrder(data) {
  return request({
    url: '/order/input',
    method: 'post',
    data
  })
}

export function getProductList() {
  return request({
    url: '/order/product_list',
    method: 'get'
  })
}

export function getExpressList() {
  return request({
    url: '/order/express_list',
    method: 'get'
  })
}

export function getPpg_id_info(data) {
  return request({
    url: '/order/ppg_id_info',
    method: 'post',
    data
  })
}