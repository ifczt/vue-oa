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
