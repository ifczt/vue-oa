import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    timeout: 0,
    data
  })
  console.log(process.env.BASE_API, 'ifcztweb')
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'post'
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function edit_password(data) {
  return request({
    url: '/user/edit_password',
    method: 'post',
    data
  })
}

export function get_power_group() {
  return request({
    url: '/user/get_power_group',
    method: 'get'
  })
}

export function add_user(data) {
  return request({
    url: '/user/add',
    method: 'post',
    data
  })
}

export function edit_user(data) {
  return request({
    url: '/user/edit',
    method: 'post',
    data
  })
}

export function del_user(data) {
  return request({
    url: '/user/del',
    method: 'post',
    timeout: 5000,
    data
  })
}

export function active_user(data) {
  return request({
    url: '/user/active',
    method: 'post',
    timeout: 5000,
    data
  })
}

export function get_list(data) {
  return request({
    url: '/user/get_list',
    method: 'post',
    timeout: 5000,
    data
  })
}

export function get_publicist_list() {
  return request({
    url: '/user/get_publicist_list',
    method: 'post',
    timeout: 5000
  })
}
export function query_name(data) {
  return request({
    url: '/user/query_name',
    method: 'post',
    data
  })
}
