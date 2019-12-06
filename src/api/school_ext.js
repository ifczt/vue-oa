import request from '@/utils/request'

export function get_region() {
  return request({
    url: '/territory/region',
    method: 'get',
    timeout: 0
  })
}

export function get_region_school(data) {
  return request({
    url: '/school/get_region_school',
    method: 'post',
    timeout: 0,
    data
  })
}

export function get_ppg_id(data) {
  return request({
    url: '/school_ext/get_ppg_id',
    method: 'post',
    timeout: 0,
    data
  })
}

export function query_school(data) {
  return request({
    url: '/school/query_school',
    method: 'post',
    timeout: 0,
    data
  })
}

export function input_ext(data) {
  return request({
    url: '/school_ext/input_ext',
    method: 'post',
    timeout: 0,
    data
  })
}

export function get_region_options() {
  return request({
    url: '/territory/get_region_options',
    method: 'get',
    timeout: 0
  })
}

export function edit_school_server(data) {
  return request({
    url: '/school/edit',
    method: 'post',
    timeout: 0,
    data
  })
}
