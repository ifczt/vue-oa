import request from '@/utils/request'

export function getUserRegionList(data) {
  return request({
    url: '/territory/get_list',
    method: 'post',
    timeout: 5000,
    data
  })
}

export function remove_city(data) {
  return request({
    url: '/territory/remove_city',
    method: 'post',
    timeout: 5000,
    data
  })
}
export function remove_product(data) {
  return request({
    url: '/territory/remove_product',
    method: 'post',
    timeout: 5000,
    data
  })
}
export function inputTerr(data) {
  return request({
    url: '/territory/input',
    method: 'post',
    timeout: 5000,
    data
  })
}
export function removeTerr(data) {
  return request({
    url: 'territory/remove_province',
    method: 'post',
    timeout: 5000,
    data
  })
}
export function editTerr(data) {
  return request({
    url: 'territory/edit',
    method: 'post',
    timeout: 5000,
    data
  })
}
