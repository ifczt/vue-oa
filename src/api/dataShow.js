import request from '@/utils/request'

export function getSalesVolume() {
  return request({
    url: '/data_show/get_sales_volume',
    method: 'post',
    timeout: 100000
  })
}
export function getSalesYear() {
  return request({
    url: '/data_show/get_sales_year',
    method: 'post',
    timeout: 100000
  })
}
export function getSalesToday() {
  return request({
    url: '/data_show/get_sales_today',
    method: 'post',
    timeout: 100000
  })
}
export function getProblemInfo() {
  return request({
    url: '/data_show/get_problem_info',
    method: 'post',
    timeout: 100000
  })
}
export function getLineOptions(data) {
  return request({
    url: '/data_show/get_line_options',
    method: 'post',
    timeout: 100000,
    data
  })
}
export function getLineData(data) {
  return request({
    url: '/data_show/get_line_data',
    method: 'post',
    timeout: 100000,
    data
  })
}
export function getPieData() {
  return request({
    url: '/data_show/get_pie_data',
    method: 'post',
    timeout: 100000
  })
}
