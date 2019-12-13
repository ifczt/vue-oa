import request from '@/utils/request'

export function creat_express(data) {
  return request({
    url: '/express/creat',
    method: 'post',
    timeout: 5000,
    data
  })
}

export function edit_express(data) {
  return request({
    url: '/express/edit',
    method: 'post',
    timeout: 5000,
    data
  })
}

export function active_express(data) {
  return request({
    url: '/express/active',
    method: 'post',
    timeout: 5000,
    data
  })
}

export function del_express(data) {
  return request({
    url: '/express/del',
    method: 'post',
    timeout: 5000,
    data
  })
}
