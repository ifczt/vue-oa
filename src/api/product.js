import request from '@/utils/request'

export function creat_product(data) {
  return request({
    url: '/product/creat',
    method: 'post',
    timeout: 5000,
    data
  })
}

export function edit_product(data) {
  return request({
    url: '/product/edit',
    method: 'post',
    timeout: 5000,
    data
  })
}

export function active_product(data) {
  return request({
    url: '/product/active',
    method: 'post',
    timeout: 5000,
    data
  })
}

export function del_product(data) {
  return request({
    url: '/product/del',
    method: 'post',
    timeout: 5000,
    data
  })
}
